( function ( $, mw, M ) {
	/**
	 * @class mw.popups.render
	 * @singleton
	 */
	mw.popups.render = {};

	/**
	 * Render a new LinkPreviewDrawer
	 *
	 * @method render
	 * @param {Object} link
	 * @param {Object} event
	 */
	mw.popups.render.render = function ( link, event ) {
		var LinkPreviewDrawer = M.require( 'ext.popups.mobilelinkpreview/LinkPreviewDrawer' );

		// Ignore if its meant to call a function
		// TODO: Remove this when adding reference popups
		if ( link.attr( 'href' ) === '#' ) {
			return;
		}

		if ( !mw.popups.$popup ) {
			mw.popups.$popup = new LinkPreviewDrawer();
		}
		mw.popups.$popup.loadNew( event.target.title );
		event.preventDefault();
	};

} )( jQuery, mediaWiki, mediaWiki.mobileFrontend );
