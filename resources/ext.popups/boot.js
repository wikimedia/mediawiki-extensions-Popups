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
	 * Return whether the user is in the experiment group
	 *
	 * @return {Boolean}
	 */
	function isUserInCondition() {
		var userSettings = mw.popups.createUserSettings( mw.storage, mw.user );

		return mw.popups.createExperiment(
			mw.config,
			mw.user,
			userSettings
		);
	}

	/**
	 * Subscribes the registered change listeners to the
	 * [store](http://redux.js.org/docs/api/Store.html#store).
	 *
	 * Change listeners are registered by setting a property on
	 * `mw.popups.changeListeners`.
	 *
	 * @param {Store} store
	 */
	function registerChangeListeners( store, actions ) {
		$.each( mw.popups.changeListeners, function ( _, changeListenerFactory ) {
			var changeListener = changeListenerFactory( actions );

			mw.popups.registerChangeListener( store, changeListener );
		} );
	}

	/**
	 * Binds the actions (or "action creators") to the
	 * [store](http://redux.js.org/docs/api/Store.html#store).
	 *
	 * @param {Store} store
	 * @return {Object}
	 */
	function createBoundActions( store ) {
		return Redux.bindActionCreators( mw.popups.actions, store.dispatch );
	}

	mw.requestIdleCallback( function () {
		var compose = Redux.compose,
			store,
			actions,
			generateToken = mw.user.generateRandomSessionId;

		// If debug mode is enabled, then enable Redux DevTools.
		if ( mw.config.get( 'debug' ) === true ) {
			compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		}

		store = Redux.createStore(
			mw.popups.reducers.rootReducer,
			compose( Redux.applyMiddleware(
				ReduxThunk.default
			) )
		);
		actions = createBoundActions( store );
		registerChangeListeners( store, actions );

		actions.boot(
			isUserInCondition(),
			mw.user.sessionId(),
			generateToken
		);

		mw.hook( 'wikipage.content' ).add( function ( $container ) {
			var previewLinks =
				mw.popups.processLinks(
					$container,
					BLACKLISTED_LINKS
				);

			previewLinks
				.on( 'mouseover focus', function () {
					actions.linkDwell( this );
				} )
				.on( 'mouseout blur', function () {
					actions.linkAbandon( this );
				} )
				.on( 'click', function () {
					actions.linkClick( this );
				} );

		} );
	} );

}( mediaWiki, Redux, ReduxThunk, jQuery ) );
