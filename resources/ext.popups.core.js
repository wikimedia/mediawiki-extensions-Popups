( function ( $, mw ) {
	'use strict';

	/**
	 * @class mw.popups
	 * @singleton
	 */
	mw.popups = {};

	/**
	 * The API object used for all this extension's requests
	 * @property {Object} api
	 */
	mw.popups.api = new mw.Api();

	/**
	 * Whether the page is being scrolled.
	 * @property {boolean} scrolled
	 */
	mw.popups.scrolled = false;

	/**
	 * List of classes of which links are ignored
	 * @property {Array} IGNORE_CLASSES
	 */
	mw.popups.IGNORE_CLASSES = [
		'.extiw',
		'.image',
		'.new',
		'.internal',
		'.external',
		'.oo-ui-buttonedElement-button',
		'.cancelLink a'
	];

	/**
	 * Temporarily remove the title attribute of the links so that
	 * the yellow tooltips don't show up alongside the Hovercard.
	 *
	 * @method removeTooltips
	 */
	mw.popups.removeTooltips = function ( $elements ) {
		$elements
			.filter( '[title]:not([title=""])' )
			.on( 'mouseenter focus', function () {
				// We shouldn't empty the title attribute of links that
				// can't have Hovercards, ie. TextExtracts didn't return
				// anything. Its set in the article.init after attempting
				// to make an API request.
				if ( $( this ).data( 'dont-empty-title' ) !== true ) {
					$( this )
						.data( 'title', $( this ).attr( 'title' ) )
						.attr( 'title', '' );
				}
			} )
			.on( 'mouseleave blur', function () {
				$( this )
					.attr( 'title', $( this ).data( 'title' ) );
			} );
	};

	/**
	 * Register a hover event that may render a popup on an appropriate link.
	 *
	 * @method setupTriggers
	 */
	mw.popups.setupTriggers = function ( $elements ) {
		$elements.on( mw.popups.triggers, function ( event ) {
			if ( mw.popups.scrolled ) {
				return;
			}

			mw.popups.render.render( $( this ), event );
		} );
	};

	/**
	 * Given an href string for the local wiki, return the title, or undefined if
	 * the link is external, has extra query parameters, or contains no title.
	 *
	 * Note that the returned title is not sanitized (may contain underscores).
	 *
	 * @param {string} href
	 * @return {string|undefined}
	 */
	mw.popups.getTitle = function ( href ) {
		var title, titleRegex, matches, linkHref;

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

		if ( linkHref.query.hasOwnProperty( 'title' ) ) {
			// linkHref is not a pretty URL, e.g. /w/index.php?title=Foo

			title = linkHref.query.title;
			// Return undefined if there are query parameters other than title
			delete linkHref.query.title;
			return $.isEmptyObject( linkHref.query ) ? title : undefined;
		} else {
			// linkHref is a pretty URL, e.g. /wiki/Foo

			// Return undefined if there are any query parameters
			if ( !$.isEmptyObject( linkHref.query ) ) {
				return undefined;
			}
			titleRegex = new RegExp( mw.RegExp.escape( mw.config.get( 'wgArticlePath' ) )
				.replace( '\\$1', '(.+)' ) );
			matches = titleRegex.exec( linkHref.path );
			return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
		}
	};

	/**
	 * Returns links that can have Popups
	 *
	 * @method selectPopupElements
	 */
	mw.popups.selectPopupElements = function () {
		var contentNamespaces = mw.config.get( 'wgContentNamespaces' );
		return mw.popups.$content
			.find( 'a[href][title]:not(' + mw.popups.IGNORE_CLASSES.join( ', ' ) + ')' )
			.filter( function () {
				var title,
					titleText = mw.popups.getTitle( this.href );
				if ( !titleText ) {
					return false;
				}
				// Is titleText in a content namespace?
				title = mw.Title.newFromText( titleText );
				return title && ( $.inArray( title.namespace, contentNamespaces ) >= 0 );
			} );
	};

} )( jQuery, mediaWiki );
