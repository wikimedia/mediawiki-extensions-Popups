( function ( mw, $ ) {

	/**
	 * Creates an instance of the link title change listener.
	 *
	 * While the user dwells on a link, then it becomes the active link. The
	 * change listener will remove a link's `title` attribute while it's the
	 * active link.
	 *
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.linkTitle = function () {
		var title;

		return function ( prevState, state ) {
			var $link;

			// Has the user dwelled on a link? If we've already removed its title
			// attribute, then NOOP.
			if ( state.preview.activeLink && !title ) {
				$link = $( state.preview.activeLink );

				title = $link.attr( 'title' );

				$link.attr( 'title', '' );

			// Has the user abandoned the link?
			} else if ( prevState && prevState.preview.activeLink ) {
				$( prevState.preview.activeLink ).attr( 'title', title );

				title = undefined;
			}
		};
	};

}( mediaWiki, jQuery ) );
