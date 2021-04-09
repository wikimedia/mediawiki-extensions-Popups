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
	let title;

	/**
	 * Destroys the title attribute of the element, storing its value in local
	 * state so that it can be restored later (see `restoreTitleAttr`).
	 *
	 * @param {Element} el
	 * @return {void}
	 */
	function destroyTitleAttr( el ) {
		const $el = $( el );

		// Has the user dwelled on a link? If we've already removed its title
		// attribute, then NOOP.
		if ( title ) {
			return;
		}

		title = $el.attr( 'title' );

		$el.attr( 'title', '' );
	}

	/**
	 * Restores the title attribute of the element.
	 *
	 * @param {Element} el
	 * @return {void}
	 */
	function restoreTitleAttr( el ) {
		$( el ).attr( 'title', title );

		title = undefined;
	}

	return ( oldState, newState ) => {
		const hasPrevActiveLink = oldState && oldState.preview.activeLink;

		if ( !newState.preview.enabled ) {
			return;
		}

		if ( hasPrevActiveLink ) {
			// Has the user dwelled on a link immediately after abandoning another
			// (remembering that the ABANDON_END action is delayed by
			// ~100 ms).
			if ( oldState.preview.activeLink !== newState.preview.activeLink ) {
				restoreTitleAttr( oldState.preview.activeLink );
			}
		}

		if ( newState.preview.activeLink ) {
			destroyTitleAttr( newState.preview.activeLink );
		}
	};
}
