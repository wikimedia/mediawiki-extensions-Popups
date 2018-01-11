import actionTypes from '../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that modify the state of the preview model
 *
 * @param {?Object} state before action
 * @param {!Object} action Redux action that modified state.
 *  Must have `type` property.
 * @return {!Object} state after action
 */
export default function preview( state, action ) {
	if ( state === undefined ) {
		state = {
			enabled: undefined,
			activeLink: undefined,
			activeEvent: undefined,
			activeToken: '',
			shouldShow: false,
			isUserDwelling: false
		};
	}

	switch ( action.type ) {
		case actionTypes.BOOT:
			return nextState( state, {
				enabled: action.isEnabled
			} );

		case actionTypes.SETTINGS_CHANGE:
			return nextState( state, {
				enabled: action.enabled
			} );

		case actionTypes.LINK_DWELL:
			// New interaction
			if ( action.el !== state.activeLink ) {
				return nextState( state, {
					activeLink: action.el,
					activeEvent: action.event,
					activeToken: action.token,

					// When the user dwells on a link with their keyboard, a preview is
					// renderered, and then dwells on another link, the ABANDON_END
					// action will be ignored.
					//
					// Ensure that all the preview is hidden.
					shouldShow: false,

					isUserDwelling: true
				} );
			}
			// Dwelling back into the same link
			return nextState( state, {
				isUserDwelling: true
			} );

		case actionTypes.ABANDON_END:
			if ( action.token === state.activeToken && !state.isUserDwelling ) {
				return nextState( state, {
					activeLink: undefined,
					activeToken: undefined,
					activeEvent: undefined,
					fetchResponse: undefined,
					shouldShow: false
				} );
			}
			return state;

		case actionTypes.PREVIEW_DWELL:
			return nextState( state, {
				isUserDwelling: true
			} );

		case actionTypes.ABANDON_START:
			return nextState( state, {
				isUserDwelling: false
			} );

		case actionTypes.FETCH_START:
			return nextState( state, {
				fetchResponse: undefined
			} );

		case actionTypes.FETCH_COMPLETE:
			if ( action.token === state.activeToken ) {
				return nextState( state, {
					fetchResponse: action.result,
					shouldShow: state.isUserDwelling
				} );
			} // else fall through
		default:
			return state;
	}
}
