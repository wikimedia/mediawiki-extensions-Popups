/**
 * @module settingsDialogRenderer
 */

import { createSettingsDialog } from './settingsDialog';
import { previewTypes } from '../preview/model';

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
			$dialog = createSettingsDialog();
			$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );

			// Setup event bindings

			$dialog.find( '.save' ).on( 'click', () => {
				const enabled = $dialog.find( '#mwe-popups-settings-simple' ).is( ':checked' );
				// TODO: Make this work for other popup types
				boundActions.saveSettings( previewTypes.TYPE_PAGE, enabled );
			} );
			$dialog.find( '.close, .okay' ).on( 'click', boundActions.hideSettings );
		}

		return {
			/**
			 * Append the dialog and overlay to a DOM element
			 *
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
			 *
			 * @param {boolean} visible if you want to show or hide the help dialog
			 */
			toggleHelp( visible ) {
				toggleHelp( $dialog, visible );
			},

			/**
			 * Update the form depending on the enabled flag
			 *
			 * @param {boolean} enabled if page previews are enabled
			 */
			setEnabled( enabled ) {
				// TODO: Make this work for other popup types
				$dialog.find( '#mwe-popups-settings-simple' ).prop( 'checked', enabled );
			}
		};
	};
}

/**
 * Toggles the visibility between a form and the help
 *
 * @param {JQuery.Object} $el element that contains form and help
 * @param {boolean} visible if the help should be visible, or the form
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
