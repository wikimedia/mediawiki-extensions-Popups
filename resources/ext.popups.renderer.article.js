( function ( $, mw ) {
	'use strict';

	/**
	 * @class mw.popups.render.article
	 * @singleton
	 */
	var article = {};

	/**
	 * Size constants for popup images
	 * @property SIZES
	 */
	article.SIZES = {
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
	};

	/**
	 * Send an API request and cache the jQuery element
	 *
	 * @param {jQuery} link
	 * @return {jQuery.Promise}
	 */
	article.init = function ( link ) {
		var
			href = link.attr( 'href' ),
			title = link.data( 'title' ),
			deferred = $.Deferred();

		if ( !title ) {
			return deferred.reject().promise();
		}

		mw.popups.render.currentRequest = mw.popups.api.get( {
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

		mw.popups.render.currentRequest.fail( deferred.reject );
		mw.popups.render.currentRequest.done( function ( re ) {
			mw.popups.render.currentRequest = undefined;

			if (
				!re.query ||
				!re.query.pages ||
				!re.query.pages[ re.query.pageids[ 0 ] ].extract ||
				re.query.pages[ re.query.pageids[ 0 ] ].extract === ''
			) {
				deferred.reject();
				return;
			}

			mw.popups.render.cache[ href ] = {};
			mw.popups.render.cache[ href ].popup = article.createPopup( re, href );
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
	 * @param {Object} re
	 * @param {String} href
	 * @return {jQuery}
	 */
	article.createPopup = function ( re, href ) {
		var $div,
			page = re.query.pages[ re.query.pageids[ 0 ] ],
			$contentbox = $( '<a>' )
				.attr( 'href', href )
				.addClass( 'mwe-popups-extract' )
				.html(
					article.getProcessedHtml( page.extract, page.title )
				),
			thumbnail = page.thumbnail,
			tall = thumbnail && thumbnail.height > thumbnail.width,
			$thumbnail = article.createThumbnail( thumbnail, tall ),
			timestamp = new Date( page.revisions[ 0 ].timestamp ),
			timediff = new Date() - timestamp,
			oneDay = 1000 * 60 * 60 * 24,
			timestampclass = ( timediff < oneDay ) ?
				'mwe-popups-timestamp-recent' :
				'mwe-popups-timestamp-older',
			$settingsImage = $( '<a>' ).addClass( 'mwe-popups-settings-icon' ),
			$timestamp = $( '<div>' )
				.addClass( timestampclass )
				.append(
					$( '<span>' ).text( mw.message( 'popups-last-edited',
						moment( timestamp ).fromNow() ).text() ),
					$settingsImage
			);

		if ( $thumbnail.prop( 'tagName' ) !== 'SPAN' ) {
			$thumbnail = $( '<a>' )
				.addClass( 'mwe-popups-discreet' )
				.attr( 'href', href )
				.append( $thumbnail );
		}

		$div = $( '<div>' ).append( $thumbnail, $contentbox, $timestamp );

		mw.popups.render.cache[ href ].settings = {
			'tall': ( tall === undefined ) ? false : tall,
			'thumbnail': ( thumbnail === undefined ) ? false : thumbnail
		};

		return $div;
	};

	/**
	 * Returns HTML extract after removing parentheses and making the title in
	 * the extract bold.
	 *
	 * @method getProcessedHtml
	 * @param {String} extract
	 * @param {String} title
	 * @return {String}
	 */
	article.getProcessedHtml = function ( extract, title ) {
		title = title.replace( /([.?*+^$[\]\\(){}|-])/g, '\\$1' ); // Escape RegExp elements
		var regExp = new RegExp( '(^|\\s)(' + title + ')(\\s|$)', 'ig' );
		// Make title bold in the extract text
		extract = extract.replace( regExp, '$1<b>$2</b>$3' );
		// Remove text in parentheses along with the parentheses
		extract = article.removeParensFromText( extract );
		extract = extract.replace(/\s+/g, ' '); // Remove extra white spaces
		return extract;
	};

	/**
	 * Removes content in parentheses from a string.  Returns the original
	 * string as is if the parentheses are unbalanced or out or order. Does not
	 * remove extra spaces.
	 *
	 * @method removeParensFromText
	 * @param {String} string
	 * @return {String}
	 */
	article.removeParensFromText = function ( string ) {
		var
			ch,
			newString = '',
			level = 0,
			i = 0;

		for( i; i < string.length; i++ ) {
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
	 * @param {String} tag
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
		var svg = mw.popups.supportsSVG;

		if ( !thumbnail ) {
			return $( '<span>' );
		}

		if ( tall && svg ) {
			return article.createSvgImageThumbnail(
				'mwe-popups-is-not-tall',
				thumbnail.source,
				( thumbnail.width > article.SIZES.portraitImage.w ) ?
						( ( thumbnail.width - article.SIZES.portraitImage.w ) / -2 ) :
						( article.SIZES.portraitImage.w - thumbnail.width ),
				( thumbnail.height > article.SIZES.portraitImage.h ) ?
						( ( thumbnail.height - article.SIZES.portraitImage.h ) / -2 ) :
						0,
				thumbnail.width,
				thumbnail.height,
				article.SIZES.portraitImage.w,
				article.SIZES.portraitImage.h
			);
		}

		if ( tall && !svg ) {
			return article.createImgThumbnail( 'mwe-popups-is-tall', thumbnail.source );
		}

		if ( !tall && svg ) {
			return article.createSvgImageThumbnail(
				'mwe-popups-is-not-tall',
				thumbnail.source,
				0,
				( thumbnail.height > article.SIZES.landscapeImage.h ) ?
						( ( thumbnail.height - article.SIZES.landscapeImage.h ) / -2 ) :
						0,
				thumbnail.width,
				thumbnail.height,
				article.SIZES.landscapeImage.w + 3,
				( thumbnail.height > article.SIZES.landscapeImage.h ) ?
						article.SIZES.landscapeImage.h :
						thumbnail.height,
				'mwe-popups-mask'
			);
		}

		if ( !tall && !svg ) {
			return article.createImgThumbnail( 'mwe-popups-is-not-tall', thumbnail.source );
		}
	};

	/**
	 * Returns the `svg:image` object for thumbnail
	 *
	 * @method createSvgImageThumbnail
	 * @param {String} className
	 * @param {String} url
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} thumbnailWidth
	 * @param {Number} thumbnailHeight
	 * @param {Number} width
	 * @param {Number} height
	 * @param {String} clipPath
	 * @return {jQuery}
	 */
	article.createSvgImageThumbnail = function (
		className, url, x, y, thumbnailWidth, thumbnailHeight, width, height, clipPath
	) {
		var $thumbnailSVGImage, $thumbnail;

		$thumbnailSVGImage = $( article.createSVGTag( 'image' ) );
		$thumbnailSVGImage
			.addClass( className )
			.attr( {
				'xlink:href': url,
				x: x,
				y: y,
				width: thumbnailWidth,
				height: thumbnailHeight,
				'clip-path': 'url(#' + clipPath + ')'
			} );

		$thumbnail = $( '<svg>' )
			.attr( {
				xmlns: 'http://www.w3.org/2000/svg',
				width: width,
				height: height
			} )
			.append( $thumbnailSVGImage );

		return $thumbnail;
	};

	/**
	 * Returns the `img` object for thumbnail
	 *
	 * @method createImgThumbnail
	 * @param {String} className
	 * @param {String} url
	 * @return {jQuery}
	 */
	article.createImgThumbnail = function ( className, url ) {
		return $( '<div>' )
			.addClass( className )
			.css( 'background-image', 'url(' + url + ')' );
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
				event.pageY + 20 :
				// Position according to link position or size
				link.offset().top + link.height() + 9,
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
				article.SIZES.portraitPopupWidth :
				article.SIZES.landscapePopupWidth;
			flippedX = true;
		}

		if ( event.pageX ) {
			offsetLeft += ( flippedX ) ? 20 : -20;
		}

		mw.popups.render.cache[ href ].settings.flippedX = flippedX;

		// Y Flip
		if ( clientTop > ( $( window ).height() / 2 ) ) {
			flippedY = true;
		}

		if ( event.pageY && flippedY ) {
			offsetTop += 30;
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
	 */
	article.processPopup = function ( link ) {
		var
			svg = mw.popups.supportsSVG,
			cache = mw.popups.render.cache [ link.attr( 'href' ) ],
			popup = mw.popups.$popup,
			tall = cache.settings.tall,
			thumbnail = cache.settings.thumbnail,
			flippedY = cache.settings.flippedY,
			flippedX = cache.settings.flippedX;

		popup.find( '.mwe-popups-settings-icon' ).click( function () {
			mw.popups.settings.open();
		} );

		if ( !svg && flippedY && !tall ) {
			$( '.mwe-popups-extract' ).css( 'margin-top', '206px' );
		}

		if ( flippedY ) {
			popup.css( {
				top: popup.offset().top - ( popup.outerHeight() + 50 )
			} );
		}

		if ( flippedY && thumbnail && svg ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', '' );
		}

		if ( flippedY && flippedX && thumbnail && tall && svg ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask-flip)' );
		}

		if ( flippedX && !flippedY && thumbnail && !tall && svg ) {
			mw.popups.$popup
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
		}

		if ( flippedX && !flippedY && thumbnail && tall && svg ) {
			mw.popups.$popup
				.removeClass( 'mwe-popups-no-image-tri' )
				.find( 'image' )[ 0 ]
				.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
		}
	};

	mw.popups.render.article = article;

} ) ( jQuery, mediaWiki );
