( function ( $, mw ) {
	// FIXME: There should be a way to turn this off
	mw.popups.enabled = true;

	/**
	 * Triggers when a popup should be rendered.
	 */
	mw.popups.triggers = 'click';

	mw.hook( 'wikipage.content' ).add( function ( $content ) {
		mw.popups.$content = $content;
		mw.popups.setupTriggers( mw.popups.selectPopupElements() );
	} );

} )( jQuery, mediaWiki );
