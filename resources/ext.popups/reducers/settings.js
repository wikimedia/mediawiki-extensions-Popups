( function ( popups, nextState ) {

	/**
	 * Reducer for actions that modify the state of the settings
	 *
	 * @param {Object} state
	 * @param {Object} action
	 * @return {Object} state after action
	 */
	popups.reducers.settings = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				shouldShow: false
			};
		}

		switch ( action.type ) {
			case popups.actionTypes.SETTINGS_SHOW:
				return nextState( state, {
					shouldShow: true
				} );
			case popups.actionTypes.SETTINGS_HIDE:
				return nextState( state, {
					shouldShow: false
				} );
			default:
				return state;
		}
	};

}( mediaWiki.popups, mediaWiki.popups.nextState ) );
