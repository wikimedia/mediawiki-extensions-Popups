/**
 * @module settingsDialog
 */

import { renderSettingsDialog } from './templates/settingsDialog';

let mw = window.mediaWiki;

/**
 * Create the settings dialog shown to anonymous users.
 *
 * @param {boolean} navPopupsEnabled
 * @return {jQuery} settings dialog
 */
export function createSettingsDialog( navPopupsEnabled ) {
	let $el,
		path = mw.config.get( 'wgExtensionAssetsPath' ) +
			'/Popups/resources/ext.popups.main/images/',
		choices = [
			{
				id: 'simple',
				name: mw.msg( 'popups-settings-option-simple' ),
				description: mw.msg( 'popups-settings-option-simple-description' ),
				image: path + 'hovercard.svg',
				isChecked: true
			},
			{
				id: 'advanced',
				name: mw.msg( 'popups-settings-option-advanced' ),
				description: mw.msg( 'popups-settings-option-advanced-description' ),
				image: path + 'navpop.svg'
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
	$el = $( $.parseHTML( renderSettingsDialog( {
		heading: mw.msg( 'popups-settings-title' ),
		closeLabel: mw.msg( 'popups-settings-cancel' ),
		saveLabel: mw.msg( 'popups-settings-save' ),
		helpText: mw.msg( 'popups-settings-help' ),
		okLabel: mw.msg( 'popups-settings-help-ok' ),
		descriptionText: mw.msg( 'popups-settings-description' ),
		choices
	} ) ) );

	return $el;
}
