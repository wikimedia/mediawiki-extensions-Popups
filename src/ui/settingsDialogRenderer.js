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
				const $page = $dialog.find( '#mwe-popups-settings-' + previewTypes.TYPE_PAGE ),
					$ref = $dialog.find( '#mwe-popups-settings-' + previewTypes.TYPE_REFERENCE );
				boundActions.saveSettings( {
					[ previewTypes.TYPE_PAGE ]: $page.is( ':checked' ),
					[ previewTypes.TYPE_REFERENCE ]:
						// TODO: Remove when not in Beta any more
						config.get( 'wgPopupsReferencePreviewsBetaFeature' ) ?
							null :
							$ref.is( ':checked' )
				} );
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
			 * @param {string} type
			 * @param {boolean} enabled
			 */
			setEnabled( type, enabled ) {
				$dialog.find( '#mwe-popups-settings-' + type ).prop( 'checked', enabled );
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
