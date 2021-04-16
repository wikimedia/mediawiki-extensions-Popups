/**
 * @module settingsDialogRenderer
 */

import { createSettingsDialog } from './settingsDialog';
import { previewTypes } from '../preview/model';

/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 *
 * @param {mw.Map} config
 * @return {Function} render function
 */
export default function createSettingsDialogRenderer( config ) {
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
			$dialog = createSettingsDialog( config.get( 'wgPopupsReferencePreviewsBetaFeature' ) );
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
			 * @param {boolean} enabled if page previews are enabled
			 * @return {void}
			 */
			setEnabled( enabled ) {
				// Check the appropriate radio button
				$dialog.find( enabled ? '#mwe-popups-settings-simple' : '#mwe-popups-settings-off' )
					.prop( 'checked', true );
			}
		};
	};
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
