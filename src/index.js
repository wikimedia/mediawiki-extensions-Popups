var mw = mediaWiki,
	$ = jQuery,
	Redux = require( 'redux' ),
	ReduxThunk = require( 'redux-thunk' ),
	constants = require( './constants' ),

	createRESTBaseGateway = require( './gateway/rest' ),
	createMediaWikiApiGateway = require( './gateway/mediawiki' ),
	createUserSettings = require( './userSettings' ),
	createPreviewBehavior = require( './previewBehavior' ),
	createSchema = require( './schema' ),
	createSettingsDialogRenderer = require( './settingsDialog' ),
	registerChangeListener = require( './changeListener' ),
	createIsEnabled = require( './isEnabled' ),
	processLinks = require( './processLinks' ),
	renderer = require( './renderer' ),
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
 * Creates a gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {ext.popups.Gateway}
 */
function createGateway( config ) {
	if ( config.get( 'wgPopupsAPIUseRESTBase' ) ) {
		return createRESTBaseGateway( $.ajax, constants );
	}
	return createMediaWikiApiGateway( new mw.Api(), constants );
}

/**
 * Subscribes the registered change listeners to the
 * [store](http://redux.js.org/docs/api/Store.html#store).
 *
 * @param {Redux.Store} store
 * @param {Object} actions
 * @param {mw.eventLog.Schema} schema
 * @param {ext.popups.UserSettings} userSettings
 * @param {Function} settingsDialog
 * @param {ext.popups.PreviewBehavior} previewBehavior
 * @param {bool} isStatsvLoggingEnabled
 * @param {Function} track mw.track
 */
function registerChangeListeners( store, actions, schema, userSettings, settingsDialog, previewBehavior, isStatsvLoggingEnabled, track ) {
	registerChangeListener( store, changeListeners.footerLink( actions ) );
	registerChangeListener( store, changeListeners.linkTitle() );
	registerChangeListener( store, changeListeners.render( previewBehavior ) );
	registerChangeListener( store, changeListeners.eventLogging( actions, schema ) );
	registerChangeListener( store, changeListeners.statsv( actions, isStatsvLoggingEnabled, track ) );
	registerChangeListener( store, changeListeners.syncUserSettings( userSettings ) );
	registerChangeListener( store, changeListeners.settings( actions, settingsDialog ) );
}

/**
 * Creates the reducer for all actions.
 *
 * @return {Redux.Reducer}
 */
function createRootReducer() {
	return Redux.combineReducers( reducers );
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
		isEnabled,
		schema,
		previewBehavior,
		isStatsvLoggingEnabled;

	userSettings = createUserSettings( mw.storage );
	settingsDialog = createSettingsDialogRenderer();
	schema = createSchema( mw.config, window );
	isStatsvLoggingEnabled = statsvInstrumentation.isEnabled( mw.user, mw.config, mw.experiments );

	isEnabled = createIsEnabled( mw.user, userSettings, mw.config, mw.experiments );

	// If debug mode is enabled, then enable Redux DevTools.
	if ( mw.config.get( 'debug' ) === true ) {
		// eslint-disable-next-line no-underscore-dangle
		compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	}

	store = Redux.createStore(
		createRootReducer(),
		compose( Redux.applyMiddleware(
			ReduxThunk.default
		) )
	);
	boundActions = Redux.bindActionCreators( actions, store.dispatch );

	previewBehavior = createPreviewBehavior( mw.config, mw.user, boundActions );

	registerChangeListeners(
		store, boundActions, schema, userSettings, settingsDialog,
		previewBehavior, isStatsvLoggingEnabled, mw.track
	);

	boundActions.boot(
		isEnabled,
		mw.user,
		userSettings,
		generateToken,
		mw.config
	);

	mw.hook( 'wikipage.content' ).add( function ( $container ) {
		var previewLinks =
			processLinks(
				$container,
				BLACKLISTED_LINKS,
				mw.config
			);

		renderer.init();

		previewLinks
			.on( 'mouseover focus', function ( event ) {
				boundActions.linkDwell( this, event, gateway, generateToken );
			} )
			.on( 'mouseout blur', function () {
				boundActions.abandon( this );
			} )
			.on( 'click', function () {
				boundActions.linkClick( this );
			} );

	} );
} );

window.Redux = Redux;
window.ReduxThunk = ReduxThunk;
