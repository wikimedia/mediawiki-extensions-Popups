import { createSettingsDialog } from './settingsDialog';

/**
 * @module settingsDialogRenderer
 */

const $ = jQuery;

/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 * @return {Function} render function
 */
export default function createSettingsDialogRenderer() {

	/**
	 * Cached settings dialog
	 *
	 * @type {jQuery}
	 */
	let $dialog,
		/**
		 * Cached settings overlay
		 *
		 * @type {jQuery}
		 */
		$overlay;

	/**
	 * Renders the relevant form and labels in the settings dialog
	 * @param {Object} boundActions
	 * @return {Object} object with methods to affect the rendered UI
	 */
	return ( boundActions ) => {

		if ( !$dialog ) {
			$dialog = createSettingsDialog( isNavPopupsEnabled() );
			$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );

			// Setup event bindings

			$dialog.find( '.save' ).click( () => {
				// Find the selected value (simple|advanced|off)
				const selected = getSelectedSetting( $dialog ),
					// Only simple means enabled, advanced is disabled in favor of
					// NavPops and off means disabled.
					enabled = selected === 'simple';

				boundActions.saveSettings( enabled );
			} );
			$dialog.find( '.close, .okay' ).click( boundActions.hideSettings );
		}

		return {
			/**
			 * Append the dialog and overlay to a DOM element
			 * @param {HTMLElement} el
			 */
			appendTo( el ) {
				$overlay.appendTo( el );
				$dialog.appendTo( $overlay );
			},

			/**
			 * Show the settings element and position it correctly
			 */
			show() {
				$overlay.show();
			},

			/**
			 * Hide the settings dialog.
			 */
			hide() {
				$overlay.hide();
			},

			/**
			 * Toggle the help dialog on or off
			 * @param {Boolean} visible if you want to show or hide the help dialog
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
			 * @param {Boolean} enabled if page previews are enabled
			 */
			setEnabled( enabled ) {
				let name = 'off';
				if ( enabled ) {
					name = 'simple';
				} else if ( isNavPopupsEnabled() ) {
					name = 'advanced';
				}

				// Check the appropriate radio button
				$dialog.find( `#mwe-popups-settings-${ name }` )
					.prop( 'checked', true );
			}
		};
	};
}

/**
 * Get the selected value on the radio button
 *
 * @param {jQuery.Object} $el the element to extract the setting from
 * @return {String} Which should be (simple|advanced|off)
 */
function getSelectedSetting( $el ) {
	return $el.find(
		'input[name=mwe-popups-setting]:checked, #mwe-popups-settings'
	).val();
}

/**
 * Toggles the visibility between a form and the help
 * @param {jQuery.Object} $el element that contains form and help
 * @param {Boolean} visible if the help should be visible, or the form
 */
function toggleHelp( $el, visible ) {
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
 * @return {Boolean} if navpops was found to be enabled
 */
function isNavPopupsEnabled() {
	/* global pg: false*/
	return typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined;
}
