( function ( mw, Redux, ReduxThunk ) {
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
	 * A [null](https://en.wikipedia.org/wiki/Null_Object_pattern) reducer.
	 *
	 * @param {Object} state The current state
	 * @param {Object} action The action that was dispatched against the store
	 * @return {Object} The new state
	 */
	function rootReducer( state, action ) {
		/* jshint unused: false */
		return state;
	}

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

	mw.requestIdleCallback( function () {
		var compose = Redux.compose,
			store,
			actions;

		// If debug mode is enabled, then enable Redux DevTools.
		if ( mw.config.get( 'debug' ) === true ) {
			compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		}

		store = Redux.createStore(
			rootReducer,
			compose( Redux.applyMiddleware(
				ReduxThunk.default
			) )
		);
		actions = mw.popups.createActions( store );

		actions.boot( isUserInCondition() );

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

}( mediaWiki, Redux, ReduxThunk ) );
