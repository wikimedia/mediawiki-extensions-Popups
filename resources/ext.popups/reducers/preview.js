( function ( popups, nextState ) {

	/**
	 * Reducer for actions that modify the state of the preview model
	 *
	 * @param {Object} state before action
	 * @param {Object} action Redux action that modified state.
	 *  Must have `type` property.
	 * @return {Object} state after action
	 */
	popups.reducers.preview = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				enabled: undefined,
				activeLink: undefined,
				activeEvent: undefined,
				shouldShow: false,
				isUserDwelling: false
			};
		}

		switch ( action.type ) {
			case popups.actionTypes.BOOT:
				return nextState( state, {
					enabled: action.user.isInCondition
				} );
			case popups.actionTypes.SETTINGS_CHANGE:
				return nextState( state, {
					enabled: action.enabled
				} );
			case popups.actionTypes.LINK_DWELL:
				return nextState( state, {
					activeLink: action.el,
					activeEvent: action.event,

					// When the user dwells on a link with their keyboard, a preview is
					// renderered, and then dwells on another link, the LINK_ABANDON_END
					// action will be ignored.
					//
					// Ensure that all the preview is hidden.
					shouldShow: false
				} );
			case popups.actionTypes.LINK_ABANDON_END:
				if ( action.el !== state.activeLink ) {
					return state;
				}

				/* falls through */
			case popups.actionTypes.PREVIEW_ABANDON_END:
				if ( !state.isUserDwelling ) {
					return nextState( state, {
						activeLink: undefined,
						activeEvent: undefined,
						fetchResponse: undefined,
						shouldShow: false
					} );
				}

				return state;

			case popups.actionTypes.PREVIEW_DWELL:
				return nextState( state, {
					isUserDwelling: true
				} );
			case popups.actionTypes.PREVIEW_ABANDON_START:
				return nextState( state, {
					isUserDwelling: false
				} );
			case popups.actionTypes.FETCH_START:
				return nextState( state, {
					fetchResponse: undefined
				} );
			case popups.actionTypes.FETCH_END:
				if ( action.el === state.activeLink ) {
					return nextState( state, {
						fetchResponse: action.result,
						shouldShow: true
					} );
				}

				/* falls through */
			default:
				return state;
		}
	};

}( mediaWiki.popups, mediaWiki.popups.nextState ) );
