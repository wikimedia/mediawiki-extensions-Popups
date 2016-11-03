/*global popupDelay: true, popupHideDelay: true*/

( function ( $, mw ) {
	var closeTimer, openTimer,
		$activeLink = null,
		logData = {};

	/**
	 * Sets the link that the currently shown popup relates to
	 *
	 * @ignore
	 * @param {jQuery|null} [$link] if undefined there is no active link
	 */
	function setActiveLink( $link ) {
		$activeLink = $link;
	}

	/**
	 * Gets the link that the currently shown popup relates to
	 *
	 * @ignore
	 * @return {jQuery|null} if undefined there is no active link
	 */
	function getActiveLink() {
		return $activeLink;
	}

	/**
	 * Logs the click on link or popup
	 *
	 * @param {Object} event
	 */
	function logClickAction( event ) {
		mw.track( 'ext.popups.event', $.extend( {}, logData, {
			action: mw.popups.getAction( event )
		} ) );
	}

	/**
	 * Logs when a popup is dismissed
	 */
	function logDismissAction() {
		mw.track( 'ext.popups.event', $.extend( {}, logData, {
			action: 'dismissed'
		} ) );
	}
	/**
	 * @class mw.popups.render
	 * @singleton
	 */
	mw.popups.render = {};

	/**
	 * Time to wait in ms before showing a popup on hover.
	 * Use the navigation popup delay if it has been set by the user.
	 * This isn't the official way of setting the delay
	 * TODO: Add setting to change delay
	 * @property POPUP_DELAY
	 */
	mw.popups.render.POPUP_DELAY = ( typeof popupDelay === 'undefined' ) ?
		500 :
		popupDelay * 1000;

	/**
	 * Time to wait in ms before closing a popup on de-hover.
	 * Use the navigation popup delay if it has been set by the user
	 * This isn't the official way of setting the delay
	 * TODO: Add setting to change delay
	 * @property POPUP_CLOSE_DELAY
	 */
	mw.popups.render.POPUP_CLOSE_DELAY = ( typeof popupHideDelay === 'undefined' ) ?
		300 :
		popupHideDelay * 1000;

	/**
	 * Time to wait in ms before starting the API queries on hover, must be <= POPUP_DELAY
	 * @property API_DELAY
	 */
	mw.popups.render.API_DELAY = 50;

	/**
	 * Cache of all the popups that were opened in this session
	 * @property {Object} cache
	 */
	mw.popups.render.cache = {};

	/**
	 * Object to store all renderers
	 * @property {Object} renderers
	 */
	mw.popups.render.renderers = {};

	/**
	 * Close all other popups and render the new one from the cache
	 * or by finding and calling the correct renderer
	 *
	 * @method render
	 * @param {jQuery.Object} $link that a hovercard should be shown for
	 * @param {jQuery.Event} event that triggered the render
	 * @param {string} linkInteractionToken random token representing the current interaction with the link
	 */
	mw.popups.render.render = function ( $link, event, linkInteractionToken ) {
		var linkHref = $link.attr( 'href' ),
			$activeLink = getActiveLink();

		// This will happen when the mouse goes from the popup box back to the
		// anchor tag. In such a case, the timer to close the box is cleared.
		if (
			$activeLink &&
			$activeLink[ 0 ] === $link[ 0 ]
		) {
			if ( closeTimer ) {
				closeTimer.abort();
			}
			return;
		}

		// If the mouse moves to another link (we already check if its the same
		// link in the previous condition), then close the popup.
		if ( $activeLink ) {
			mw.popups.render.closePopup( logDismissAction );
		}

		// Ignore if its meant to call a function
		// TODO: Remove this when adding reference popups
		if ( linkHref === '#' ) {
			return;
		}

		setActiveLink( $link );
		// Set the log data only after the current link is set, otherwise, functions like
		// closePopup will use the new log data when closing an old popup.
		logData = {
			pageTitleHover: mw.popups.getTitle( linkHref ),
			linkInteractionToken: linkInteractionToken
		};

		$link
			.on( 'mouseleave blur', leaveInactive )
			.off( 'click', clickHandler )
			.on( 'click', clickHandler );

		if ( mw.popups.render.cache[ $link.attr( 'href' ) ] ) {
			openTimer = mw.popups.render.wait( mw.popups.render.POPUP_DELAY )
				.done( function () {
					mw.popups.render.openPopup( $link, event );
				} );
		} else {
			// Wait for timer before making API queries and showing hovercard
			openTimer = mw.popups.render.wait( mw.popups.render.API_DELAY )
				.done( function () {
					var cachePopup, key,
						renderers = mw.popups.render.renderers;

					// Check run the matcher method of all renderers to find the right one
					for ( key in renderers ) {
						if ( renderers.hasOwnProperty( key ) && key !== 'article' ) {
							if ( !!renderers[ key ].matcher( $link.attr( 'href' ) ) ) {
								cachePopup = renderers[ key ].init( $link, $.extend( {}, logData ) );
							}
						}
					}

					// Use the article renderer if nothing else matches
					if ( cachePopup === undefined ) {
						cachePopup = mw.popups.render.renderers.article.init( $link, $.extend( {}, logData ) );
					}

					openTimer = mw.popups.render.wait( mw.popups.render.POPUP_DELAY - mw.popups.render.API_DELAY );

					$.when( openTimer, cachePopup ).done( function () {
						mw.popups.render.openPopup( $link, event );
					} );
				} );
		}
	};

	/**
	 * Retrieves the popup from the cache, uses its offset function
	 * applied classes and calls the process function.
	 * Takes care of event logging and attaching other events.
	 *
	 * @method openPopup
	 * @param {Object} link
	 * @param {Object} event
	 */
	mw.popups.render.openPopup = function ( link, event ) {
		var
			cache = mw.popups.render.cache [ link.attr( 'href' ) ],
			popup = cache.popup,
			offset = cache.getOffset( link, event ),
			classes = cache.getClasses( link );

		mw.popups.$popup
			.html( '' )
			.attr( 'class', 'mwe-popups' )
			.addClass( classes.join( ' ' ) )
			.css( offset )
			// Clone the element to avoid manipulating the cached object accidentally (see T68496)
			.append( popup.clone() )
			.show()
			.attr( 'aria-hidden', 'false' )
			.on( 'mouseleave', leaveActive )
			.on( 'mouseenter', function () {
				if ( closeTimer ) {
					closeTimer.abort();
				}
			} );

		// Hack to 'refresh' the SVG and thus display it
		// Elements get added to the DOM and not to the screen because of different namespaces of HTML and SVG
		// More information and workarounds here - http://stackoverflow.com/a/13654655/366138
		mw.popups.$popup.html( mw.popups.$popup.html() );

		// Event logging
		$.extend( logData, {
			pageTitleHover: cache.settings.title,
			namespaceIdHover: cache.settings.namespace
		} );
		mw.track( 'ext.popups.event', $.extend( {}, logData, {
				action: 'display'
			} )
		);

		cache.process( link, $.extend( {}, logData ) );

		mw.popups.$popup.find( 'a.mwe-popups-extract, a.mwe-popups-discreet' ).click( clickHandler );

		link
			.off( 'mouseleave blur', leaveInactive )
			.on( 'mouseleave blur', leaveActive );

		$( document ).on( 'keydown', closeOnEsc );

		mw.popups.incrementPreviewCount();
	};

	/**
	 * Click handler for the hovercard
	 *
	 * @method clickHandler
	 * @ignore
	 * @param {Object} event
	 */
	function clickHandler( event ) {
		var action = mw.popups.getAction( event ),
			$activeLink = getActiveLink();

		logClickAction( event );

		if ( action === 'opened in same tab' ) {
			window.location.href = $activeLink.attr( 'href' );
		}

		// close the popup
		mw.popups.render.closePopup();
	}

	/**
	 * Removes the hover class from the link and unbinds events
	 * Hides the popup, clears timers and sets it and the resets the renderer
	 *
	 * @param {Function} [logCallback] callback used to log before logData is reset
	 * @method closePopup
	 */
	mw.popups.render.closePopup = function ( logCallback ) {
		var fadeInClass, fadeOutClass,
			$activeLink = getActiveLink();

		$activeLink.off( 'mouseleave blur', leaveActive );

		fadeInClass = ( mw.popups.$popup.hasClass( 'mwe-popups-fade-in-up' ) ) ?
			'mwe-popups-fade-in-up' :
			'mwe-popups-fade-in-down';

		fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
			'mwe-popups-fade-out-down' :
			'mwe-popups-fade-out-up';

		mw.popups.$popup
			.off( 'mouseleave', leaveActive )
			.removeClass( fadeInClass )
			.addClass( fadeOutClass );

		mw.popups.render.wait( 150 ).done( function () {
			if ( mw.popups.$popup.hasClass( fadeOutClass ) ) {
				mw.popups.$popup
					.attr( 'aria-hidden', 'true' )
					.hide()
					.removeClass( 'mwe-popups-fade-out-down' );
			}
		} );

		if ( closeTimer ) {
			closeTimer.abort();
		}

		$( document ).off( 'keydown', closeOnEsc );

		if ( $.isFunction( logCallback ) ) {
			logCallback();
		}

		mw.popups.render.reset();
	};

	/**
	 * Return a promise corresponding to a `setTimeout()` call. Call `.abort()` on the return value
	 * to perform the equivalent of `clearTimeout()`
	 *
	 * @method wait
	 * @param {number} ms Milliseconds to wait
	 * @return {jQuery.Promise}
	 */
	mw.popups.render.wait = function ( ms ) {
		var deferred, promise, timeout;

		deferred = $.Deferred();

		timeout = setTimeout( function () {
			deferred.resolve();
		}, ms );

		promise = deferred.promise( { abort: function () {
			clearTimeout( timeout );
			deferred.reject();
		} } );

		return promise;
	};

	/**
	 * Use escape to close popup
	 *
	 * @method closeOnEsc
	 * @ignore
	 * @param {jQuery.Event} event
	 */
	function closeOnEsc( event ) {
		var $activeLink = getActiveLink();
		if ( event.keyCode === 27 && $activeLink ) {
			mw.popups.render.closePopup( logDismissAction );
		}
	}

	/**
	 * Closes the box after a delay
	 * Delay to give enough time for the user to move the pointer from
	 * the link to the popup box. Also avoids closing the popup by accident
	 *
	 * @method leaveActive
	 * @ignore
	 */
	function leaveActive() {
		closeTimer = mw.popups.render.wait( mw.popups.render.POPUP_CLOSE_DELAY ).done( function () {
			var $activeLink = getActiveLink();
			if ( $activeLink ) {
				mw.popups.render.closePopup( logDismissAction );
			}
		} );
	}

	/**
	 * Unbinds events on the anchor tag and aborts AJAX request.
	 *
	 * @method leaveInactive
	 * @ignore
	 */
	function leaveInactive() {
		var $activeLink = getActiveLink();

		mw.track( 'ext.popups.event', $.extend( {}, logData, {
			action: 'dwelledButAbandoned'
		} ) );

		$activeLink.off( 'mouseleave blur', leaveInactive );
		if ( openTimer ) {
			openTimer.abort();
		}
		mw.popups.render.abortCurrentRequest();

		mw.popups.render.reset();
	}

	/**
	 * Resets the renderer
	 *
	 * @method reset
	 */
	mw.popups.render.reset = function () {
		logData = {};
		setActiveLink( null );
		mw.popups.render.abortCurrentRequest();
		openTimer = undefined;
		closeTimer = undefined;
	};

} )( jQuery, mediaWiki );
