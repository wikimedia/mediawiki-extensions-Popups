( function ( $, mw ) {
	'use strict';

	/**
	 * @class mw.popups
	 * @singleton
	 */
	mw.popups = {};

	mw.popups.enabled = $.jStorage.get( 'mwe-popups-enabled' ) !== 'false';

	/**
	 * Checks SVG support on the browser
	 *
	 * Set to false on Internet Explorer because adding SVGs
	 * through JavaScript in IE is failing. Thus, falling back to PNGs
	 *
	 * @property {Boolean} supportsSVG
	 */
	mw.popups.supportsSVG = ( $.client.profile().name === 'msie' ) ?
		false :
		document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#Image', '1.1' );

	/**
	 * The API object used for all this extension's requests
	 * @property {Object} api
	 */
	mw.popups.api = new mw.Api();

	/**
	 * Whether the page is being scrolled.
	 * @property {Boolean} scrolled
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
		'.oo-ui-buttonedElement-button'
	];

	/**
	 * If SVG is supported, creates the SVG mask used to create the
	 * the triangle pointer on popups with images
	 *
	 * @method createSVGMask
	 */
	mw.popups.createSVGMask = function () {
		if ( !mw.popups.supportsSVG ) {
			return false;
		}

		$( '<div>' )
			.attr( 'id', 'mwe-popups-svg' )
			.appendTo( document.body )
			.html(
				'<svg width="0" height="0">' +
					'<defs>' +
						'<clippath id="mwe-popups-mask">' +
							'<polygon points="0 8, 10 8, 18 0, 26 8, 1000 8, 1000 1000, 0 1000"/>' +
						'</clippath>' +
						'<clippath id="mwe-popups-mask-flip">' +
							'<polygon points="0 8, 274 8, 282 0, 290 8, 1000 8, 1000 1000, 0 1000"/>' +
						'</clippath>' +
						'<clippath id="mwe-popups-landscape-mask">' +
							'<polygon points="0 8, 174 8, 182 0, 190 8, 1000 8, 1000 1000, 0 1000"/>' +
						'</clippath>' +
						'<clippath id="mwe-popups-landscape-mask-flip">' +
							'<polygon points="0 0, 1000 0, 1000 243, 190 243, 182 250, 174 243, 0 243"/>' +
						'</clippath>' +
					'</defs>' +
				'</svg>'
			);
		return true;
	};

	/**
	 * Create the element that holds the popups
	 *
	 * @method createPopupElement
	 */
	mw.popups.createPopupElement = function () {
		mw.popups.$popup = $( '<div>' )
			.attr( {
				'class': 'mwe-popups',
				'role': 'tooltip',
				'aria-hidden': 'true'
			} )
			.appendTo( document.body );
	};

	/**
	 * Temorarily remove tooltips from links on hover
	 *
	 * @method removeTooltips
	 */
	mw.popups.removeTooltips = function ( $elements ) {
		$elements
			.filter( '[title]:not([title=""])' )
			.on( 'mouseenter focus', function () {
				$( this )
					.data( 'title', $( this ).attr( 'title' ) )
					.attr( 'title', '' );
			} )
			.on( 'mouseleave blur', function () {
				$( this )
					.attr( 'title', $( this ).data( 'title' ) );
			} );
	};

	/**
	 * Checks if the user is scrolling, sets to false on mousemove
	 *
	 * @method checkScroll
	 */
	mw.popups.checkScroll = function () {
		$( window ).on( 'scroll', function () {
			mw.popups.scrolled = true;
		} );

		$( window ).on( 'mousemove', function () {
			mw.popups.scrolled = false;
		} );
	};

	/**
	 * Register a hover event that may render a popup on an appropriate link.
	 *
	 * @method setupTriggers
	 */
	mw.popups.setupTriggers = function ( $elements ) {
		$elements.on( 'mouseenter focus', function ( event ) {
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
		var title, titleRegex, matches,
			linkHref = new mw.Uri( href );

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
			titleRegex = new RegExp( $.escapeRE( mw.config.get( 'wgArticlePath' ) )
				.replace( '\\$1', '(.+)' ) );
			matches = titleRegex.exec( linkHref.path );
			return matches ? decodeURIComponent( matches[1] ) : undefined;
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
			.find( 'a[href][title]:not(' + mw.popups.IGNORE_CLASSES.join(', ') + ')' )
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

	mw.hook( 'wikipage.content').add( function ( $content ) {
		mw.popups.$content = $content;
		var $elements = mw.popups.selectPopupElements();

		if ( mw.popups.enabled ) {
			mw.popups.removeTooltips( $elements );
			mw.popups.setupTriggers( $elements );
		} else {
			// Events are logged even when Hovercards are disabled
			// See T88166 for details
			$elements.on( 'click', function ( event ) {
				if ( mw.popups.logger === undefined ) {
					return true;
				}

				var
					$this = $( this ),
					href = $this.attr( 'href' ),
					action = mw.popups.logger.getAction( event ),
					logEvent = {
						pageTitleHover: $this.attr( 'title' ),
						pageTitleSource: mw.config.get( 'wgTitle' ),
						popupEnabled: mw.popups.enabled,
						action: action
					},
					logPromise = mw.popups.logger.log( logEvent );

				if ( action  === 'opened in same tab' ) {
					event.preventDefault();
					logPromise.then( function () {
						window.location.href = href;
					} );
				}
			} );
		}
	} );

	$( function () {
		if ( mw.popups.enabled ) {
			mw.popups.checkScroll();
			mw.popups.createSVGMask();
			mw.popups.createPopupElement();
		}
	} );

} ) ( jQuery, mediaWiki );
