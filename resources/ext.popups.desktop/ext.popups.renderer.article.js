( function ( $, mw ) {
	'use strict';

	/**
	 * @class mw.popups.render.article
	 * @singleton
	 */
	var currentRequest,
		isSafari = navigator.userAgent.match( /Safari/ ) !== null,
		article = {},
		surveyLink = mw.config.get( 'wgPopupsSurveyLink' ),
		$window = $( window ),
		CHARS = 525,
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
			portraitPopupWidth: 300, // Exact width of a portrait popup
			pokeySize: 8 // Height of the triangle used to point at the link
		};

	/**
	 * Send an API request and cache the jQuery element
	 *
	 * @param {jQuery} link
	 * @param {Object} logData data to be logged
	 * @return {jQuery.Promise}
	 */
	article.init = function ( link, logData ) {
		var href = link.attr( 'href' ),
			title = mw.popups.getTitle( href ),
			deferred = $.Deferred(),
			scaledThumbSize = 300 * $.bracketedDevicePixelRatio();

		if ( !title ) {
			return deferred.reject().promise();
		}

		currentRequest = mw.popups.api.get( {
			action: 'query',
			prop: 'info|extracts|pageimages|revisions',
			formatversion: 2,
			redirects: true,
			exintro: true,
			exchars: CHARS,
			// there is an added geometric limit on .mwe-popups-extract
			// so that text does not overflow from the card
			explaintext: true,
			piprop: 'thumbnail',
			pithumbsize: scaledThumbSize,
			rvprop: 'timestamp',
			titles: title,
			smaxage: 300,
			maxage: 300,
			uselang: 'content'
		}, {
			headers: {
				'X-Analytics': 'preview=1'
			}
		} );

		currentRequest.fail( function ( textStatus, data ) {
			// only log genuine errors, not client aborts
			if ( data.textStatus !== 'abort' ) {
				mw.track( 'ext.popups.event', $.extend( logData, {
					action: 'error',
					errorState: textStatus,
					totalInteractionTime: Math.round( mw.now() - logData.dwellStartTime )
				} ) );
			}
			deferred.reject();
		} )
		.done( function ( re ) {
			currentRequest = undefined;

			if (
				!re.query ||
				!re.query.pages ||
				!re.query.pages[ 0 ].extract ||
				re.query.pages[ 0 ].extract === ''
			) {
				// Restore the title attribute and set flag
				if ( link.data( 'dont-empty-title' ) !== true ) {
					link
						.attr( 'title', link.data( 'title' ) )
						.removeData( 'title' )
						.data( 'dont-empty-title', true );
				}
				deferred.reject();
				return;
			}

			re.query.pages[ 0 ].extract = removeEllipsis( re.query.pages[ 0 ].extract );

			mw.popups.render.cache[ href ] = {};
			mw.popups.render.cache[ href ].popup = article.createPopup( re.query.pages[ 0 ], href );
			mw.popups.render.cache[ href ].getOffset = article.getOffset;
			mw.popups.render.cache[ href ].getClasses = article.getClasses;
			mw.popups.render.cache[ href ].process = article.processPopup;
			deferred.resolve();
		} );

		return deferred.promise();
	};

	/**
	 * Returns a thumbnail object based on the ratio of the image
	 * Uses an SVG image where available to add the triangle/pokey
	 * mask on the image. Crops and resizes the SVG image so that
	 * is fits inside a rectangle of a particular size.
	 *
	 * @method createPopup
	 * @param {Object} page Information about the linked page
	 * @param {string} href
	 * @return {jQuery}
	 */
	article.createPopup = function ( page, href ) {
		var $div, hasThumbnail,
			thumbnail = page.thumbnail,
			tall = thumbnail && thumbnail.height > thumbnail.width,
			$thumbnail = article.createThumbnail( thumbnail, tall ),
			timestamp = new Date( page.revisions[ 0 ].timestamp ),
			timediff = new Date() - timestamp,
			oneDay = 1000 * 60 * 60 * 24;

		// createThumbnail returns an empty <span> if there is no thumbnail
		hasThumbnail = $thumbnail.prop( 'tagName' ) !== 'SPAN';

		$div = mw.template.get( 'ext.popups.desktop', 'popup.mustache' ).render( {
			langcode: page.pagelanguagehtmlcode,
			langdir: page.pagelanguagedir,
			href: href,
			isRecent: timediff < oneDay,
			lastModified: mw.message( 'popups-last-edited', moment( timestamp ).fromNow() ).text(),
			hasThumbnail: hasThumbnail
		} );

		// FIXME: Ideally these things should be added in template. These will be refactored in future patches.
		if ( !hasThumbnail ) {
			tall = thumbnail = undefined;
		} else {
			$div.find( '.mwe-popups-discreet' ).append( $thumbnail );
		}
		$div.find( '.mwe-popups-extract' )
			.append( article.getProcessedElements( page.extract, page.title ) );
		if ( surveyLink ) {
			$div.find( 'footer' ).append( article.createSurveyLink( surveyLink ) );
		}

		mw.popups.render.cache[ href ].settings = {
			title: page.title,
			namespace: page.ns,
			tall: ( tall === undefined ) ? false : tall,
			thumbnail: ( thumbnail === undefined ) ? false : thumbnail
		};

		return $div;
	};

	/**
	 * Creates a link to a survey, possibly hosted on an external site.
	 *
	 * @param {string} url
	 * @return {jQuery}
	 */
	article.createSurveyLink = function ( url ) {
		if ( !/https?:\/\//.test( url ) ) {
			throw new Error(
				'The survey link URL, i.e. PopupsSurveyLink, must start with https or http.'
			);
		}

		return $( '<a>' )
			.attr( 'href', url )
			.attr( 'target', '_blank' )
			.attr( 'title', mw.message( 'popups-send-feedback' ) )

			// Don't leak referrer information or `window.opener` to the survey hosting site. See
			// https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer for more
			// information.
			.attr( 'rel', 'noreferrer' )

			.addClass( 'mwe-popups-icon mwe-popups-survey-icon' );
	};

	/**
	 * Returns an array of elements to be appended after removing parentheses
	 * and making the title in the extract bold.
	 *
	 * @method getProcessedElements
	 * @param {string} extract Should be unescaped
	 * @param {string} title Should be unescaped
	 * @return {Array} of elements to appended
	 */
	article.getProcessedElements = function ( extract, title ) {
		var regExp, escapedTitle,
			elements = [],
			boldIdentifier = '<bi-' + Math.random() + '>',
			snip = '<snip-' + Math.random() + '>';

		title = article.removeParensFromText( title );
		title = title.replace( /\s+/g, ' ' ).trim(); // Remove extra white spaces
		escapedTitle = mw.RegExp.escape( title ); // Escape RegExp elements
		regExp = new RegExp( '(^|\\s)(' + escapedTitle + ')(|$)', 'i' );

		// Remove text in parentheses along with the parentheses
		extract = article.removeParensFromText( extract );
		extract = extract.replace( /\s+/, ' ' ); // Remove extra white spaces

		// Make title bold in the extract text
		// As the extract is html escaped there can be no such string in it
		// Also, the title is escaped of RegExp elements thus can't have "*"
		extract = extract.replace( regExp, '$1' + snip + boldIdentifier + '$2' + snip + '$3' );
		extract = extract.split( snip );

		$.each( extract, function ( index, part ) {
			if ( part.indexOf( boldIdentifier ) === 0 ) {
				elements.push( $( '<b>' ).text( part.substring( boldIdentifier.length ) ) );
			} else {
				elements.push( document.createTextNode( part ) );
			}
		} );

		return elements;
	};

	/**
	 * Removes content in parentheses from a string.  Returns the original
	 * string as is if the parentheses are unbalanced or out or order. Does not
	 * remove extra spaces.
	 *
	 * @method removeParensFromText
	 * @param {string} string
	 * @return {string}
	 */
	article.removeParensFromText = function ( string ) {
		var
			ch,
			newString = '',
			level = 0,
			i = 0;

		for ( i; i < string.length; i++ ) {
			ch = string.charAt( i );

			if ( ch === ')' && level === 0  ) {
				return string;
			}
			if ( ch === '(' ) {
				level++;
				continue;
			} else if ( ch === ')' ) {
				level--;
				continue;
			}
			if ( level === 0 ) {
				// Remove leading spaces before brackets
				if ( ch === ' ' && string.charAt( i + 1 ) === '(' ) {
					continue;
				}
				newString += ch;
			}
		}

		return ( level === 0 ) ? newString : string;
	};

	/**
	 * Use createElementNS to create the svg:image tag as jQuery
	 * uses createElement instead. Some browsers map the `image` tag
	 * to `img` tag, thus an `svg:image` is required.
	 *
	 * @method createSVGTag
	 * @param {string} tag
	 * @return {Object}
	 */
	article.createSVGTag = function ( tag ) {
		return document.createElementNS( 'http://www.w3.org/2000/svg', tag );
	};

	/**
	 * Returns a thumbnail object based on the ratio of the image
	 * Uses an SVG image where available to add the triangle/pokey
	 * mask on the image. Crops and resizes the SVG image so that
	 * is fits inside a rectangle of a particular size.
	 *
	 * @method createThumbnail
	 * @param {Object} thumbnail
	 * @param {boolean} tall
	 * @return {Object} jQuery DOM element of the thumbnail
	 */
	article.createThumbnail = function ( thumbnail, tall ) {
		var thumbWidth, thumbHeight,
			x, y, width, height, clipPath,
			devicePixelRatio = $.bracketedDevicePixelRatio();

		// No thumbnail
		if ( !thumbnail ) {
			return $( '<span>' );
		}

		thumbWidth = thumbnail.width / devicePixelRatio;
		thumbHeight = thumbnail.height / devicePixelRatio;

		if (
			// Image too small for landscape display
			( !tall && thumbWidth < SIZES.landscapeImage.w ) ||
			// Image too small for portrait display
			( tall && thumbHeight < SIZES.portraitImage.h ) ||
			// These characters in URL that could inject CSS and thus JS
			(
				thumbnail.source.indexOf( '\\' ) > -1 ||
				thumbnail.source.indexOf( '\'' ) > -1 ||
				thumbnail.source.indexOf( '\"' ) > -1
			)
		) {
			return $( '<span>' );
		}

		if ( tall ) {
			x = ( thumbWidth > SIZES.portraitImage.w ) ?
				( ( thumbWidth - SIZES.portraitImage.w ) / -2 ) :
				( SIZES.portraitImage.w - thumbWidth );
			y = ( thumbHeight > SIZES.portraitImage.h ) ?
				( ( thumbHeight - SIZES.portraitImage.h ) / -2 ) : 0;
			width = SIZES.portraitImage.w;
			height = SIZES.portraitImage.h;
		} else {
			x = 0;
			y = ( thumbHeight > SIZES.landscapeImage.h ) ?
				( ( thumbHeight - SIZES.landscapeImage.h ) / -2 ) : 0;
			width = SIZES.landscapeImage.w + 3;
			height = ( thumbHeight > SIZES.landscapeImage.h ) ?
				SIZES.landscapeImage.h : thumbHeight;
			clipPath = 'mwe-popups-mask';
		}
		return article.createSvgImageThumbnail(
			// FIXME: Not clear why this class is always added even if the popup is not tall
			'mwe-popups-is-not-tall',
			thumbnail.source,
			x,
			y,
			thumbWidth,
			thumbHeight,
			width,
			height,
			clipPath
		);
	};

	/**
	 * Returns the `svg:image` object for thumbnail
	 *
	 * @method createSvgImageThumbnail
	 * @param {string} className
	 * @param {string} url
	 * @param {number} x
	 * @param {number} y
	 * @param {number} thumbnailWidth
	 * @param {number} thumbnailHeight
	 * @param {number} width
	 * @param {number} height
	 * @param {string} clipPath
	 * @return {jQuery}
	 */
	article.createSvgImageThumbnail = function (
		className, url, x, y, thumbnailWidth, thumbnailHeight, width, height, clipPath
	) {
		var $thumbnailSVGImage, $thumbnail,
			ns = 'http://www.w3.org/2000/svg',
			svgElement = article.createSVGTag( 'image' );

		$thumbnailSVGImage = $( svgElement );
		$thumbnailSVGImage
			.addClass( className )
			.attr( {
				x: x,
				y: y,
				width: thumbnailWidth,
				height: thumbnailHeight,
				'clip-path': 'url(#' + clipPath + ')'
			} );

		// Make image render in Safari (T138430)
		if ( isSafari ) {
			svgElement.setAttribute( 'xlink:href', url );
		} else {
			// certain browsers e.g. ie9 will not correctly set attributes from foreign namespaces (T134979)
			svgElement.setAttributeNS( ns, 'xlink:href', url );
		}
		$thumbnail = $( '<svg>' )
			.attr( {
				xmlns: ns,
				width: width,
				height: height
			} )
			.append( $thumbnailSVGImage );

		return $thumbnail;
	};

	/**
	 * Positions the popup based on the mouse position and popup size
	 * Default popup positioning is below and to the right of the mouse or link,
	 * unless flippedX or flippedY is true. flippedX and flippedY are cached.
	 *
	 * @method getOffset
	 * @param {jQuery} link
	 * @param {Object} event
	 * @return {Object} This can be passed to `.css()` to position the element
	 */
	article.getOffset = function ( link, event ) {
		var
			href = link.attr( 'href' ),
			flippedX = false,
			flippedY = false,
			settings = mw.popups.render.cache[ href ].settings,
			offsetTop = ( event.pageY ) ? // If it was a mouse event
				// Position according to mouse
				// Since client rectangles are relative to the viewport,
				// take scroll position into account.
				getClosestYPosition(
					event.pageY - $window.scrollTop(),
					link.get( 0 ).getClientRects(),
					false
				) + $window.scrollTop() + SIZES.pokeySize :
				// Position according to link position or size
				link.offset().top + link.height() + SIZES.pokeySize,
			clientTop = ( event.clientY ) ?
				event.clientY :
				offsetTop,
			offsetLeft = ( event.pageX ) ?
				event.pageX :
				link.offset().left;

		// X Flip
		if ( offsetLeft > ( $( window ).width() / 2 ) ) {
			offsetLeft += ( !event.pageX ) ? link.width() : 0;
			offsetLeft -= ( !settings.tall ) ?
				SIZES.portraitPopupWidth :
				SIZES.landscapePopupWidth;
			flippedX = true;
		}

		if ( event.pageX ) {
			offsetLeft += ( flippedX ) ? 20 : -20;
		}

		mw.popups.render.cache[ href ].settings.flippedX = flippedX;

		// Y Flip
		if ( clientTop > ( $( window ).height() / 2 ) ) {
			flippedY = true;

			// Change the Y position to the top of the link
			if ( event.pageY ) {
				// Since client rectangles are relative to the viewport,
				// take scroll position into account.
				offsetTop = getClosestYPosition(
					event.pageY - $window.scrollTop(),
					link.get( 0 ).getClientRects(),
					true
				) + $window.scrollTop() + 2 * SIZES.pokeySize;
			}
		}

		mw.popups.render.cache[ href ].settings.flippedY = flippedY;

		return {
			top: offsetTop + 'px',
			left: offsetLeft + 'px'
		};
	};

	/**
	 * Returns an array of classes based on the size and setting of the popup
	 *
	 * @method getClassses
	 * @param {jQuery} link
	 * @return {Array} List of classes to applied to the parent `div`
	 */
	article.getClasses = function ( link ) {
		var
			classes = [],
			cache = mw.popups.render.cache [ link.attr( 'href' ) ],
			tall = cache.settings.tall,
			thumbnail = cache.settings.thumbnail,
			flippedY = cache.settings.flippedY,
			flippedX = cache.settings.flippedX;

		if ( flippedY ) {
			classes.push( 'mwe-popups-fade-in-down' );
		} else {
			classes.push( 'mwe-popups-fade-in-up' );
		}

		if ( flippedY && flippedX ) {
			classes.push( 'flipped_x_y' );
		}

		if ( flippedY && !flippedX ) {
			classes.push( 'flipped_y' );
		}

		if ( flippedX && !flippedY ) {
			classes.push( 'flipped_x' );
		}

		if ( ( !thumbnail || tall ) && !flippedY ) {
			classes.push( 'mwe-popups-no-image-tri' );
		}

		if ( ( thumbnail && !tall ) && !flippedY ) {
			classes.push( 'mwe-popups-image-tri' );
		}

		if ( tall ) {
			classes.push( 'mwe-popups-is-tall' );
		} else {
			classes.push( 'mwe-popups-is-not-tall' );
		}

		return classes;
	};

	/**
	 * Processed the popup div after it has been displayed
	 * to correctly render the triangle/pokeys
	 *
	 * @method processPopups
	 * @param {jQuery} link
	 * @param {Object} logData data to be logged
	 */
	article.processPopup = function ( link, logData ) {
		var
			cache = mw.popups.render.cache [ link.attr( 'href' ) ],
			popup = mw.popups.$popup,
			tall = cache.settings.tall,
			thumbnail = cache.settings.thumbnail,
			flippedY = cache.settings.flippedY,
			flippedX = cache.settings.flippedX;

		popup.find( '.mwe-popups-settings-icon' ).click( function () {
			delete logData.pageTitleHover;
			delete logData.namespaceIdHover;

			mw.popups.settings.open( $.extend( {}, logData ) );

			mw.track( 'ext.popups.event', $.extend( logData, {
				action: 'tapped settings cog',
				totalInteractionTime: Math.round( mw.now() - logData.dwellStartTime )
			} ) );
		} );

		if ( !flippedY && !tall && cache.settings.thumbnail.height < SIZES.landscapeImage.h ) {
			$( '.mwe-popups-extract' ).css(
				'margin-top',
				cache.settings.thumbnail.height - SIZES.pokeySize
			);
		}

		if ( flippedY ) {
			popup.css( {
				top: popup.offset().top - popup.outerHeight()
			} );
		}

		if ( flippedY && thumbnail ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', '' );
		}

		if ( flippedY && flippedX && thumbnail && tall ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask-flip)' );
		}

		if ( flippedX && !flippedY && thumbnail && !tall ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
		}

		if ( flippedX && !flippedY && thumbnail && tall ) {
			mw.popups.$popup
				.removeClass( 'mwe-popups-no-image-tri' )
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
		}
	};

	mw.popups.render.renderers.article = article;

	/**
	 * Given the rectangular box(es) find the 'y' boundary of the closest
	 * rectangle to the point 'y'. The point 'y' is the location of the mouse
	 * on the 'y' axis and the rectangular box(es) are the borders of the
	 * element over which the mouse is located. There will be more than one
	 * rectangle in case the element spans multiple lines.
	 * In the majority of cases the mouse pointer will be inside a rectangle.
	 * However, some browsers (i.e. Chrome) trigger a hover action even when
	 * the mouse pointer is just outside a bounding rectangle. That's why
	 * we need to look at all rectangles and not just the rectangle that
	 * encloses the point.
	 *
	 * @param {number} y the point for which the closest location is being
	 *  looked for
	 * @param {ClientRectList} rects list of rectangles defined by four edges
	 * @param {boolean} [isTop] should the resulting rectangle's top 'y'
	 *  boundary be returned. By default the bottom 'y' value is returned.
	 * @return {number}
	 */
	function getClosestYPosition( y, rects, isTop ) {
		var result,
			deltaY,
			minY = null;

		$.each( rects, function ( i, rect ) {
			deltaY = Math.abs( y - rect.top + y - rect.bottom );

			if ( minY === null || minY > deltaY ) {
				minY = deltaY;
				// Make sure the resulting point is at or outside the rectangle
				// boundaries.
				result = ( isTop ) ? Math.floor( rect.top ) : Math.ceil( rect.bottom );
			}
		} );

		return result;
	}

	/**
	 * Aborts any pending ajax requests
	 */
	mw.popups.render.abortCurrentRequest = function () {
		if ( currentRequest ) {
			currentRequest.abort();
			currentRequest = undefined;
		}
	};

	/**
	 * Expose for tests
	 */
	mw.popups.render.getClosestYPosition = getClosestYPosition;

	/**
	 * Remove ellipsis if exists at the end
	 */
	function removeEllipsis( text ) {
		return text.replace( /\.\.\.$/, '' );
	}

} )( jQuery, mediaWiki );
