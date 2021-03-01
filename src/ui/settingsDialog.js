/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} navPopupsEnabled
 * @param {boolean} isReferencePreviewsInBeta
 * @return {JQuery} settings dialog
 */
export function createSettingsDialog( navPopupsEnabled, isReferencePreviewsInBeta ) {
	const choices = [
		{
			id: 'simple',
			name: mw.msg( 'popups-settings-option-simple' ),
			description: mw.msg(
				// TODO: Remove when not in Beta any more
				isReferencePreviewsInBeta ?
					'popups-settings-option-simple-description' :
					'popups-settings-option-unified-description'
			),
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

	return renderSettingsDialog( {
		heading: mw.msg(
			// TODO: Remove when not in Beta any more
			isReferencePreviewsInBeta ?
				'popups-settings-title' :
				'popups-settings-unified-title'
		),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		choices
	} );
}
