/**
 * @module settingsDialogRenderer
 */

import { createSettingsDialog } from './settingsDialog';

/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 *
 * @return {Function} render function
 */
export default function createSettingsDialogRenderer() {
	/**
	 * Cached settings dialog
	 *
	 * @type {JQuery}
	 */
	let $dialog,
		/**
		 * Cached settings overlay
		 *
		 * @type {JQuery}
		 */
		$overlay;

	/**
	 * Renders the relevant form and labels in the settings dialog
	 *
	 * @param {Object} boundActions
	 * @return {Object} object with methods to affect the rendered UI
	 */
	return ( boundActions ) => {
		if ( !$dialog ) {
			$dialog = createSettingsDialog( isNavPopupsEnabled() );
			$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );

			// Setup event bindings

			$dialog.find( '.save' ).on( 'click', () => {
				// Find the selected value (simple|advanced|off)
				const selected = getSelectedSetting( $dialog ),
					// Only simple means enabled, advanced is disabled in favor of
					// NavPops and off means disabled.
					enabled = selected === 'simple';

				boundActions.saveSettings( enabled );
			} );
			$dialog.find( '.close, .okay' ).on( 'click', boundActions.hideSettings );
		}

		return {
			/**
			 * Append the dialog and overlay to a DOM element
			 *
			 * @param {HTMLElement} el
			 * @return {void}
			 */
			appendTo( el ) {
				$overlay.appendTo( el );
				$dialog.appendTo( $overlay );
			},

			/**
			 * Show the settings element and position it correctly
			 *
			 * @return {void}
			 */
			show() {
				$overlay.show();
			},

			/**
			 * Hide the settings dialog.
			 *
			 * @return {void}
			 */
			hide() {
				$overlay.hide();
			},

			/**
			 * Toggle the help dialog on or off
			 *
			 * @param {boolean} visible if you want to show or hide the help dialog
			 * @return {void}
			 */
			toggleHelp( visible ) {
				toggleHelp( $dialog, visible );
			},

			/**
			 * Update the form depending on the enabled flag
			 *
			 * If false and no navpops, then checks 'off'
			 * If true, then checks 'on'
			 * If false, and there are navpops, then checks 'advanced'
			 *
			 * @param {boolean} enabled if page previews are enabled
			 * @return {void}
			 */
			setEnabled( enabled ) {
				let name = 'off';
				if ( enabled ) {
					name = 'simple';
				} else if ( isNavPopupsEnabled() ) {
					name = 'advanced';
				}

				// Check the appropriate radio button
				$dialog.find( `#mwe-popups-settings-${name}` )
					.prop( 'checked', true );
			}
		};
	};
}

/**
 * Get the selected value on the radio button
 *
 * @param {JQuery.Object} $el the element to extract the setting from
 * @return {string} Which should be (simple|advanced|off)
 */
function getSelectedSetting( $el ) {
	return $el.find(
		'input[name=mwe-popups-setting]:checked, #mwe-popups-settings'
	).val();
}

/**
 * Toggles the visibility between a form and the help
 *
 * @param {JQuery.Object} $el element that contains form and help
 * @param {boolean} visible if the help should be visible, or the form
 * @return {void}
 */
function toggleHelp( $el, visible ) {
	// eslint-disable-next-line no-jquery/no-global-selector
	const $dialog = $( '#mwe-popups-settings' ),
		formSelectors = 'main, .save, .close',
		helpSelectors = '.mwe-popups-settings-help, .okay';

	if ( visible ) {
		$dialog.find( formSelectors ).hide();
		$dialog.find( helpSelectors ).show();
	} else {
		$dialog.find( formSelectors ).show();
		$dialog.find( helpSelectors ).hide();
	}
}

/**
 * Checks if the NavigationPopups gadget is enabled by looking at the global
 * variables
 *
 * @return {boolean} if navpops was found to be enabled
 */
function isNavPopupsEnabled() {
	/* global pg */
	return typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined;
}
