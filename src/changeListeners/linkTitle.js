/**
 * Creates an instance of the link title change listener.
 *
 * While the user dwells on a link, then it becomes the active link. The
 * change listener will remove a link's `title` attribute while it's the
 * active link.
 *
 * @return {ext.popups.ChangeListener}
 */
export default function linkTitle() {
	let savedTitle;

	/**
	 * Destroys the title attribute of the element, storing its value in local
	 * state so that it can be restored later (see `restoreTitleAttr`).
	 *
	 * @param {Element|undefined} el
	 */
	function destroyTitleAttr( el ) {
		// Has the user dwelled on a link? If we've already removed its title attribute, then NOOP.
		if ( el && !savedTitle ) {
			savedTitle = el.getAttribute( 'title' );
			el.setAttribute( 'title', '' );
		}
	}

	/**
	 * Restores the title attribute of the element.
	 *
	 * @param {Element|undefined} el
	 */
	function restoreTitleAttr( el ) {
		// Avoid overwriting a non-empty title with an empty one, just to be sure
		if ( el && savedTitle ) {
			el.setAttribute( 'title', savedTitle );
			savedTitle = undefined;
		}
	}

	return ( oldState, newState ) => {
		const oldLink = oldState && oldState.preview.activeLink;

		// Usually only one side is set when the user enters or leaves a link. Both sides contain
		// two different links when the user dwelled on a link immediately after abandoning another
		// (remembering that the ABANDON_END action is delayed by ~100 ms).
		if ( oldLink !== newState.preview.activeLink ) {
			restoreTitleAttr( oldLink );

			// FIXME: This will not work on anything other than 'reference' or 'preview' types as
			// mw.popups.register does not register the previewType as a key in newState.preview.enabled
			// This is not a problem at time of writing (November 2022) but will become a problem if we
			// introduce custom preview types that must remove the title attribute.
			if ( newState.preview.enabled[ newState.preview.previewType ] ) {
				destroyTitleAttr( newState.preview.activeLink );
			}
		}
	};
}
