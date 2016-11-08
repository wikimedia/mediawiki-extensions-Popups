( function ( mw, Redux, ReduxThunk ) {

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

	mw.requestIdleCallback( function () {
		var compose = Redux.compose;

		// If debug mode is enabled, then enable Redux DevTools.
		if ( mw.config.get( 'debug' ) === true ) {
			compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		}

		Redux.createStore(
			rootReducer,
			compose( Redux.applyMiddleware(
				ReduxThunk.default
			) )
		);
	} );

}( mediaWiki, Redux, ReduxThunk ) );
