/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';

const mw = window.mediaWiki;

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} navPopupsEnabled
 * @return {jQuery} settings dialog
 */
export function createSettingsDialog( navPopupsEnabled ) {
	const choices = [
		{
			id: 'simple',
			name: mw.msg( 'popups-settings-option-simple' ),
			description: mw.msg( 'popups-settings-option-simple-description' ),
			isChecked: true
		},
		{
			id: 'advanced',
			name: mw.msg( 'popups-settings-option-advanced' ),
			description: mw.msg( 'popups-settings-option-advanced-description' )
		},
		{
			id: 'off',
			name: mw.msg( 'popups-settings-option-off' )
		}
	];

	if ( !navPopupsEnabled ) {
		// remove the advanced option
		choices.splice( 1, 1 );
	}

	// render the template
	const $el = $( $.parseHTML( renderSettingsDialog( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		choices
	} ) ) );

	return $el;
}
