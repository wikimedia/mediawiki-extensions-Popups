/* Code adapted from Yair Rand's NavPopupsRestyled.js
 * https://en.wikipedia.org/wiki/User:Yair_rand/NavPopupsRestyled.js
 */

( function ( $, mw ) {
	$( document ).ready( function () {

		var closeTimer, // The timer use to delay `closeBox`
			openTimer, // The timer used to delay sending the API request/opening the popup form cache
			scrolled = false, // true if user scrolled the page but haven't moved mouse cursor
			elTime, // EL: UNIX timestamp of when the popup was rendered
			elDuration, // EL: How long was the popup open in milliseconds
			elAction, // EL: Was the popup clicked or middle clicked or dismissed
			elSessionId, // EL: Get defined after the getSessionId method is created
			currentLink, // DOM element of the current anchor tag
			cache = {},
			curRequest, // Current API request
			supportsSVG = document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#Image', '1.1' ),
			api = new mw.Api(),
			SIZES = {
				portraitImage: {
					h: 250, // Exact height
					w: 203 // Max width
				},
				landscapeImage: {
					h: 200, // Max height
					w: 300 // Exact Width
				},
				landscapePopupWidth: 450, // Exact width of a landscape popup
				portraitPopupWidth: 300 // Exact width of a portrait popup
			},
			$svg, $box; // defined at the end of the file

		/**
		 * Return a promise corresponding to a `setTimeout()` call. Call `.abort()` on the return value
		 * to perform the equivalent of `clearTimeout()`.
		 *
		 * @param {number} ms Milliseconds to wait
		 * @return {jQuery.Promise}
		 */
		function timeoutPromise( ms ) {
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
		}

		/**
		 * @method sendRequest
		 * Send an API request, create DOM elements and
		 * put them in the cache. Returns a promise.
		 * @param {String} href
		 * @param {String} title
		 * @return {jQuery.Promise}
		 */
		function sendRequest( href, title ) {
			var deferred = $.Deferred();

			curRequest = api.get( {
				action: 'query',
				prop: 'extracts|pageimages|revisions|info',
				redirects: 'true',
				exintro: 'true',
				exsentences: 2,
				// there is an added geometric limit on .mwe-popups-extract
				// so that text does not overflow from the card
				explaintext: 'true',
				piprop: 'thumbnail',
				pithumbsize: 300,
				rvprop: 'timestamp',
				inprop: 'watched',
				indexpageids: true,
				titles: title
			} );

			curRequest.done( function ( re ) {
				curRequest = undefined;

				var $a,
					page = re.query.pages[ re.query.pageids[ 0 ] ],
					$contentbox = $( '<div>' )
						.addClass( 'mwe-popups-extract' )
						.text( page.extract ),
					thumbnail = page.thumbnail,
					tall = thumbnail && thumbnail.height > thumbnail.width,
					$thumbnail = createThumbnail( thumbnail, tall ),
					timestamp = new Date( page.revisions[ 0 ].timestamp ),
					timediff = new Date() - timestamp,
					oneDay = 1000 * 60 * 60 * 24,
					timestampclass = ( timediff < oneDay ) ?
						'mwe-popups-timestamp-recent' :
						'mwe-popups-timestamp-older',
					$timestamp = $( '<div>' )
						.addClass( timestampclass )
						.append(
							$( '<span>' ).text( mw.message( 'popups-last-edited',
								moment( timestamp ).fromNow() ).text() )
					);

				$a = $( '<a>' )
					.append( $thumbnail, $contentbox, $timestamp )
					.attr( 'href', href )
					.on( 'click', logClick );

				cache[ href ] = {
					box: $a,
					thumbnail: thumbnail,
					tall: tall
				};

				deferred.resolve();
			} );

			return deferred.promise();
		}

		/**
		 * @method createSVGTag
		 * Use createElementNS to create the svg:image tag as jQuery
		 * uses createElement instead. Some browsers map the `image` tag
		 * to `img` tag, thus an `svg:image` is required.
		 * @param {String} tag
		 * @return {Object}
		 */
		function createSVGTag( tag ) {
			return document.createElementNS( 'http://www.w3.org/2000/svg', tag );
		}

		/**
		 * @method createThumbnail
		 * Returns a thumbnail object based on the ratio of the image
		 * Uses an SVG image where available to add the triangle/pokey
		 * mask on the image. Crops and resizes the SVG image so that
		 * is fits inside a rectangle of a particular size.
		 * @param {Object} thumbnail
		 * @param {boolean} tall
		 * @return {Object} jQuery DOM element of the thumbnail
		 */
		function createThumbnail( thumbnail, tall ) {
			if ( !thumbnail ) {
				return $( '<span>' );
			}

			var $thumbnailSVGImage, $thumbnail;

			if ( tall ) {
				if ( supportsSVG ) {
					$thumbnailSVGImage = $( createSVGTag( 'image' ) );
					$thumbnailSVGImage
						.addClass( 'mwe-popups-is-not-tall' )
						.attr( {
							'xlink:href': thumbnail.source,
							x: ( thumbnail.width > SIZES.portraitImage.w ) ?
								( ( thumbnail.width - SIZES.portraitImage.w ) / -2 ) :
								( SIZES.portraitImage.w - thumbnail.width ),
							y: ( thumbnail.height > SIZES.portraitImage.h ) ?
								( ( thumbnail.height - SIZES.portraitImage.h ) / -2 ) :
								0,
							width: thumbnail.width,
							height: thumbnail.height
						} );

					$thumbnail = $( '<svg>' )
						.attr( {
							xmlns: 'http://www.w3.org/2000/svg',
							width: SIZES.portraitImage.w,
							height: SIZES.portraitImage.h
						} )
						.append( $thumbnailSVGImage );
				} else {
					$thumbnail = $( '<div>' )
						.addClass( 'mwe-popups-is-tall' )
						.css( 'background-image', 'url(' + thumbnail.source + ')' );
				}
			} else {
				if ( supportsSVG ) {
					$thumbnailSVGImage = $( createSVGTag( 'image' ) );
					$thumbnailSVGImage
						.addClass( 'mwe-popups-is-not-tall' )
						.attr( {
							'xlink:href': thumbnail.source,
							'clip-path': 'url(#mwe-popups-mask)',
							x: 0,
							y: ( thumbnail.height > SIZES.landscapeImage.h ) ?
								( ( thumbnail.height - SIZES.landscapeImage.h ) / -2 ) :
								0,
							width: thumbnail.width,
							height: thumbnail.height
						} );

					$thumbnail = $( '<svg>' )
						.attr( {
							xmlns: 'http://www.w3.org/2000/svg',
							width: SIZES.landscapeImage.w + 3,
							height: ( thumbnail.height > SIZES.landscapeImage.h ) ?
								SIZES.landscapeImage.h :
								thumbnail.height
						} )
						.append( $thumbnailSVGImage );
				} else {
					$thumbnail = $( '<div>' )
						.addClass( 'mwe-popups-is-not-tall' )
						.css( 'background-image', 'url(' + thumbnail.source + ')' );
				}
			}

			return $thumbnail;
		}

		/**
		 * @method createBox
		 * Looks into the `cache` and uses the href to render the popup
		 * and offsets it to the link. Rebinds the `mouseleave` event
		 * for the anchor element to `leaveActive`.
		 * @param {String} href
		 * @param {Object} $el
		 * @param {Object} event
		 */
		function createBox( href, $el, event ) {
			var
				bar = cache[ href ],
				offsetTop = ( event.pageY ) ?
					event.pageY + 20 :
					$el.offset().top + $el.height() + 9,
				offsetLeft = ( event.pageX ) ?
					event.pageX :
					$el.offset().left,
				flipped = false;

			elTime = mw.now();
			elAction = 'dismissed';

			if ( bar.thumbnail === undefined ) {
				bar.thumbnail = false;
			}

			if ( bar.tall === undefined ) {
				bar.tall = false;
			}

			if ( offsetLeft > ( $( window ).width() / 2 ) ) {
				offsetLeft += ( !event.pageX ) ? $el.width() : 0;
				offsetLeft -= ( !bar.tall ) ? SIZES.portraitPopupWidth : SIZES.landscapePopupWidth;
				flipped = true;
			}

			if ( event.pageX ) {
				offsetLeft += ( flipped ) ? 20 : -20; // compensating the position of the triangle
			}

			$box
				.children()
				.detach()
				// avoid .empty() to keep event handlers
				.end()
				.removeClass( 'mwe-popups-is-tall mwe-popups-is-not-tall mwe-popups-no-image-tri mwe-popups-image-tri flipped' )
				.toggleClass( 'flipped', flipped )
				// Add border triangle if there is no image or its landscape
				.toggleClass( 'mwe-popups-no-image-tri', ( !bar.thumbnail || bar.tall ) )
				// If theres an image and the popup is portrait do the SVG stuff
				.toggleClass( 'mwe-popups-image-tri', ( bar.thumbnail && !bar.tall ) )
				.addClass( bar.tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall' )
				.css( {
					top: offsetTop,
					left: offsetLeft
				} )
				.append( bar.box )
				.attr( 'aria-hidden', 'false' )
				.show()
				.removeClass( 'mwe-popups-fade-out mwe-popups-fade-in' )
				.addClass( 'mwe-popups-fade-in' )
				// Hack to 'refresh' the SVG and thus display it
				// Elements get added to the DOM and not to the screen because of different namespaces of HTML and SVG
				// More information and workarounds here - http://stackoverflow.com/a/13654655/366138
				.html( $box.html() );

			if ( flipped && bar.thumbnail ) {
				if ( !bar.tall ) {
					$box.find( 'image' )[ 0 ].setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
				} else {
					$box
						.removeClass( 'mwe-popups-no-image-tri' )
						.find( 'image' )[ 0 ].setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
				}
			}

			$el
				.off( 'mouseleave blur', leaveInactive )
				.on( 'mouseleave blur', leaveActive );

			$( document ).on( 'keydown', closeOnEsc );
		}

		/**
		 * @method closeOnEsc
		 * Use escape to close popup
		 */
		function closeOnEsc( e ) {
			if ( e.keyCode === 27 ) {
				closeBox();
			}
		}

		/**
		 * @method leaveActive
		 * Closes the box after a delay of 100ms
		 * Delay to give enough time for the use to move the pointer from
		 * the link to the popup box. Also avoids closing the popup by accident.
		 */
		function leaveActive() {
			closeTimer = setTimeout( closeBox, 100 );
		}

		/**
		 * @method leaveInactive
		 * Unbinds events on the anchor tag and aborts AJAX request.
		 */
		function leaveInactive() {
			$( currentLink ).off( 'mouseleave', leaveInactive );
			if ( openTimer ) {
				openTimer.abort();
			}
			if ( curRequest ) {
				curRequest.abort();
			}
			currentLink = openTimer = curRequest = undefined;
		}

		/**
		 * @method closeBox
		 * Removes the hover class from the link and unbinds events
		 * Hides the popup, clears timers and sets it and the
		 * `currentLink` to undefined.
		 */
		function closeBox() {
			elDuration = mw.now() - elTime;

			$( currentLink ).removeClass( 'mwe-popups-anchor-hover' ).off( 'mouseleave', leaveActive );

			$box
				.removeClass( 'mwe-popups-fade-out mwe-popups-fade-in' )
				.addClass( 'mwe-popups-fade-out' )
				.on( 'webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
					if ( $( this ).hasClass( 'mwe-popups-fade-out' ) ) {
						$( this )
							.off( 'webkitAnimationEnd oanimationend msAnimationEnd animationend' )
							.removeClass( 'mwe-popups-fade-out' )
							.attr( 'aria-hidden', 'true' )
							.hide();
					}
				} );

			if ( closeTimer ) {
				clearTimeout( closeTimer );
			}

			$( document ).off( 'keydown', closeOnEsc );

			logEvent();
			currentLink = closeTimer = undefined;
		}

		/**
		 * @method logClick
		 * Logs different actions such as meta and shift click on the popup.
		 * Is bound to the `click` event.
		 * @param {Object} e
		 */
		function logClick( e ) {
			if ( e.which === 2 ) { // middle click
				elAction = 'opened in new tab';
			} else if ( e.which === 1 ) {
				if ( e.ctrlKey || e.metaKey ) {
					elAction = 'opened in new tab';
				} else if ( e.shiftKey ) {
					elAction = 'opened in new window';
				} else {
					elAction = 'opened in same tab';
					elDuration = mw.now() - elTime;
					logEvent( this.href );
					e.preventDefault();
				}
			}
		}

		/**
		 * @method logEvent
		 * Logs the Popup event as defined in the following schema -
		 * https://meta.wikimedia.org/wiki/Schema:Popups
		 * If `href` is passed it redirects to that location after the event is logged.
		 * @param {string} href
		 */
		function logEvent( href ) {
			if ( typeof mw.eventLog !== 'function' ) {
				return false;
			}

			var dfd = $.Deferred(),
				event = {
					duration: Math.round( elDuration ),
					action: elAction
				};

			if ( elSessionId !== null ) {
				event.sessionId = elSessionId;
			}

			if ( href ) {
				dfd.always( function () {
					location.href = href;
				} );
			}

			mw.eventLog.logEvent( 'Popups', event ).then( dfd.resolve, dfd.reject );
			setTimeout( dfd.reject, 1000 );
			elTime = elDuration = elAction = undefined;
		}

		/**
		 * @method getSessionId
		 * Generates a unique sessionId or pulls an existing one from localStorage
		 * @return {string} sessionId
		 */
		function getSessionId() {
			var sessionId = null;
			try {
				sessionId = localStorage.getItem( 'popupsSessionId' );
				if ( sessionId === null ) {
					sessionId = mw.user.generateRandomSessionId();
					localStorage.setItem( 'popupsSessionId', sessionId );
				}
			} catch ( e ) {}
			return sessionId;
		}
		elSessionId = getSessionId();

		// Prevent popups from showing up when the mouse cursor accidentally
		// ends up hovering a link after scrolling
		$( window ).on( 'scroll', function () {
			scrolled = true;
		} );
		$( window ).on( 'mousemove', function () {
			scrolled = false;
		} );

		// Remove title attribute to remove the default yellow tooltip
		// Put the title back after the hover
		$( '#mw-content-text a:not(.extiw):not(.image):not(.new):not(.internal):not([title=""])' )
			.on( 'mouseenter focus', function () {
				$( this )
					.attr( 'data-original-title', $( this ).attr( 'title' ) )
					.attr( 'title', '' );
			} )
			.on( 'mouseleave blur', function () {
				$( this )
					.attr( 'title', $( this ).attr( 'data-original-title' ) )
					.attr( 'data-original-title', '' );
			} );

		$( '#mw-content-text a' ).on( 'mouseenter focus', function ( event ) {
			var $this = $( this ),
				href = $this.attr( 'href' ),
				title = $this.attr( 'data-original-title' );

			// If a popup for the following link can't be shown
			if (
				scrolled ||
				!title ||
				$this.hasClass( 'extiw' ) ||
				$this.hasClass( 'image' ) ||
				$this.hasClass( 'new' ) ||
				$this.hasClass( 'internal' ) ||
				href.indexOf( '?' ) !== -1 ||
				href.indexOf( location.origin + location.pathname + '#' ) === 0
			) {
				return;
			}

			// This will happen when the mouse goes from the popup box back to the
			// anchor tag. In such a case, the timer to close the box is cleared.
			if ( currentLink === this ) {
				clearTimeout( closeTimer );
				return;
			}

			// If the mouse moves to another link (we already check if its the same
			// link in the previous condition), then close the popup.
			if ( currentLink ) {
				closeBox();
			}

			currentLink = this;
			$this.on( 'mouseleave blur', leaveInactive );

			// Delay to avoid triggering the popup and AJAX requests on accidental
			// hovers (likes ones during srcolling or moving the pointer elsewhere).
			if ( cache[ href ] ) {
				// If we have this popup cached, just wait 150ms
				openTimer = timeoutPromise( 150 ).done( function () {
					createBox( href, $this, event );
				} );
			} else {
				// Otherwise wait 50ms to start loading the data (to avoid unnecessary requests),
				// then further 100ms before actually displaying the output
				openTimer = timeoutPromise( 50 ).done( function () {
					openTimer = timeoutPromise( 100 );
					$.when(
						sendRequest( href, title ),
						openTimer
					).done( function () {
						// Data is cached now
						createBox( href, $this, event );
					} );
				} );
			}
		} );

		// Container for the popup
		$box = $( '<div>' )
			.attr( 'role', 'tooltip' )
			.addClass( 'mwe-popups' )
			.on( {
				mouseleave: leaveActive,
				mouseenter: function () {
					if ( closeTimer ) {
						clearTimeout( closeTimer );
					}
				}
			} )
			.appendTo( document.body );

		// SVG for masking and creating the triangle/pokey
		if ( supportsSVG ) {
			$svg = $( '<div>' )
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
						'</defs>' +
					'</svg>'
				);
		}

	} );

}( jQuery, mediaWiki ) );
