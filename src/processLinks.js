var mw = window.mediaWiki,
	$ = jQuery,
	getTitle = require( './getTitle' );

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
				$( this ).data( {
					'page-previews-title': title
				} );

				return true;
			}
		} );
}

module.exports = processLinks;
