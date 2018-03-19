const $ = jQuery;

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
	 */
	function restoreTitleAttr( el ) {
		$( el ).attr( 'title', title );

		title = undefined;
	}

	return ( prevState, state ) => {
		const hasPrevActiveLink = prevState && prevState.preview.activeLink;

		if ( !state.preview.enabled ) {
			return;
		}

		if ( hasPrevActiveLink ) {

			// Has the user dwelled on a link immediately after abandoning another
			// (remembering that the ABANDON_END action is delayed by
			// ~10e2 ms).
			if ( prevState.preview.activeLink !== state.preview.activeLink ) {
				restoreTitleAttr( prevState.preview.activeLink );
			}
		}

		if ( state.preview.activeLink ) {
			destroyTitleAttr( state.preview.activeLink );
		}
	};
}
