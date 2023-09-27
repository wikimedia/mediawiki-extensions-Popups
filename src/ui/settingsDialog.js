/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {Object} keyValues
 * @return {HTMLElement} settings dialog
 */
export function createSettingsDialog( keyValues ) {
	const choices = Object.keys( keyValues ).map( ( id ) => (
		{
			id,
			// This can produce:
			// * popups-settings-option-preview
			// * popups-settings-option-reference
			name: mw.msg( `popups-settings-option-${id}` ),
			// This can produce:
			// * popups-settings-option-preview-description
			// * popups-settings-option-reference-description
			description: mw.msg( `popups-settings-option-${id}-description` ),
			isChecked: keyValues[ id ]
		}
	) );

	return renderSettingsDialog( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		choices
	} );
}
