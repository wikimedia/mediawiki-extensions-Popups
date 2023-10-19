/**
 * @module actions
 */

import types from './actionTypes';
import wait from './wait';
import { createNullModel, previewTypes, getDwellDelay } from './preview/model';
import { FETCH_START_DELAY, PREVIEW_SEEN_DURATION, ABANDON_END_DELAY } from './constants';

/**
 * Mixes in timing information to an action.
 *
 * Warning: the `baseAction` parameter is modified and returned.
 *
 * @param {Object} baseAction
 * @return {Object}
 */
function timedAction( baseAction ) {
	baseAction.timestamp = mw.now();

	return baseAction;
}

/**
 * Represents Page Previews booting.
 *
 * When a Redux store is created, the `@@INIT` action is immediately
 * dispatched to it. To avoid overriding the term, we refer to booting rather
 * than initializing.
 *
 * Page Previews persists critical pieces of information to local storage.
 * Since reading from and writing to local storage are synchronous, Page
 * Previews is booted when the browser is idle (using
 * [`mw.requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
 * so as not to impact latency-critical events.
 *
 * @param {Object} initiallyEnabled Allows to disable individual popup types while still showing the
 *  footer link
 * @param {mw.user} user
 * @param {ext.popups.UserSettings} userSettings
 * @param {mw.Map} config The config of the MediaWiki client-side application,
 *  i.e. `mw.config`
 * @param {string} url
 * @return {Object}
 */
export function boot(
	initiallyEnabled,
	user,
	userSettings,
	config,
	url
) {
	const editCount = config.get( 'wgUserEditCount' );

	return {
		type: types.BOOT,
		initiallyEnabled,
		// This is only used for logging
		isNavPopupsEnabled: config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
		sessionToken: user.sessionId(),
		pageToken: user.getPageviewToken(),
		page: {
			url,
			title: config.get( 'wgTitle' ),
			namespaceId: config.get( 'wgNamespaceNumber' ),
			id: config.get( 'wgArticleId' )
		},
		user: {
			isAnon: user.isAnon() || mw.user.isTemp(),
			editCount
		}
	};
}

/**
 * Represents Page Previews fetching data via the gateway.
 *
 * @param {Gateway} gateway
 * @param {mw.Title} title
 * @param {HTMLAnchorElement} el
 * @param {string} token The unique token representing the link interaction that
 *  triggered the fetch
 * @param {string} type One of the previewTypes.TYPE_… constants
 * @return {Redux.Thunk}
 */
export function fetch( gateway, title, el, token, type ) {
	const titleText = title.getPrefixedDb(),
		namespaceId = title.namespace;

	return ( dispatch ) => {
		const xhr = gateway.fetchPreviewForTitle( title, el );

		dispatch( timedAction( {
			type: types.FETCH_START,
			el,
			title: titleText,
			namespaceId,
			promise: xhr
		} ) );

		const chain = xhr
			.then( ( result ) => {
				dispatch( timedAction( {
					type: types.FETCH_END,
					el
				} ) );

				return result;
			} )
			.catch( ( err, data ) => {
				const exception = new Error( err );
				const fetchType = data && data.textStatus && data.textStatus === 'abort' ?
					types.FETCH_ABORTED : types.FETCH_FAILED;

				exception.data = data;
				dispatch( {
					type: fetchType,
					el,
					token
				} );
				// Keep the request promise in a rejected status since it failed.
				throw exception;
			} );

		return Promise.all( [
			chain,
			wait( getDwellDelay( type ) )
		] )
			.then( ( [ result ] ) => {
				dispatch( {
					type: types.FETCH_COMPLETE,
					el,
					result,
					token
				} );
			} )
			.catch( ( ex ) => {
				const result = ex.data;
				let showNullPreview = true;
				// All failures, except those due to being offline or network error,
				// should present "There was an issue displaying this preview".
				// e.g.:
				// - Show (timeout): data="http" {xhr: {…}, textStatus: "timeout",
				//   exception: "timeout"}
				// - Show (bad MW request): data="unknown_action" {error: {…}}
				// - Show (RB 4xx): data="http" {xhr: {…}, textStatus: "error",
				//   exception: "Bad Request"}
				// - Show (RB 5xx): data="http" {xhr: {…}, textStatus: "error",
				//   exception: "Service Unavailable"}
				// - Suppress (offline or network error): data="http"
				//   result={xhr: {…}, textStatus: "error", exception: ""}
				// - Abort: data="http"
				//   result={xhr: {…}, textStatus: "abort", exception: "abort"}

				if ( result && result.xhr && result.xhr.readyState === 0 ) {
					const isNetworkError = result.textStatus === 'error' && result.exception === '';
					showNullPreview = !( isNetworkError || result.textStatus === 'abort' );
				}

				if ( showNullPreview ) {
					dispatch( {
						type: types.FETCH_COMPLETE,
						el,
						result: createNullModel( titleText, title.getUrl() ),
						token
					} );
				}
			} );
	};
}

/**
 * Represents the user dwelling on a link, either by hovering over it with
 * their mouse or by focussing it using their keyboard or an assistive device.
 *
 * @param {mw.Title} title
 * @param {HTMLAnchorElement} el
 * @param {ext.popups.Measures} measures
 * @param {Gateway} gateway
 * @param {Function} generateToken
 * @param {string} type One of the previewTypes.TYPE_… constants
 * @return {Redux.Thunk}
 */
export function linkDwell( title, el, measures, gateway, generateToken, type ) {
	const token = generateToken(),
		titleText = title.getPrefixedDb(),
		namespaceId = title.namespace;

	return ( dispatch, getState ) => {
		const promise = wait( FETCH_START_DELAY );
		const action = timedAction( {
			type: types.LINK_DWELL,
			el,
			previewType: type,
			measures,
			token,
			title: titleText,
			namespaceId,
			promise
		} );

		dispatch( action );

		// Has the new generated token been accepted?
		function isNewInteraction() {
			return getState().preview.activeToken === token;
		}

		if ( !isNewInteraction() ) {
			return Promise.resolve();
		}

		return promise.then( () => {
			const previewState = getState().preview;
			const enabledValue = previewState.enabled[ type ];
			// Note: Only reference previews and default previews can be disabled at this point.
			// If there is no UI the enabledValue is always true.
			const isEnabled = typeof enabledValue === 'undefined' ? true : enabledValue;

			// The `enabled` flags allow to disable individual popup types while still showing the
			// footer link. This comes from the boot() action (called `initiallyEnabled` there) and
			// the preview() reducer.
			// If the preview type has not been enabled, we ignore it as it cannot be disabled (currently)
			// by the UI.
			if ( isEnabled && isNewInteraction() ) {
				return dispatch( fetch( gateway, title, el, token, type ) );
			}
		} );
	};
}

/**
 * Represents the user abandoning a link, either by moving their mouse away
 * from it or by shifting focus to another UI element using their keyboard or
 * an assistive device, or abandoning a preview by moving their mouse away
 * from it.
 *
 * @return {Redux.Thunk}
 */
export function abandon() {
	return ( dispatch, getState ) => {
		const { activeToken: token, promise } = getState().preview;

		if ( !token ) {
			return Promise.resolve();
		}

		dispatch( timedAction( {
			type: types.ABANDON_START,
			token
		} ) );

		if ( 'abort' in promise ) {
			// Immediately request that any outstanding fetch request be abandoned. Do not wait.
			promise.abort();
		}

		return wait( ABANDON_END_DELAY )
			.then( () => {
				dispatch( {
					type: types.ABANDON_END,
					token
				} );
			} );
	};
}

/**
 * Represents the user clicking on a link with their mouse, keyboard, or an
 * assistive device.
 *
 * @param {HTMLAnchorElement} el
 * @return {Object}
 */
export function linkClick( el ) {
	return timedAction( {
		type: types.LINK_CLICK,
		el
	} );
}

/**
 * Represents the user dwelling on a preview with their mouse.
 *
 * @return {Object}
 */
export function previewDwell() {
	return {
		type: types.PREVIEW_DWELL
	};
}

/**
 * Represents a preview being shown to the user.
 *
 * This action is dispatched by the `./changeListeners/render.js` change
 * listener.
 *
 * @param {string} token
 * @return {Object}
 */
export function previewShow( token ) {
	return ( dispatch, getState ) => {
		dispatch(
			timedAction( {
				type: types.PREVIEW_SHOW,
				token
			} )
		);

		return wait( PREVIEW_SEEN_DURATION )
			.then( () => {
				const state = getState(),
					preview = state.preview,
					fetchResponse = preview && preview.fetchResponse,
					currentToken = preview && preview.activeToken,
					validType = fetchResponse && [
						previewTypes.TYPE_PAGE,
						previewTypes.TYPE_DISAMBIGUATION
					].indexOf( fetchResponse.type ) > -1;

				if (
					// Check the pageview can still be associated with original event
					currentToken && currentToken === token &&
					// and the preview is still active and of type `page`
					fetchResponse && validType
				) {
					dispatch( {
						type: types.PREVIEW_SEEN,
						title: fetchResponse.title,
						pageId: fetchResponse.pageId,
						// The existing version of summary endpoint does not
						// provide namespace information, but new version
						// will. Given we only show pageviews for main namespace
						// this is hardcoded until the newer version is available.
						namespace: 0
					} );
				}
			} );
	};
}

/**
 * Represents the situation when a pageview has been logged
 * (see previewShow and PREVIEW_SEEN action type)
 *
 * @return {Object}
 */
export function pageviewLogged() {
	return {
		type: types.PAGEVIEW_LOGGED
	};
}

/**
 * Represents the user clicking either the "Enable previews" footer menu link,
 * or the "cog" icon that's present on each preview.
 *
 * @return {Object}
 */
export function showSettings() {
	return {
		type: types.SETTINGS_SHOW
	};
}

/**
 * Represents the user closing the settings dialog and saving their settings.
 *
 * @return {Object}
 */
export function hideSettings() {
	return {
		type: types.SETTINGS_HIDE
	};
}

/**
 * Represents the user saving their settings.
 *
 * N.B. This action returns a Redux.Thunk not because it needs to perform
 * asynchronous work, but because it needs to query the global state for the
 * current enabled state. In order to keep the enabled state in a single
 * place (the preview reducer), we query it and dispatch it as `oldValue`
 * so that other reducers (like settings) can act on it without having to
 * duplicate the `enabled` state locally.
 * See docs/adr/0003-keep-enabled-state-only-in-preview-reducer.md for more
 * details.
 *
 * @param {Object} enabled Mapping preview type identifiers to boolean flags
 * @return {Redux.Thunk}
 */
export function saveSettings( enabled ) {
	return ( dispatch, getState ) => {
		dispatch( {
			type: types.SETTINGS_CHANGE,
			oldValue: getState().preview.enabled,
			newValue: enabled
		} );
	};
}

/**
 * Represents the queued statsv event being logged.
 * See `mw.popups.changeListeners.statsv` change listener.
 *
 * @return {Object}
 */
export function statsvLogged() {
	return {
		type: types.STATSV_LOGGED
	};
}
