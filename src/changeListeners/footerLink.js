/**
 * @module changeListeners/footerLink
 */

const mw = window.mediaWiki,
	$ = jQuery;

/**
 * Creates the link element and appends it to the footer element.
 *
 * The following elements are considered to be the footer element (highest
 * priority to lowest):
 *
 * # `#footer-places`
 * # `#f-list`
 * # The parent element of `#footer li`, which is either an `ol` or `ul`.
 *
 * @return {jQuery} The link element
 */
function createFooterLink() {
	const $link = $( '<li>' ).append(
		$( '<a>' )
			.attr( 'href', '#' )
			.text( mw.message( 'popups-settings-enable' ).text() )
	);

	// As yet, we don't know whether the link should be visible.
	$link.hide();

	// From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js,
	// which was written by Yair rand <https://en.wikipedia.org/wiki/User:Yair_rand>.
	let $footer = $( '#footer-places, #f-list' );

	if ( $footer.length === 0 ) {
		$footer = $( '#footer li' ).parent();
	}

	$footer.append( $link );

	return $link;
}

/**
 * Creates an instance of the footer link change listener.
 *
 * The change listener covers the following behaviour:
 *
 * * The "Enable previews" link (the "link") is appended to the footer menu
 *   (see `createFooterLink` above).
 * * When Page Previews are disabled, then the link is shown; otherwise, the
 *   link is hidden.
 * * When the user clicks the link, then the `showSettings` bound action
 *   creator is called.
 *
 * @param {Object} boundActions
 * @return {ext.popups.ChangeListener}
 */
export default function footerLink( boundActions ) {
	let $footerLink;

	return ( prevState, state ) => {
		if ( $footerLink === undefined ) {
			$footerLink = createFooterLink();
			$footerLink.click( ( e ) => {
				e.preventDefault();
				boundActions.showSettings();
			} );
		}

		if ( state.settings.shouldShowFooterLink ) {
			$footerLink.show();
		} else {
			$footerLink.hide();
		}
	};
}
