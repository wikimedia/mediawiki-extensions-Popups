( function ( $, mw ) {

	/**
	 * @class mw.popups
	 * @singleton
	 */
	mw.popups = {};

	/**
	 * Checks SVG support on the browser
	 * @property {Boolean} supportsSVG
	 */
	mw.popups.supportsSVG = document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#Image', '1.1' );

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
		'.exitw',
		'.image',
		'.new',
		'.internal'
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
			.attr( 'role', 'tooltip' )
			.attr( 'aria-hidden', 'true' )
			.addClass( 'mwe-popups' )
			.appendTo( document.body );
	};

	/**
	 * Temorarily remove tooltips from links on hover
	 *
	 * @method removeTooltips
	 */
	mw.popups.removeTooltips = function () {
		var notSelector = ':not(' + mw.popups.IGNORE_CLASSES.join(', ') + ')';
		mw.popups.$content.find( 'a' + notSelector + ':not([title=""])' )
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
	 * Register the hover event on links
	 *
	 * @method setupTriggers
	 */
	mw.popups.setupTriggers = function () {
		var notSelector = ':not(' + mw.popups.IGNORE_CLASSES.join(', ') + ')';

		mw.popups.$content.find( 'a' + notSelector + ':not([title=""])' ).on( 'mouseenter focus', function ( event ) {
			var
				$this = $( this ),
				href = $this.attr( 'href' );

			if (
				mw.popups.scrolled || // Prevents hovering on popups while scrolling
				href.indexOf( '?' ) !== -1 ||
				href.indexOf( location.origin + location.pathname + '#' ) === 0
			) {
				return;
			}

			mw.popups.render.render( $this, event );
		} );
	};

	mw.hook( 'wikipage.content').add( function ( $content ) {
		mw.popups.$content = $content;
		mw.popups.removeTooltips();
		mw.popups.setupTriggers();
	} );

	$( function () {
		mw.popups.checkScroll();
		mw.popups.createSVGMask();
		mw.popups.createPopupElement();
	} );

} ) ( jQuery, mediaWiki );
