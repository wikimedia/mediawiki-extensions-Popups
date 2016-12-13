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
				shouldShow: false,
				showHelp: false
			};
		}

		switch ( action.type ) {
			case popups.actionTypes.SETTINGS_SHOW:
				return nextState( state, {
					shouldShow: true,
					showHelp: false
				} );
			case popups.actionTypes.SETTINGS_HIDE:
				return nextState( state, {
					shouldShow: false,
					showHelp: false
				} );
			case popups.actionTypes.SETTINGS_CHANGE:
				return action.wasEnabled === action.enabled ?
					// If the setting is the same, just hide the dialogs
					nextState( state, {
						shouldShow: false
					} ) :
					// If the settings have changed...
					nextState( state, {
						// If we enabled, we just hide directly, no help
						// If we disabled, keep it showing and let the ui show the help.
						shouldShow: !action.enabled,
						showHelp: !action.enabled
					} );
			default:
				return state;
		}
	};

}( mediaWiki.popups, mediaWiki.popups.nextState ) );
