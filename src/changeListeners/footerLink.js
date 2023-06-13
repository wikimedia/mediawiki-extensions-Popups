/**
 * @module changeListeners/footerLink
 */

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
 * @return {HTMLElement} The link element
 */
function createFooterLink() {
	const footerListItem = document.createElement( 'li' );
	const footerLinkElement = document.createElement( 'a' );
	footerLinkElement.href = '#';
	footerLinkElement.textContent = mw.message( 'popups-settings-enable' ).text();
	footerListItem.appendChild( footerLinkElement );

	// As yet, we don't know whether the link should be visible.
	footerListItem.style.display = 'none';

	// From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js,
	// which was written by Yair rand <https://en.wikipedia.org/wiki/User:Yair_rand>.
	let footer = document.querySelector( '#footer-places, #f-list' );

	if ( !footer ) {
		const footerLegacy = document.querySelector( '#footer li' );
		if ( footerLegacy ) {
			footer = footerLegacy.parentNode;
		}
	}

	if ( footer ) {
		footer.appendChild( footerListItem );
	}
	return footerListItem;
}

/**
 * Creates an instance of the footer link change listener.
 *
 * The change listener covers the following behaviour:
 *
 * * The "Edit preview settings" link (the "link") is appended to the footer menu
 *   (see `createFooterLink` above).
 * * When at least one popup type is disabled, then the link is shown;
 *   otherwise, the link is hidden.
 * * When the user clicks the link, then the `showSettings` bound action
 *   creator is called.
 *
 * @param {Object} boundActions
 * @return {ext.popups.ChangeListener}
 */
export default function footerLink( boundActions ) {
	let footerLinkElement;

	return ( oldState, newState ) => {
		if ( footerLinkElement === undefined ) {
			footerLinkElement = createFooterLink();
			footerLinkElement.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				boundActions.showSettings();
			} );
		}

		if ( newState.settings.shouldShowFooterLink ) {
			footerLinkElement.style.display = '';
		} else {
			footerLinkElement.style.display = 'none';
		}
	};
}
