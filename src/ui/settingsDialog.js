/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog/settingsDialog';
import { previewTypes } from '../preview/model';

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} referencePreviewsAvaliable
 * @return {HTMLElement} settings dialog
 */
export function createSettingsDialog( referencePreviewsAvaliable ) {
	const choices = [
		{
			id: previewTypes.TYPE_PAGE,
			name: mw.msg( 'popups-settings-option-page' ),
			description: mw.msg( 'popups-settings-option-page-description' )
		},
		{
			id: previewTypes.TYPE_REFERENCE,
			name: mw.msg( 'popups-settings-option-reference' ),
			description: mw.msg( 'popups-settings-option-reference-description' )
		}
	];

	// TODO: Remove when not in Beta any more
	if ( !referencePreviewsAvaliable ) {
		// Anonymous users can't access reference previews as long as they are in beta
		choices.splice( 1, 1 );
	}

	return renderSettingsDialog( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		choices
	} );
}
