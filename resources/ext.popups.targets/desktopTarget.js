( function ( $, mw ) {
	mw.popups.enabled = $.jStorage.get( 'mwe-popups-enabled' ) !== 'false';

	/**
	 * Returns valid jQuery selectors for which a popup should be triggered.
	 * This can be overwritten by targets.
	 *
	 * @return string
	 */
	mw.popups.triggers = 'mouseenter focus';

	/**
	 * Checks SVG support on the browser
	 *
	 * Set to false on Internet Explorer because adding SVGs
	 * through JavaScript in IE is failing. Thus, falling back to PNGs
	 *
	 * @property {boolean} supportsSVG
	 */
	mw.popups.supportsSVG = ( $.client.profile().name === 'msie' ) ?
		false :
		!!(
			// Check if we can create an <svg> element.
			// If yes, check if drawing a rectangle inside the element is supported.
			// We could have also checked for the existence of any similar method,
			// i.e. createSVGPoint, or createSVGAngle, etc.
			// If yes, then we can be pretty sure that the browser supports SVGs.
			// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
			// https://developer.mozilla.org/en-US/docs/Web/API/SVGRect
			'createElementNS' in document &&
			document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect
		);

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
				role: 'tooltip',
				'aria-hidden': 'true'
			} )
			.appendTo( document.body );
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

	mw.hook( 'wikipage.content' ).add( function ( $content ) {
		var $elements;
		mw.popups.$content = $content;
		$elements = mw.popups.selectPopupElements();

		if ( mw.popups.enabled ) {
			mw.popups.removeTooltips( $elements );
			mw.popups.setupTriggers( $elements );
		} else {
			// Events are logged even when Hovercards are disabled
			// See T88166 for details
			$elements.on( 'click', function ( event ) {
				var $this, href, action, logEvent, logPromise;

				if ( mw.popups.logger === undefined ) {
					return true;
				}

				$this = $( this );
				href = $this.attr( 'href' );
				action = mw.popups.logger.getAction( event );
				logEvent = {
					pageTitleHover: $this.attr( 'title' ),
					pageTitleSource: mw.config.get( 'wgTitle' ),
					popupEnabled: mw.popups.enabled,
					action: action
				};
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
} )( jQuery, mediaWiki );
