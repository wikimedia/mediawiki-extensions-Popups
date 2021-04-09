/**
 * @module popups
 */

import * as Redux from 'redux';
import * as ReduxThunk from 'redux-thunk';

import createPagePreviewGateway from './gateway/page';
import createReferenceGateway from './gateway/reference';
import createUserSettings from './userSettings';
import createPreviewBehavior from './previewBehavior';
import createSettingsDialogRenderer from './ui/settingsDialogRenderer';
import registerChangeListener from './changeListener';
import createIsPagePreviewsEnabled from './isPagePreviewsEnabled';
import { fromElement as titleFromElement } from './title';
import { init as rendererInit } from './ui/renderer';
import createExperiments from './experiments';
import { isEnabled as isStatsvEnabled } from './instrumentation/statsv';
import changeListeners from './changeListeners';
import * as actions from './actions';
import reducers from './reducers';
import createMediaWikiPopupsObject from './integrations/mwpopups';
import { previewTypes, getPreviewType } from './preview/model';
import isReferencePreviewsEnabled from './isReferencePreviewsEnabled';
import setUserConfigFlags from './setUserConfigFlags';

const EXCLUDED_LINK_SELECTORS = [
	'.extiw',
	'.image',
	'.new',
	'.internal',
	'.external',
	'.mw-cite-backlink a',
	'.oo-ui-buttonedElement-button',
	'.ve-ce-surface a', // T259889
	'.cancelLink a'
];

/**
 * @typedef {Function} EventTracker
 *
 * An analytics event tracker, i.e. `mw.track`.
 *
 * @param {string} topic
 * @param {Object} data
 *
 * @global
 */

/**
 * Gets the appropriate analytics event tracker for logging metrics to StatsD
 * via [the "StatsD timers and counters" analytics event protocol][0].
 *
 * If logging metrics to StatsD is enabled for the duration of the user's
 * session, then the appriopriate function is `mw.track`; otherwise it's
 * `() => {}`.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/29c864a0/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} user
 * @param {Object} config
 * @param {Experiments} experiments
 * @return {EventTracker}
 */
function getStatsvTracker( user, config, experiments ) {
	return isStatsvEnabled( user, config, experiments ) ? mw.track : () => {};
}

/**
 * Gets the appropriate analytics event tracker for logging virtual pageviews.
 *
 * @param {Object} config
 * @return {EventTracker}
 */
function getPageviewTracker( config ) {
	return config.get( 'wgPopupsVirtualPageViews' ) ? mw.track : () => {
		// NOP
	};
}

/**
 * Subscribes the registered change listeners to the
 * [store](http://redux.js.org/docs/api/Store.html#store).
 *
 * @param {Redux.Store} store
 * @param {Object} registerActions
 * @param {UserSettings} userSettings
 * @param {Function} settingsDialog
 * @param {PreviewBehavior} previewBehavior
 * @param {EventTracker} statsvTracker
 * @param {EventTracker} pageviewTracker
 * @return {void}
 */
function registerChangeListeners(
	store, registerActions, userSettings, settingsDialog, previewBehavior,
	statsvTracker, pageviewTracker
) {
	registerChangeListener( store, changeListeners.footerLink( registerActions ) );
	registerChangeListener( store, changeListeners.linkTitle() );
	registerChangeListener( store, changeListeners.render( previewBehavior ) );
	registerChangeListener(
		store, changeListeners.statsv( registerActions, statsvTracker ) );
	registerChangeListener(
		store, changeListeners.syncUserSettings( userSettings ) );
	registerChangeListener(
		store, changeListeners.settings( registerActions, settingsDialog ) );
	registerChangeListener( store,
		changeListeners.pageviews( registerActions, pageviewTracker )
	);
}

/*
 * Initialize the application by:
 * 1. Initializing side-effects and "services"
 * 2. Creating the state store
 * 3. Binding the actions to such store
 * 4. Registering change listeners
 * 5. Triggering the boot action to bootstrap the system
 * 6. When the page content is ready:
 *   - Initializing the renderer
 *   - Binding hover and click events to the eligible links to trigger actions
 */
( function init() {
	setUserConfigFlags( mw.config );

	let compose = Redux.compose;
	const
		// So-called "services".
		generateToken = mw.user.generateRandomSessionId,
		pagePreviewGateway = createPagePreviewGateway( mw.config ),
		referenceGateway = createReferenceGateway(),
		userSettings = createUserSettings( mw.storage ),
		referencePreviewsState = isReferencePreviewsEnabled( mw.user, userSettings, mw.config ),
		settingsDialog = createSettingsDialogRenderer( referencePreviewsState !== null ),
		experiments = createExperiments( mw.experiments ),
		statsvTracker = getStatsvTracker( mw.user, mw.config, experiments ),
		pageviewTracker = getPageviewTracker( mw.config ),
		initiallyEnabled = {
			[ previewTypes.TYPE_PAGE ]:
				createIsPagePreviewsEnabled( mw.user, userSettings, mw.config ),
			[ previewTypes.TYPE_REFERENCE ]: referencePreviewsState
		};

	// If debug mode is enabled, then enable Redux DevTools.
	if ( mw.config.get( 'debug' ) ||
		/* global process */
		process.env.NODE_ENV !== 'production' ) {
		// eslint-disable-next-line no-underscore-dangle
		compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	}

	const store = Redux.createStore(
		Redux.combineReducers( reducers ),
		compose( Redux.applyMiddleware(
			ReduxThunk.default
		) )
	);
	const boundActions = Redux.bindActionCreators( actions, store.dispatch );
	const previewBehavior = createPreviewBehavior( mw.user, boundActions );

	registerChangeListeners(
		store, boundActions, userSettings, settingsDialog,
		previewBehavior, statsvTracker, pageviewTracker
	);

	boundActions.boot(
		initiallyEnabled,
		mw.user,
		userSettings,
		mw.config,
		window.location.href
	);

	/*
	 * Register external interface exposing popups internals so that other
	 * extensions can query it (T171287)
	 */
	mw.popups = createMediaWikiPopupsObject( store );

	const selectors = [];
	if ( initiallyEnabled[ previewTypes.TYPE_PAGE ] !== null ) {
		const excludedLinksSelector = EXCLUDED_LINK_SELECTORS.join( ', ' );
		selectors.push( `#mw-content-text a[href][title]:not(${excludedLinksSelector})` );
	}
	if ( initiallyEnabled[ previewTypes.TYPE_REFERENCE ] !== null ) {
		selectors.push( '#mw-content-text .reference a[ href*="#" ]' );
	}
	if ( !selectors.length ) {
		mw.log.warn( 'ext.popups was loaded but everything is disabled' );
		return;
	}
	const validLinkSelector = selectors.join( ', ' );

	rendererInit();

	/*
	 * Binding hover and click events to the eligible links to trigger actions
	 */
	$( document )
		.on( 'mouseover keyup', validLinkSelector, function ( event ) {
			const mwTitle = titleFromElement( this, mw.config );
			if ( !mwTitle ) {
				return;
			}
			const type = getPreviewType( this, mw.config, mwTitle );
			let gateway;

			switch ( type ) {
				case previewTypes.TYPE_PAGE:
					gateway = pagePreviewGateway;
					break;
				case previewTypes.TYPE_REFERENCE:
					gateway = referenceGateway;
					break;
				default:
					return;
			}

			const $target = $( this );
			const $window = $( window );

			const measures = {
				pageX: event.pageX,
				pageY: event.pageY,
				clientY: event.clientY,
				width: $target.width(),
				height: $target.height(),
				offset: $target.offset(),
				clientRects: this.getClientRects(),
				windowWidth: $window.width(),
				windowHeight: $window.height(),
				scrollTop: $window.scrollTop()
			};

			boundActions.linkDwell( mwTitle, this, measures, gateway, generateToken, type );
		} )
		.on( 'mouseout blur', validLinkSelector, function () {
			const mwTitle = titleFromElement( this, mw.config );

			if ( mwTitle ) {
				boundActions.abandon();
			}
		} )
		.on( 'click', validLinkSelector, function () {
			const mwTitle = titleFromElement( this, mw.config );
			if ( mwTitle ) {
				if ( previewTypes.TYPE_PAGE === getPreviewType( this, mw.config, mwTitle ) ) {
					boundActions.linkClick( this );
				}
			}
		} );
}() );

window.Redux = Redux;
window.ReduxThunk = ReduxThunk;
