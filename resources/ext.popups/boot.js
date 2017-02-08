( function ( mw, Redux, ReduxThunk, $ ) {
	var BLACKLISTED_LINKS = [
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
			return mw.popups.createRESTBaseGateway( $.ajax );
		}
		return mw.popups.createMediaWikiApiGateway( new mw.Api() );
	}

	/**
	 * Subscribes the registered change listeners to the
	 * [store](http://redux.js.org/docs/api/Store.html#store).
	 *
	 * Change listeners are registered by setting a property on
	 * `mw.popups.changeListeners`.
	 *
	 * @param {Redux.Store} store
	 * @param {Object} actions
	 * @param {mw.eventLog.Schema} schema
	 * @param {ext.popups.UserSettings} userSettings
	 * @param {Function} settingsDialog
	 * @param {ext.popups.PreviewBehavior} previewBehavior
	 */
	function registerChangeListeners( store, actions, schema, userSettings, settingsDialog, previewBehavior ) {

		// Sugar.
		var changeListeners = mw.popups.changeListeners,
			registerChangeListener = mw.popups.registerChangeListener;

		registerChangeListener( store, changeListeners.footerLink( actions ) );
		registerChangeListener( store, changeListeners.linkTitle() );
		registerChangeListener( store, changeListeners.render( previewBehavior ) );
		registerChangeListener( store, changeListeners.eventLogging( actions, schema ) );
		registerChangeListener( store, changeListeners.syncUserSettings( userSettings ) );
		registerChangeListener( store, changeListeners.settings( actions, settingsDialog ) );
	}

	/**
	 * Binds the actions (or "action creators") to the
	 * [store](http://redux.js.org/docs/api/Store.html#store).
	 *
	 * @param {Redux.Store} store
	 * @return {Object}
	 */
	function createBoundActions( store ) {
		return Redux.bindActionCreators( mw.popups.actions, store.dispatch );
	}

	/**
	 * Creates the reducer for all actions.
	 *
	 * @return {Redux.Reducer}
	 */
	function createRootReducer() {
		return Redux.combineReducers( mw.popups.reducers );
	}

	/*
	 * Initialize the application by:
	 * 1. Creating the state store
	 * 2. Binding the actions to such store
	 * 3. Trigger the boot action to bootstrap the system
	 * 4. When the page content is ready:
	 *   - Setup `checkin` actions
	 *   - Process the eligible links for page previews
	 *   - Initialize the renderer
	 *   - Bind hover and click events to the eligible links to trigger actions
	 */
	mw.requestIdleCallback( function () {
		var compose = Redux.compose,
			store,
			actions,

			// So-called "services".
			generateToken = mw.user.generateRandomSessionId,
			gateway = createGateway( mw.config ),
			userSettings,
			settingsDialog,
			isEnabled,
			schema,
			previewBehavior;

		userSettings = mw.popups.createUserSettings( mw.storage );
		settingsDialog = mw.popups.createSettingsDialogRenderer();
		schema = mw.popups.createSchema( mw.config, window );

		isEnabled = mw.popups.isEnabled( mw.user, userSettings, mw.config );

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
		actions = createBoundActions( store );

		previewBehavior = mw.popups.createPreviewBehavior( mw.config, mw.user, actions );

		registerChangeListeners( store, actions, schema, userSettings, settingsDialog, previewBehavior );

		actions.boot(
			isEnabled,
			mw.user,
			userSettings,
			generateToken,
			mw.config
		);

		mw.hook( 'wikipage.content' ).add( function ( $container ) {
			var previewLinks =
				mw.popups.processLinks(
					$container,
					BLACKLISTED_LINKS,
					mw.config
				);

			mw.popups.checkin.setupActions( actions.checkin );

			mw.popups.renderer.init();

			previewLinks
				.on( 'mouseover focus', function ( event ) {
					actions.linkDwell( this, event, gateway, generateToken );
				} )
				.on( 'mouseout blur', function () {
					actions.abandon( this );
				} )
				.on( 'click', function () {
					actions.linkClick( this );
				} );

		} );
	} );

}( mediaWiki, Redux, ReduxThunk, jQuery ) );
