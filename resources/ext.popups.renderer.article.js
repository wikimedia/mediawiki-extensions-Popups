( function ( $, mw ) {

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
			deferred  = $.Deferred();

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

		mw.popups.render.currentRequest.done( function ( re ) {
			mw.popups.render.currentRequest = undefined;

			if (
				!re.query.pages[ re.query.pageids[ 0 ] ].extract ||
				re.query.pages[ re.query.pageids[ 0 ] ].extract === ''
			) {
				return false;
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
		var $a,
			page = re.query.pages[ re.query.pageids[ 0 ] ],
			$contentbox = $( '<div>' )
				.addClass( 'mwe-popups-extract' )
				.text( page.extract ),
			thumbnail = page.thumbnail,
			tall = thumbnail && thumbnail.height > thumbnail.width,
			$thumbnail = article.createThumbnail( thumbnail, tall ),
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
				.on( 'click', mw.popups.eventLogging.logClick );

		mw.popups.render.cache[ href ].settings = {
			'tall': ( tall === undefined ) ? false : tall,
			'thumbnail': ( thumbnail === undefined ) ? false : thumbnail
		};

		return $a;
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
		if ( !thumbnail ) {
			return $( '<span>' );
		}

		var $thumbnailSVGImage, $thumbnail;

		if ( tall ) {
			if ( mw.popups.supportsSVG ) {
				$thumbnailSVGImage = $( article.createSVGTag( 'image' ) );
				$thumbnailSVGImage
					.addClass( 'mwe-popups-is-not-tall' )
					.attr( {
						'xlink:href': thumbnail.source,
						x: ( thumbnail.width > article.SIZES.portraitImage.w ) ?
							( ( thumbnail.width - article.SIZES.portraitImage.w ) / -2 ) :
							( article.SIZES.portraitImage.w - thumbnail.width ),
						y: ( thumbnail.height > article.SIZES.portraitImage.h ) ?
							( ( thumbnail.height - article.SIZES.portraitImage.h ) / -2 ) :
							0,
						width: thumbnail.width,
						height: thumbnail.height
					} );

				$thumbnail = $( '<svg>' )
					.attr( {
						xmlns: 'http://www.w3.org/2000/svg',
						width: article.SIZES.portraitImage.w,
						height: article.SIZES.portraitImage.h
					} )
					.append( $thumbnailSVGImage );
			} else {
				$thumbnail = $( '<div>' )
					.addClass( 'mwe-popups-is-tall' )
					.css( 'background-image', 'url(' + thumbnail.source + ')' );
			}
		} else {
			if ( mw.popups.supportsSVG ) {
				$thumbnailSVGImage = $( article.createSVGTag( 'image' ) );
				$thumbnailSVGImage
					.addClass( 'mwe-popups-is-not-tall' )
					.attr( {
						'xlink:href': thumbnail.source,
						'clip-path': 'url(#mwe-popups-mask)',
						x: 0,
						y: ( thumbnail.height > article.SIZES.landscapeImage.h ) ?
							( ( thumbnail.height - article.SIZES.landscapeImage.h ) / -2 ) :
							0,
						width: thumbnail.width,
						height: thumbnail.height
					} );

				$thumbnail = $( '<svg>' )
					.attr( {
						xmlns: 'http://www.w3.org/2000/svg',
						width: article.SIZES.landscapeImage.w + 3,
						height: ( thumbnail.height > article.SIZES.landscapeImage.h ) ?
							article.SIZES.landscapeImage.h :
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
	};

	/**
	 * Positions the popup based on the mouse position and popup size
	 *
	 * @method getOffset
	 * @param {jQuery} link
	 * @param {Object} event
	 * @return {Object} This can be passed to `.css()` to position the element
	 */
	article.getOffset = function ( link, event ) {
		var
			href = link.attr( 'href' ),
			flipped = false,
			settings = mw.popups.render.cache[ href ].settings,
			offsetTop = ( event.pageY ) ?
				event.pageY + 20 :
				link.offset().top + link.height() + 9,
			offsetLeft = ( event.pageX ) ?
				event.pageX :
				link.offset().left;

		if ( offsetLeft > ( $( window ).width() / 2 ) ) {
			offsetLeft += ( !event.pageX ) ? link.width() : 0;
			offsetLeft -= ( !settings.tall ) ?
				article.SIZES.portraitPopupWidth :
				article.SIZES.landscapePopupWidth;
			flipped = true;
		}

		if ( event.pageX ) {
			offsetLeft += ( flipped ) ? 20 : -20;
		}

		mw.popups.render.cache[ href ].settings.flipped = flipped;

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
			flipped = cache.settings.flipped;

		if ( flipped ) {
			classes.push( 'flipped' );
		}

		if ( !thumbnail || tall ) {
			classes.push( 'mwe-popups-no-image-tri' );
		}

		if ( thumbnail && !tall ) {
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
			cache = mw.popups.render.cache [ link.attr( 'href' ) ],
			tall = cache.settings.tall,
			thumbnail = cache.settings.thumbnail,
			flipped = cache.settings.flipped;

		if ( flipped && thumbnail ) {
			if ( !tall ) {
				mw.popups.$popup
					.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
			} else {
				mw.popups.$popup
					.removeClass( 'mwe-popups-no-image-tri' )
					.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
			}
		}
	};

	mw.popups.render.article = article;

} ) ( jQuery, mediaWiki );
