/*global popupDelay: true, popupHideDelay: true*/

( function ( $, mw ) {

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
	 * The timer used to delay `closePopups`
	 * @property {jQuery.Deferred} closeTimer
	 */
	mw.popups.render.closeTimer = undefined;

	/**
	 * The timer used to delay sending the API request/opening the popup form cache
	 * @property {jQuery.Deferred} openTimer
	 */
	mw.popups.render.openTimer = undefined;

	/**
	 * The link the currently has a popup
	 * @property {jQuery} currentLink
	 */
	mw.popups.render.currentLink = undefined;

	/**
	 * Current API request
	 * @property {jQuery.Deferred} currentRequest
	 */
	mw.popups.render.currentRequest = undefined;

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
	 * @param {Object} link
	 * @param {Object} event
	 */
	mw.popups.render.render = function ( link, event ) {
		// This will happen when the mouse goes from the popup box back to the
		// anchor tag. In such a case, the timer to close the box is cleared.
		if (
			mw.popups.render.currentLink &&
			mw.popups.render.currentLink[ 0 ] === link[ 0 ]
		) {
			if ( mw.popups.render.closeTimer ) {
				mw.popups.render.closeTimer.abort();
			}
			return;
		}

		// If the mouse moves to another link (we already check if its the same
		// link in the previous condition), then close the popup.
		if ( mw.popups.render.currentLink ) {
			mw.popups.render.closePopup();
		}

		// Ignore if its meant to call a function
		// TODO: Remove this when adding reference popups
		if ( link.attr( 'href' ) === '#' ) {
			return;
		}

		// Disable Navigration Popups
		mw.popups.disableNavPopup();

		mw.popups.render.currentLink = link;
		link.on( 'mouseleave blur', mw.popups.render.leaveInactive );

		if ( mw.popups.render.cache[ link.attr( 'href' ) ] ) {
			mw.popups.render.openTimer = mw.popups.render.wait( mw.popups.render.POPUP_DELAY )
				.done( function () {
					mw.popups.render.openPopup( link, event );
				} );
		} else {
			// Wait for timer before making API queries and showing hovercard
			mw.popups.render.openTimer = mw.popups.render.wait( mw.popups.render.API_DELAY )
				.done( function () {
					var cachePopup, key,
						renderers = mw.popups.render.renderers;

					// Check run the matcher method of all renderers to find the right one
					for ( key in renderers ) {
						if ( renderers.hasOwnProperty( key ) && key !== 'article' ) {
							if ( !!renderers[ key ].matcher( link.attr( 'href' ) ) ) {
								cachePopup = renderers[ key ].init( link );
							}
						}
					}

					// Use the article renderer if nothing else matches
					if ( cachePopup === undefined ) {
						cachePopup = mw.popups.render.renderers.article.init( link );
					}

					mw.popups.render.openTimer = mw.popups.render.wait( mw.popups.render.POPUP_DELAY - mw.popups.render.API_DELAY );

					$.when( mw.popups.render.openTimer, cachePopup ).done( function () {
						mw.popups.render.openPopup( link, event );
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
			.append( popup )
			.show()
			.attr( 'aria-hidden', 'false' )
			.on( 'mouseleave', mw.popups.render.leaveActive )
			.on( 'mouseenter', function () {
				if ( mw.popups.render.closeTimer ) {
					mw.popups.render.closeTimer.abort();
				}
			} );

		// Hack to 'refresh' the SVG and thus display it
		// Elements get added to the DOM and not to the screen because of different namespaces of HTML and SVG
		// More information and workarounds here - http://stackoverflow.com/a/13654655/366138
		mw.popups.$popup.html( mw.popups.$popup.html() );

		cache.process( link );

		// Event logging
		if ( mw.popups.logger ) {
			mw.popups.render.logEvent = {
				pageTitleHover: cache.settings.title,
				pageTitleSource: mw.config.get( 'wgTitle' ),
				popupEnabled: mw.popups.enabled,
				time: mw.now(),
				action: 'dismissed'
			};
			mw.popups.$popup.find( 'a.mwe-popups-extract, a.mwe-popups-discreet' ).click( mw.popups.render.clickHandler );
		}

		link
			.off( 'mouseleave blur', mw.popups.render.leaveInactive )
			.on( 'mouseleave blur', mw.popups.render.leaveActive );

		$( document ).on( 'keydown', mw.popups.render.closeOnEsc );
	};

	/**
	 * Click handler for the hovercard
	 *
	 * @method clickHandler
	 * @param {Object} event
	 */
	mw.popups.render.clickHandler = function ( event ) {
		mw.popups.render.logEvent.action = mw.popups.logger.getAction( event );
		if ( mw.popups.render.logEvent.action === 'opened in same tab' ) {
			event.preventDefault();
			mw.popups.logger.log( mw.popups.render.logEvent ).then( function () {
				window.location.href = mw.popups.render.currentLink.attr( 'href' );
			} );
		}
	};

	/**
	 * Removes the hover class from the link and unbinds events
	 * Hides the popup, clears timers and sets it and the resets the renderer
	 *
	 * @method closePopup
	 */
	mw.popups.render.closePopup = function () {
		var fadeInClass, fadeOutClass;

		if ( mw.popups.render.currentLink === undefined ) {
			return false;
		}

		// Event logging
		if ( mw.popups.logger ) {
			mw.popups.logger.log( mw.popups.render.logEvent );
		}

		$( mw.popups.render.currentLink ).off( 'mouseleave blur', mw.popups.render.leaveActive );

		fadeInClass = ( mw.popups.$popup.hasClass( 'mwe-popups-fade-in-up' ) ) ?
			'mwe-popups-fade-in-up' :
			'mwe-popups-fade-in-down';

		fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
			'mwe-popups-fade-out-down' :
			'mwe-popups-fade-out-up';

		mw.popups.$popup
			.off( 'mouseleave', mw.popups.render.leaveActive )
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

		if ( mw.popups.render.closeTimer ) {
			mw.popups.render.closeTimer.abort();
		}

		$( document ).off( 'keydown', mw.popups.render.closeOnEsc );
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
	 */
	mw.popups.render.closeOnEsc = function ( event ) {
		if ( event.keyCode === 27 ) {
			mw.popups.render.closePopup();
		}
	};

	/**
	 * Closes the box after a delay
	 * Delay to give enough time for the user to move the pointer from
	 * the link to the popup box. Also avoids closing the popup by accident
	 *
	 * @method leaveActive
	 */
	mw.popups.render.leaveActive = function () {
		mw.popups.render.closeTimer = mw.popups.render.wait( mw.popups.render.POPUP_CLOSE_DELAY ).done( function () {
			mw.popups.render.closePopup();
		} );
	};

	/**
	 * Unbinds events on the anchor tag and aborts AJAX request.
	 *
	 * @method leaveInactive
	 */
	mw.popups.render.leaveInactive = function () {
		$( mw.popups.render.currentLink ).off( 'mouseleave', mw.popups.render.leaveInactive );
		if ( mw.popups.render.openTimer ) {
			mw.popups.render.openTimer.abort();
		}
		if ( mw.popups.render.currentRequest ) {
			mw.popups.render.currentRequest.abort();
		}

		mw.popups.render.reset();
	};

	/**
	 * Resets the renderer
	 *
	 * @method reset
	 */
	mw.popups.render.reset = function () {
		mw.popups.render.currentLink = undefined;
		mw.popups.render.currentRequest = undefined;
		mw.popups.render.openTimer = undefined;
		mw.popups.render.closeTimer = undefined;
	};

} )( jQuery, mediaWiki );
