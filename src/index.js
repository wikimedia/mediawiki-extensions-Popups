/**
 * @module popups
 */

var mw = mediaWiki,
	$ = jQuery,
	Redux = require( 'redux' ),
	ReduxThunk = require( 'redux-thunk' ),

	createGateway = require( './gateway' ),
	createUserSettings = require( './userSettings' ),
	createPreviewBehavior = require( './previewBehavior' ),
	createSchema = require( './schema' ),
	createSettingsDialogRenderer = require( './settingsDialog' ),
	registerChangeListener = require( './changeListener' ),
	createIsEnabled = require( './isEnabled' ),
	title = require( './title' ),
	renderer = require( './renderer' ),
	createExperiments = require( './experiments' ),
	statsvInstrumentation = require( './statsvInstrumentation' ),

	changeListeners = require( './changeListeners' ),
	actions = require( './actions' ),
	reducers = require( './reducers' ),

	BLACKLISTED_LINKS = [
		'.extiw',
		'.image',
		'.new',
		'.internal',
		'.external',
		'.oo-ui-buttonedElement-button',
		'.cancelLink a'
	];

/**
 * @typedef {Function} ext.popups.EventTracker
 *
 * An analytics event tracker like `mw.track`.
 */

/**
 * Gets the appropriate analytics event tracker for logging metrics to StatsD
 * via the [the "StatsD timers and counters" analytics event protocol][0].
 *
 * If logging metrics to StatsD is enabled for the user, then the appriopriate
 * function is `mw.track`; otherwise it's `$.noop`.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/master/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} user
 * @param {Object} config
 * @param {Object} experiments
 * @return {ext.popups.EventTracker}
 */
function getStatsvTracker( user, config, experiments ) {
	return statsvInstrumentation.isEnabled( user, config, experiments ) ? mw.track : $.noop;
}

/**
 * Subscribes the registered change listeners to the
 * [store](http://redux.js.org/docs/api/Store.html#store).
 *
 * @param {Redux.Store} store
 * @param {Object} actions
 * @param {ext.popups.UserSettings} userSettings
 * @param {Function} settingsDialog
 * @param {ext.popups.PreviewBehavior} previewBehavior
 * @param {ext.popups.EventTracker} statsvTracker
 */
function registerChangeListeners( store, actions, userSettings, settingsDialog, previewBehavior, statsvTracker ) {
	registerChangeListener( store, changeListeners.footerLink( actions ) );
	registerChangeListener( store, changeListeners.linkTitle() );
	registerChangeListener( store, changeListeners.render( previewBehavior ) );
	registerChangeListener( store, changeListeners.statsv( actions, statsvTracker ) );
	registerChangeListener( store, changeListeners.syncUserSettings( userSettings ) );
	registerChangeListener( store, changeListeners.settings( actions, settingsDialog ) );
}

/*
 * Initialize the application by:
 * 1. Creating the state store
 * 2. Binding the actions to such store
 * 3. Trigger the boot action to bootstrap the system
 * 4. When the page content is ready:
 *   - Process the eligible links for page previews
 *   - Initialize the renderer
 *   - Bind hover and click events to the eligible links to trigger actions
 */
mw.requestIdleCallback( function () {
	var compose = Redux.compose,
		store,
		boundActions,

		// So-called "services".
		generateToken = mw.user.generateRandomSessionId,
		gateway = createGateway( mw.config ),
		userSettings,
		settingsDialog,
		experiments,
		statsvTracker,
		isEnabled,
		schema,
		previewBehavior;

	userSettings = createUserSettings( mw.storage );
	settingsDialog = createSettingsDialogRenderer();
	experiments = createExperiments( mw.experiments );
	statsvTracker = getStatsvTracker( mw.user, mw.config, experiments );

	isEnabled = createIsEnabled( mw.user, userSettings, mw.config, mw.experiments );

	// If debug mode is enabled, then enable Redux DevTools.
	if ( mw.config.get( 'debug' ) === true ) {
		// eslint-disable-next-line no-underscore-dangle
		compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	}

	store = Redux.createStore(
		Redux.combineReducers( reducers ),
		compose( Redux.applyMiddleware(
			ReduxThunk.default
		) )
	);
	boundActions = Redux.bindActionCreators( actions, store.dispatch );

	previewBehavior = createPreviewBehavior( mw.config, mw.user, boundActions );

	registerChangeListeners(
		store, boundActions, userSettings, settingsDialog,
		previewBehavior, statsvTracker
	);

	// Load EventLogging schema if possible...
	mw.loader.using( 'ext.eventLogging.Schema' ).done( function () {
		schema = createSchema( mw.config, window );
		registerChangeListener( store, changeListeners.eventLogging( boundActions, schema, statsvTracker ) );
	} );

	boundActions.boot(
		isEnabled,
		mw.user,
		userSettings,
		generateToken,
		mw.config
	);

	mw.hook( 'wikipage.content' ).add( function ( $container ) {
		var invalidLinksSelector = BLACKLISTED_LINKS.join( ', ' ),
			validLinkSelector = 'a[href][title]:not(' + invalidLinksSelector + ')';

		renderer.init();

		$container
			.on( 'mouseover keyup', validLinkSelector, function ( event ) {
				var mwTitle = title.fromElement( this, mw.config );

				if ( mwTitle ) {
					boundActions.linkDwell( mwTitle, this, event, gateway, generateToken );
				}
			} )
			.on( 'mouseout blur', validLinkSelector, function () {
				var mwTitle = title.fromElement( this, mw.config );

				if ( mwTitle ) {
					boundActions.abandon( this );
				}
			} )
			.on( 'click', validLinkSelector, function () {
				var mwTitle = title.fromElement( this, mw.config );

				if ( mwTitle ) {
					boundActions.linkClick( this );
				}
			} );

	} );
} );

window.Redux = Redux;
window.ReduxThunk = ReduxThunk;
