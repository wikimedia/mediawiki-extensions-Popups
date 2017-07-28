import actionTypes from '../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that modify the state of the settings
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */
export default function settings( state, action ) {
	if ( state === undefined ) {
		state = {
			shouldShow: false,
			showHelp: false,
			shouldShowFooterLink: false
		};
	}

	switch ( action.type ) {
		case actionTypes.SETTINGS_SHOW:
			return nextState( state, {
				shouldShow: true,
				showHelp: false
			} );
		case actionTypes.SETTINGS_HIDE:
			return nextState( state, {
				shouldShow: false,
				showHelp: false
			} );
		case actionTypes.SETTINGS_CHANGE:
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
					showHelp: !action.enabled,

					// Since the footer link is only ever shown to anonymous users (see
					// the BOOT case below), state.userIsAnon is always truthy here.
					shouldShowFooterLink: !action.enabled
				} );

		case actionTypes.BOOT:
			return nextState( state, {
				shouldShowFooterLink: action.user.isAnon && !action.isEnabled
			} );
		default:
			return state;
	}
}
