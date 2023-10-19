/**
 * @module settingsDialogRenderer
 */

import { createSettingsDialog } from './settingsDialog';

/**
 * Creates a render function that will create the settings dialog and return
 * a set of methods to operate on it
 *
 * @param {boolean} referencePreviewsAvaliable
 * @return {Function} render function
 */
export default function createSettingsDialogRenderer( referencePreviewsAvaliable ) {
	/**
	 * Cached settings dialog
	 *
	 * @type {HTMLElement}
	 */
	let dialog,
		/**
		 * Cached settings overlay
		 *
		 * @type {HTMLElement}
		 */
		overlay;

	/**
	 * Renders the relevant form and labels in the settings dialog
	 *
	 * @param {Object} boundActions
	 * @return {Object} object with methods to affect the rendered UI
	 */
	return ( boundActions ) => {
		if ( !dialog ) {
			dialog = createSettingsDialog( referencePreviewsAvaliable );
			overlay = document.createElement( 'div' );
			overlay.classList.add( 'mwe-popups-overlay' );

			// Setup event bindings

			dialog.querySelector( '.save' ).addEventListener( 'click', () => {
				const enabled = {};
				Array.prototype.forEach.call( dialog.querySelectorAll( 'input' ), ( el ) => {
					enabled[ el.value ] = el.matches( ':checked' );
				} );
				boundActions.saveSettings( enabled );
			} );
			dialog.querySelector( '.close' ).addEventListener( 'click', boundActions.hideSettings );
			dialog.querySelector( '.okay' ).addEventListener( 'click', boundActions.hideSettings );
		}

		return {
			/**
			 * Append the dialog and overlay to a DOM element
			 *
			 * @param {HTMLElement} el
			 */
			appendTo( el ) {
				el.appendChild( overlay );
				overlay.appendChild( dialog );
			},

			/**
			 * Show the settings element and position it correctly
			 */
			show() {
				overlay.style.display = '';
			},

			/**
			 * Hide the settings dialog.
			 */
			hide() {
				overlay.style.display = 'none';
			},

			/**
			 * Toggle the help dialog on or off
			 *
			 * @param {boolean} visible if you want to show or hide the help dialog
			 */
			toggleHelp( visible ) {
				toggleHelp( dialog, visible );
			},

			/**
			 * Update the form depending on the enabled flag
			 *
			 * @param {Object} enabled Mapping preview type identifiers to boolean flags
			 */
			setEnabled( enabled ) {
				Object.keys( enabled ).forEach( ( type ) => {
					const node = dialog.querySelector( `#mwe-popups-settings-${type}` );
					if ( node ) {
						node.checked = enabled[ type ];
					}
				} );
			}
		};
	};
}

/**
 * @param {NodeList} nodes
 */
function hideAll( nodes ) {
	Array.prototype.forEach.call( nodes, ( node ) => {
		node.style.display = 'none';
	} );
}

/**
 * @param {NodeList} nodes
 */
function showAll( nodes ) {
	Array.prototype.forEach.call( nodes, ( node ) => {
		node.style.display = '';
	} );
}

/**
 * Toggles the visibility between a form and the help
 *
 * @param {HTMLElement} dialog element that contains form and help
 * @param {boolean} visible if the help should be visible, or the form
 */
export function toggleHelp( dialog, visible ) {
	const
		formSelectors = 'main, .save, .close',
		helpSelectors = '.mwe-popups-settings-help, .okay';

	if ( visible ) {
		hideAll( dialog.querySelectorAll( formSelectors ) );
		showAll( dialog.querySelectorAll( helpSelectors ) );
	} else {
		showAll( dialog.querySelectorAll( formSelectors ) );
		hideAll( dialog.querySelectorAll( helpSelectors ) );
	}
}
