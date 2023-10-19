import actionTypes from '../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that modify the state of the settings
 *
 * @param {Object|undefined} state
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
		case actionTypes.SETTINGS_CHANGE: {
			const types = Object.keys( action.newValue ),
				nothingChanged = types
					.every( ( type ) => action.oldValue[ type ] === action.newValue[ type ] ),
				// Check if at least one setting has been deactivated that was active before
				userOptedOut = types
					.some( ( type ) => action.oldValue[ type ] && !action.newValue[ type ] ),
				// Warning, when the state is null the user can't re-enable this popup type!
				anyDisabled = types
					.some( ( type ) => action.newValue[ type ] === false );

			if ( nothingChanged ) {
				// If the setting is the same, just hide the dialogs
				return nextState( state, {
					shouldShow: false
				} );
			}

			return nextState( state, {
				// If we enabled, we just hide directly, no help
				// If we disabled, keep it showing and let the ui show the help.
				shouldShow: userOptedOut,
				showHelp: userOptedOut,

				// Since the footer link is only ever shown to anonymous users (see
				// the BOOT case below), state.userIsAnon is always truthy here.
				shouldShowFooterLink: anyDisabled
			} );
		}
		case actionTypes.BOOT: {
			// Warning, when the state is null the user can't re-enable this popup type!
			const anyDisabled = Object.keys( action.initiallyEnabled )
				.some( ( type ) => action.initiallyEnabled[ type ] === false );

			return nextState( state, {
				shouldShowFooterLink: action.user.isAnon && anyDisabled
			} );
		}
		default:
			return state;
	}
}
