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
		'oo-ui-buttonedElement-button'
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
			var
				$this = $( this ),
				href = $this.attr( 'href' );

			// No popup if scrolling or on certain kinds of links.
			if (
				mw.popups.scrolled || // Prevents hovering on popups while scrolling
				href.indexOf( '?' ) !== -1 ||
				href.indexOf( 'javascript:' ) === 0 || // jshint ignore:line
				href.indexOf( location.origin + location.pathname + '#' ) === 0
			) {
				// TODO No popup for this, but removeTooltips() has already blanked the title.
				return;
			}

			mw.popups.render.render( $this, event );
		} );
	};

	/**
	 * Returns links that can have Popups
	 *
	 * @method selectPopupElements
	 */
	mw.popups.selectPopupElements = function () {
		return mw.popups.$content.find( 'a:not(' + mw.popups.IGNORE_CLASSES.join(', ') + ')' );
	};

	mw.hook( 'wikipage.content').add( function ( $content ) {
		if ( mw.popups.enabled ) {
			mw.popups.$content = $content;

			var $elements = mw.popups.selectPopupElements();
			mw.popups.removeTooltips( $elements );
			mw.popups.setupTriggers( $elements );
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
