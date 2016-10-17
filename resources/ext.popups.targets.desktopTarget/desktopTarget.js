( function ( $, mw ) {
	/**
	 * Check whether the Navigation Popups gadget is enabled
	 *
	 * @return {boolean}
	 */
	function isNavigationPopupsGadgetEnabled() {
		return window.pg !== undefined;
	}

	/**
	 * `mouseleave` and `blur` events handler for links that are eligible for
	 * popups, but when Popups are disabled.
	 *
	 * @param {Object} event
	 */
	function onLinkAbandon( event ) {
		var $this = $( this ),
			data = event.data || {};

		$this.off( 'mouseleave blur', onLinkAbandon );

		if ( data.dwellStartTime && data.linkInteractionToken ) {
			mw.track( 'ext.popups.event', {
				pageTitleHover: $this.attr( 'title' ),
				action: 'dwelledButAbandoned',
				totalInteractionTime: Math.round( mw.now() - data.dwellStartTime ),
				linkInteractionToken: data.linkInteractionToken,
				hovercardsSuppressedByGadget: data.hovercardsSuppressedByGadget
			} );
		}
	}

	/**
	 * `mouseenter` and `focus` events handler for links that are eligible for
	 * popups. Handles the disply of a popup.
	 *
	 * @param {Object} event
	 */
	function onLinkHover( event ) {
		var $link = $( this ),
			// Cache the hover start time and link interaction token for a later use
			eventData = {
				dwellStartTime: mw.now(),
				linkInteractionToken: mw.popups.getRandomToken(),
				hovercardsSuppressedByGadget: isNavigationPopupsGadgetEnabled()
			};

		mw.track( 'ext.popups.schemaPopups', $.extend( {}, eventData, {
				action: 'hover'
			} )
		);
		// Only enable Popups when the Navigation popups gadget is not enabled
		if ( !eventData.hovercardsSuppressedByGadget && mw.popups.enabled ) {
			if ( mw.popups.scrolled ) {
				return;
			}

			mw.popups.removeTooltips( $link );
			mw.popups.render.render( $link, event,
				eventData.dwellStartTime, eventData.linkInteractionToken );
		} else {
			$link
				.off( 'mouseleave.popups blur.popups click.popups' )
				// We are passing the same data, rather than a shared object, into two different functions.
				// The reason is that we don't want one function to change the data and
				// have a side-effect on the other function's data.
				.on( 'mouseleave.popups blur.popups', eventData, onLinkAbandon )
				.on( 'click.popups', eventData, onLinkClick );
		}
	}

	/**
	 * `click` event handler for links that are eligible for popups, but when
	 * Popups are disabled.
	 *
	 * @param {Object} event
	 */
	function onLinkClick( event ) {
		var $this = $( this ),
			action = mw.popups.getAction( event ),
			href = $this.attr( 'href' ),
			data = event.data || {};

		$this.off( 'click', onLinkClick );

		mw.track( 'ext.popups.event', {
			pageTitleHover: $this.attr( 'title' ),
			action: action,
			totalInteractionTime: Math.round( mw.now() - data.dwellStartTime ),
			linkInteractionToken: data.linkInteractionToken,
			hovercardsSuppressedByGadget: data.hovercardsSuppressedByGadget
		} );

		if ( action  === 'opened in same tab' ) {
			event.preventDefault();
			window.location.href = href;
		}
	}

	mw.popups.enabled = mw.popups.getEnabledState();

	/**
	 * Creates the SVG mask used to create the
	 * the triangle pointer on popups with images
	 *
	 * @method createSVGMask
	 */
	mw.popups.createSVGMask = function () {
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

	/**
	 * Adds the events necessary to all links within a container
	 * so that a popup shows on hover.
	 *
	 * @param {jQuery.Object} $content to setup mouse events for
	 * @ignore
	 * @method setupMouseEvents
	 */
	function setupMouseEvents( $content ) {
		mw.popups.$content = $content;
		mw.popups.selectPopupElements()
			.on( 'mouseenter focus', onLinkHover );
	}

	mw.hook( 'wikipage.content' ).add( setupMouseEvents );

	function initPopups() {
		mw.popups.checkScroll();
		mw.popups.createSVGMask();
		mw.popups.createPopupElement();
	}

	$( function () {
		if ( mw.popups.enabled ) {
			initPopups();
		}

		mw.track( 'ext.popups.event', {
			action: 'pageLoaded',
			hovercardsSuppressedByGadget: isNavigationPopupsGadgetEnabled()
		} );
	} );
} )( jQuery, mediaWiki );
