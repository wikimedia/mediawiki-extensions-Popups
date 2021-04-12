/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @return {JQuery} settings dialog
 */
export function createSettingsDialog() {
	const choices = [
		{
			id: 'simple',
			name: mw.msg( 'popups-settings-option-simple' ),
			description: mw.msg( 'popups-settings-option-simple-description' )
		}
	];

	return renderSettingsDialog( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		choices
	} );
}
