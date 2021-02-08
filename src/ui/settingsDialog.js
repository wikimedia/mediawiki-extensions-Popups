/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} isReferencePreviewsInBeta
 * @return {JQuery} settings dialog
 */
export function createSettingsDialog( isReferencePreviewsInBeta ) {
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
			id: 'off',
			name: mw.msg( 'popups-settings-option-off' )
		}
	];

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
