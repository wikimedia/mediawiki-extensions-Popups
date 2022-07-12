/**
 * @module title
 */

/**
 * Fast, native check if we are parsing a self-link, with the only difference beeing the hash.
 *
 * @param {HTMLAnchorElement} el
 * @return {boolean}
 */
function isOwnPageAnchorLink( el ) {
	return el.hash &&
		// Note: The protocol is ignored for the sake of simplicity.
		// Can't compare username and password because they aren't readable from `location`.
		el.host === location.host &&
		el.pathname === location.pathname &&
		el.search === location.search;
}

/**
 * Gets the title of a local page from an href given some configuration.
 *
 * @param {string} href
 * @param {mw.Map} config
 * @return {string|undefined}
 */
export function getTitle( href, config ) {
	// Skip every URI that mw.Uri cannot parse
	let linkHref;
	try {
		linkHref = new mw.Uri( href );
	} catch ( e ) {
		return undefined;
	}

	// External links
	if ( linkHref.host !== location.hostname ) {
		return undefined;
	}

	const queryLength = Object.keys( linkHref.query ).length;
	let title;

	// No query params (pretty URL)
	if ( !queryLength ) {
		const pattern = mw.util.escapeRegExp( config.get( 'wgArticlePath' ) ).replace( '\\$1', '([^?#]+)' ),
			matches = new RegExp( pattern ).exec( linkHref.path );

		// We can't be sure decodeURIComponent() is able to parse every possible match
		try {
			title = matches && decodeURIComponent( matches[ 1 ] );
		} catch ( e ) {
			// Will return undefined below
		}
	} else if ( queryLength === 1 && 'title' in linkHref.query ) {
		// URL is not pretty, but only has a `title` parameter
		title = linkHref.query.title;
	}

	return title ? `${title}${linkHref.fragment ? `#${linkHref.fragment}` : ''}` : undefined;
}

/**
 * Given a page title it will return the mediawiki.Title if it is an eligible
 * link for showing page previews, null otherwise
 *
 * @param {string|undefined} title page title to check if it should show preview
 * @param {number[]} contentNamespaces contentNamespaces as specified in
 * wgContentNamespaces
 * @return {mw.Title|null}
 */
export function isValid( title, contentNamespaces ) {
	if ( !title ) {
		return null;
	}

	// Is title in a content namespace?
	const mwTitle = mw.Title.newFromText( title );
	if ( mwTitle && contentNamespaces.indexOf( mwTitle.namespace ) >= 0 ) {
		return mwTitle;
	}

	return null;
}

/**
 * Return an mw.Title from an HTMLAnchorElement if valid for page previews. Convenience
 * method
 *
 * @param {HTMLAnchorElement} el
 * @param {mw.Map} config
 * @return {mw.Title|null}
 */
export function fromElement( el, config ) {
	if ( el.dataset.title ) {
		return mw.Title.newFromText( el.dataset.title );
	}
	if ( isOwnPageAnchorLink( el ) ) {
		// No need to check the namespace. A self-link can't point to different one.
		try {
			return mw.Title.newFromText( config.get( 'wgPageName' ) + decodeURIComponent( el.hash ) );
		} catch ( e ) {
			return null;
		}
	}

	return isValid(
		getTitle( el.href, config ),
		config.get( 'wgContentNamespaces' )
	);
}
