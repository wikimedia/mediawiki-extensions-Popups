( function ( mw, rx ) {

	/**
	 * Example reducer
	 *
	 * @param {Object} state global state before action
	 * @param {Object} action action that was performed
	 * @return {Object} global state after action
	 */
	function rootReducer( state, action ) {
		/* jshint unused: false */
		return state;
	}

	mw.requestIdleCallback( function () {
		rx.createStore(
			rootReducer,
			rx.applyMiddleware( rx.thunk )
		);
	} );

}( mediaWiki, Redux ) );
