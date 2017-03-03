var mw = window.mediaWiki,
	$ = jQuery;

/**
 * @private
 *
 * Gets the title of a local page from an href given some configuration.
 *
 * @param {String} href
 * @param {mw.Map} config
 * @return {String|undefined}
 */
function getTitle( href, config ) {
	var linkHref,
		matches,
		queryLength,
		titleRegex = new RegExp( mw.RegExp.escape( config.get( 'wgArticlePath' ) )
			.replace( '\\$1', '(.+)' ) );

	// Skip every URI that mw.Uri cannot parse
	try {
		linkHref = new mw.Uri( href );
	} catch ( e ) {
		return undefined;
	}

	// External links
	if ( linkHref.host !== location.hostname ) {
		return undefined;
	}

	queryLength = Object.keys( linkHref.query ).length;

	// No query params (pretty URL)
	if ( !queryLength ) {
		matches = titleRegex.exec( linkHref.path );
		return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
	} else if ( queryLength === 1 && linkHref.query.hasOwnProperty( 'title' ) ) {
		// URL is not pretty, but only has a `title` parameter
		return linkHref.query.title;
	}

	return undefined;
}

/**
 * Processes and returns link elements (or "`<a>`s") that are eligible for
 * previews in a given container.
 *
 * An `<a>` is eligible for a preview if:
 *
 * * It has an href and a title, i.e. `<a href="/wiki/Foo" title="Foo" />`.
 * * It doesn't have any blacklisted CSS classes.
 * * Its href is a valid URI of a page on the local wiki.
 *
 * If an `<a>` is eligible, then the title of the page on the local wiki is
 * stored in the `data-previews-page-title` attribute for later reuse.
 *
 * @param {jQuery} $container
 * @param {String[]} blacklist If an `<a>` has one or more of these CSS
 *  classes, then it will be ignored.
 * @param {mw.Map} config
 *
 * @return {jQuery}
 */
function processLinks( $container, blacklist, config ) {
	var contentNamespaces;

	contentNamespaces = config.get( 'wgContentNamespaces' );

	return $container
		.find( 'a[href][title]:not(' + blacklist.join( ', ' ) + ')' )
		.filter( function () {
			var title,
				titleText = getTitle( this.href, config );

			if ( !titleText ) {
				return false;
			}
			// Is titleText in a content namespace?
			title = mw.Title.newFromText( titleText );
			if ( title && ( $.inArray( title.namespace, contentNamespaces ) >= 0 ) ) {
				$( this ).data( 'page-previews-title', titleText );

				return true;
			}
		} );
}

module.exports = processLinks;

// Add processLinks to a global namespace to be tested in
// tests/qunit/ext.popups/processLinks.test.js
mw.popups = mw.popups || {};
mw.popups.processLinks = processLinks;
