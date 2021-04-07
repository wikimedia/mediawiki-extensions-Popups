import { previewTypes } from '../preview/model';

/**
 * Creates an instance of the settings change listener.
 *
 * @param {Object} boundActions
 * @param {Object} render function that renders a jQuery el with the settings
 * @return {ext.popups.ChangeListener}
 */
export default function settings( boundActions, render ) {
	let settingsObj;

	return ( oldState, newState ) => {
		if ( !oldState ) {
			// Nothing to do on initialization
			return;
		}

		// Update global modal visibility
		if (
			oldState.settings.shouldShow === false &&
			newState.settings.shouldShow === true
		) {
			// Lazily instantiate the settings UI
			if ( !settingsObj ) {
				settingsObj = render( boundActions );
				settingsObj.appendTo( document.body );
			}

			// Update the UI settings with the current settings
			// TODO: Support other popup types
			settingsObj.setEnabled( newState.preview.enabled[ previewTypes.TYPE_PAGE ] );

			settingsObj.show();
		} else if (
			oldState.settings.shouldShow === true &&
			newState.settings.shouldShow === false
		) {
			settingsObj.hide();
		}

		// Update help visibility
		if ( oldState.settings.showHelp !== newState.settings.showHelp ) {
			settingsObj.toggleHelp( newState.settings.showHelp );
		}
	};
}
