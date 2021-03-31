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
import { isEnabled as isEventLoggingEnabled } from './instrumentation/eventLogging';
import changeListeners from './changeListeners';
import * as actions from './actions';
import reducers from './reducers';
import createMediaWikiPopupsObject from './integrations/mwpopups';
import getPageviewTracker, { getSendBeacon } from './getPageviewTracker';
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
 * Gets the appropriate analytics event tracker for logging EventLogging events
 * via [the "EventLogging subscriber" analytics event protocol][0].
 *
 * If logging EventLogging events is enabled for the duration of the user's
 * session, then the appriopriate function is `mw.track`; otherwise it's
 * `() => {}`.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-EventLogging/blob/d1409759/modules/ext.eventLogging.subscriber.js
 *
 * @param {Object} user
 * @param {Object} config
 * @param {Window} window
 * @return {EventTracker}
 */
function getEventLoggingTracker( user, config, window ) {
	return isEventLoggingEnabled(
		user,
		config,
		window
	) ? mw.track : () => {};
}

/**
 * Returns timestamp since the beginning of the current document's origin
 * as reported by `window.performance.now()`. See
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin
 * for a detailed explanation of the time origin.
 *
 * The value returned by this function is used for [the `timestamp` property
 * of the Schema:Popups events sent by the EventLogging
 * instrumentation](./src/changeListeners/eventLogging.js).
 *
 * @return {number|null}
 */
function getCurrentTimestamp() {
	if ( window.performance && window.performance.now ) {
		// return an integer; see T182000
		return Math.round( window.performance.now() );
	}
	return null;
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
 * @param {EventTracker} eventLoggingTracker
 * @param {EventTracker} pageviewTracker
 * @param {Function} callbackCurrentTimestamp
 * @return {void}
 */
function registerChangeListeners(
	store, registerActions, userSettings, settingsDialog, previewBehavior,
	statsvTracker, eventLoggingTracker, pageviewTracker, callbackCurrentTimestamp
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
	registerChangeListener(
		store,
		changeListeners.eventLogging(
			registerActions, eventLoggingTracker, callbackCurrentTimestamp
		) );
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
		settingsDialog = createSettingsDialogRenderer( mw.config ),
		experiments = createExperiments( mw.experiments ),
		statsvTracker = getStatsvTracker( mw.user, mw.config, experiments ),
		// Virtual pageviews are always tracked.
		pageviewTracker = getPageviewTracker( mw.config,
			mw.loader.using,
			() => mw.eventLog,
			getSendBeacon( window.navigator )
		),
		eventLoggingTracker = getEventLoggingTracker(
			mw.user,
			mw.config,
			window
		),
		isPagePreviewsEnabled = createIsPagePreviewsEnabled( mw.user, userSettings, mw.config );

	// If debug mode is enabled, then enable Redux DevTools.
	if ( mw.config.get( 'debug' ) === true ||
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
		previewBehavior, statsvTracker, eventLoggingTracker,
		pageviewTracker,
		getCurrentTimestamp
	);

	boundActions.boot(
		// FIXME: Currently this disables all popup types (for anonymous users).
		isPagePreviewsEnabled,
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
	if ( mw.user.isAnon() || mw.user.options.get( 'popups' ) === '1' ) {
		const excludedLinksSelector = EXCLUDED_LINK_SELECTORS.join( ', ' );
		selectors.push( `#mw-content-text a[href][title]:not(${excludedLinksSelector})` );
	}
	if ( isReferencePreviewsEnabled( mw.config ) ) {
		selectors.push( '#mw-content-text .reference a[ href*="#" ]' );
	}
	if ( !selectors.length ) {
		mw.log.error( 'ext.popups should not even be loaded!' );
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
