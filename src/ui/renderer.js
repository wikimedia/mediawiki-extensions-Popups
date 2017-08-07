/**
 * @module renderer
 */

import wait from '../wait';

var mw = window.mediaWiki,
	$ = jQuery,
	SIZES = {
		portraitImage: {
			h: 250, // Exact height
			w: 203 // Max width
		},
		landscapeImage: {
			h: 200, // Max height
			w: 300 // Exact Width
		},
		landscapePopupWidth: 450,
		portraitPopupWidth: 300,
		pokeySize: 8 // Height of the pokey.
	},
	$window = $( window );

/**
 * Extracted from `mw.popups.createSVGMasks`.
 * @private
 * @param {Object} container DOM object to which pokey masks are appended
 */
export function createPokeyMasks( container ) {
	$( '<div>' )
		.attr( 'id', 'mwe-popups-svg' )
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
						'<polygon points="0 0, 1000 0, 1000 242, 190 242, 182 250, 174 242, 0 242"/>' +
					'</clippath>' +
				'</defs>' +
			'</svg>'
		)
		.appendTo( container );
}

/**
 * Initializes the renderer.
 */
export function init() {
	createPokeyMasks( document.body );
}

/**
 * The model of how a view is rendered, which is constructed from a response
 * from the gateway.
 *
 * TODO: Rename `isTall` to `isPortrait`.
 *
 * @typedef {Object} ext.popups.Preview
 * @property {jQuery} el
 * @property {Boolean} hasThumbnail
 * @property {Object} thumbnail
 * @property {Boolean} isTall Sugar around
 *  `preview.hasThumbnail && thumbnail.isTall`
 */

/**
 * Renders a preview given data from the {@link gateway Gateway}.
 * The preview is rendered and added to the DOM but will remain hidden until
 * the `show` method is called.
 *
 * Previews are rendered at:
 *
 * # The position of the mouse when the user dwells on the link with their
 *   mouse.
 * # The centermost point of the link when the user dwells on the link with
 *   their keboard or other assistive device.
 *
 * Since the content of the preview doesn't change but its position might, we
 * distinguish between "rendering" - generating HTML from a MediaWiki API
 * response - and "showing/hiding" - positioning the layout and changing its
 * orientation, if necessary.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
export function render( model ) {
	var preview = model.extract === undefined ? createEmptyPreview( model ) : createPreview( model );

	return {

		/**
		 * Shows the preview given an event representing the user's interaction
		 * with the active link, e.g. an instance of
		 * [MouseEvent](https://developer.mozilla.org/en/docs/Web/API/MouseEvent).
		 *
		 * See `show` for more detail.
		 *
		 * @param {Event} event
		 * @param {Object} boundActions The
		 *  [bound action creators](http://redux.js.org/docs/api/bindActionCreators.html)
		 *  that were (likely) created in [boot.js](./boot.js).
		 * @param {String} token The unique token representing the link interaction
		 *  that resulted in showing the preview
		 * @return {jQuery.Promise}
		 */
		show: function ( event, boundActions, token ) {
			return show(
				preview, event, $( event.target ), boundActions, token,
				document.body
			);
		},

		/**
		 * Hides the preview.
		 *
		 * See `hide` for more detail.
		 *
		 * @return {jQuery.Promise}
		 */
		hide: function () {
			return hide( preview );
		}
	};
}

/**
 * Creates an instance of the DTO backing a preview.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createPreview( model ) {
	var templateData,
		thumbnail = createThumbnail( model.thumbnail ),
		hasThumbnail = thumbnail !== null,
		extract = model.extract,
		$el;

	templateData = $.extend( {}, model, {
		hasThumbnail: hasThumbnail
	} );

	$el = mw.template.get( 'ext.popups', 'preview.mustache' )
		.render( templateData );

	if ( hasThumbnail ) {
		$el.find( '.mwe-popups-discreet' ).append( thumbnail.el );
	}
	if ( extract ) {
		$el.find( '.mwe-popups-extract' ).append( extract );
	}

	return {
		el: $el,
		hasThumbnail: hasThumbnail,
		thumbnail: thumbnail,
		isTall: hasThumbnail && thumbnail.isTall
	};
}

/**
 * Creates an instance of the DTO backing a preview. In this case the DTO
 * represents a generic preview, which covers the following scenarios:
 *
 * * The page doesn't exist, i.e. the user hovered over a redlink or a
 *   redirect to a page that doesn't exist.
 * * The page doesn't have a viable extract.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createEmptyPreview( model ) {
	var templateData,
		$el;

	templateData = $.extend( {}, model, {
		extractMsg: mw.msg( 'popups-preview-no-preview' ),
		readMsg: mw.msg( 'popups-preview-footer-read' )
	} );

	$el = mw.template.get( 'ext.popups', 'preview-empty.mustache' )
		.render( templateData );

	return {
		el: $el,
		hasThumbnail: false,
		isTall: false
	};
}

/**
 * Shows the preview.
 *
 * Extracted from `mw.popups.render.openPopup`.
 *
 * TODO: From the perspective of the client, there's no need to distinguish
 * between renderering and showing a preview. Merge #render and Preview#show.
 *
 * @param {ext.popups.Preview} preview
 * @param {Event} event
 * @param {jQuery} $link event target
 * @param {ext.popups.PreviewBehavior} behavior
 * @param {String} token
 * @param {Object} container DOM object to which pokey masks are appended
 * @return {jQuery.Promise} A promise that resolves when the promise has faded
 *  in
 */
export function show( preview, event, $link, behavior, token, container ) {
	var layout = createLayout(
		preview.isTall,
		{
			pageX: event.pageX,
			pageY: event.pageY,
			clientY: event.clientY
		},
		{
			clientRects: $link.get( 0 ).getClientRects(),
			offset: $link.offset(),
			width: $link.width(),
			height: $link.height()
		},
		{
			scrollTop: $window.scrollTop(),
			width: $window.width(),
			height: $window.height()
		},
		SIZES.pokeySize
	);

	preview.el.appendTo( container );

	layoutPreview(
		preview, layout, getClasses( preview, layout ),
		SIZES.landscapeImage.h, SIZES.pokeySize
	);

	preview.el.show();

	return wait( 200 )
		.then( function () {
			bindBehavior( preview, behavior );
		} )
		.then( function () {
			behavior.previewShow( token );
		} );
}

/**
 * Binds the behavior to the interactive elements of the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewBehavior} behavior
 */
export function bindBehavior( preview, behavior ) {
	preview.el.hover( behavior.previewDwell, behavior.previewAbandon );

	preview.el.click( behavior.click );

	preview.el.find( '.mwe-popups-settings-icon' )
		.attr( 'href', behavior.settingsUrl )
		.click( function ( event ) {
			event.stopPropagation();

			behavior.showSettings( event );
		} );
}

/**
 * Extracted from `mw.popups.render.closePopup`.
 *
 * @param {ext.popups.Preview} preview
 * @return {jQuery.Promise} A promise that resolves when the preview has faded
 *  out
 */
export function hide( preview ) {
	var fadeInClass,
		fadeOutClass;

	// FIXME: This method clearly needs access to the layout of the preview.
	fadeInClass = ( preview.el.hasClass( 'mwe-popups-fade-in-up' ) ) ?
		'mwe-popups-fade-in-up' :
		'mwe-popups-fade-in-down';

	fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
		'mwe-popups-fade-out-down' :
		'mwe-popups-fade-out-up';

	preview.el
		.removeClass( fadeInClass )
		.addClass( fadeOutClass );

	return wait( 150 ).then( function () {
		preview.el.remove();
	} );
}

/**
 * @typedef {Object} ext.popups.Thumbnail
 * @property {Element} el
 * @property {Boolean} isTall Whether or not the thumbnail is portrait
 */

/**
 * Creates a thumbnail from the representation of a thumbnail returned by the
 * PageImages MediaWiki API query module.
 *
 * If there's no thumbnail, the thumbnail is too small, or the thumbnail's URL
 * contains characters that could be used to perform an
 * [XSS attack via CSS](https://www.owasp.org/index.php/Testing_for_CSS_Injection_(OTG-CLIENT-005)),
 * then `null` is returned.
 *
 * Extracted from `mw.popups.renderer.article.createThumbnail`.
 *
 * @param {Object} rawThumbnail
 * @return {ext.popups.Thumbnail|null}
 */
export function createThumbnail( rawThumbnail ) {
	var tall, thumbWidth, thumbHeight,
		x, y, width, height, clipPath,
		devicePixelRatio = $.bracketedDevicePixelRatio();

	if ( !rawThumbnail ) {
		return null;
	}

	tall = rawThumbnail.width < rawThumbnail.height;
	thumbWidth = rawThumbnail.width / devicePixelRatio;
	thumbHeight = rawThumbnail.height / devicePixelRatio;

	if (
		// Image too small for landscape display
		( !tall && thumbWidth < SIZES.landscapeImage.w ) ||
		// Image too small for portrait display
		( tall && thumbHeight < SIZES.portraitImage.h ) ||
		// These characters in URL that could inject CSS and thus JS
		(
			rawThumbnail.source.indexOf( '\\' ) > -1 ||
			rawThumbnail.source.indexOf( '\'' ) > -1 ||
			rawThumbnail.source.indexOf( '\"' ) > -1
		)
	) {
		return null;
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

	return {
		el: createThumbnailElement(
			tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall',
			rawThumbnail.source,
			x,
			y,
			thumbWidth,
			thumbHeight,
			width,
			height,
			clipPath
		),
		isTall: tall,
		width: thumbWidth,
		height: thumbHeight
	};
}

/**
 * Creates the SVG image element that represents the thumbnail.
 *
 * This function is distinct from `createThumbnail` as it abstracts away some
 * browser issues that are uncovered when manipulating elements across
 * namespaces.
 *
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
export function createThumbnailElement( className, url, x, y, thumbnailWidth, thumbnailHeight, width, height, clipPath ) {
	var $thumbnailSVGImage, $thumbnail,
		nsSvg = 'http://www.w3.org/2000/svg',
		nsXlink = 'http://www.w3.org/1999/xlink';

	$thumbnailSVGImage = $( document.createElementNS( nsSvg, 'image' ) );
	$thumbnailSVGImage[ 0 ].setAttributeNS( nsXlink, 'href', url );
	$thumbnailSVGImage
		.addClass( className )
		.attr( {
			x: x,
			y: y,
			width: thumbnailWidth,
			height: thumbnailHeight,
			'clip-path': 'url(#' + clipPath + ')'
		} );

	$thumbnail = $( document.createElementNS( nsSvg, 'svg' ) )
		.attr( {
			xmlns: nsSvg,
			width: width,
			height: height
		} )
		.append( $thumbnailSVGImage );

	return $thumbnail;
}

/**
 * Represents the layout of a preview, which consists of a position (`offset`)
 * and whether or not the preview should be flipped horizontally or
 * vertically (`flippedX` and `flippedY` respectively).
 *
 * @typedef {Object} ext.popups.PreviewLayout
 * @property {Object} offset
 * @property {number} offset.top
 * @property {number} offset.left
 * @property {Boolean} flippedX
 * @property {Boolean} flippedY
 */

/**
 * @param {isPreviewTall} isPreviewTall
 * @param {Object} eventData Data related to the event that triggered showing a popup
 * @param {number} eventData.pageX
 * @param {number} eventData.pageY
 * @param {number} eventData.clientY
 * @param {Object} linkData Data related to the link that’s used for showing a popup
 * @param {ClientRectList} linkData.clientRects list of rectangles defined by four edges
 * @param {Object} linkData.offset
 * @param {number} linkData.width
 * @param {number} linkData.height
 * @param {Object} windowData Data related to the window
 * @param {number} windowData.scrollTop
 * @param {number} windowData.width
 * @param {number} windowData.height
 * @param {number} pokeySize Space reserved for the pokey
 * @return {ext.popups.PreviewLayout}
 */
export function createLayout( isPreviewTall, eventData, linkData, windowData, pokeySize ) {
	var flippedX = false,
		flippedY = false,
		offsetTop = ( eventData.pageY ) ? // If it was a mouse event
			// Position according to mouse
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			getClosestYPosition(
				eventData.pageY - windowData.scrollTop,
				linkData.clientRects,
				false
			) + windowData.scrollTop + pokeySize :
			// Position according to link position or size
			linkData.offset.top + linkData.height + pokeySize,
		clientTop = ( eventData.clientY ) ?
			eventData.clientY :
			offsetTop,
		offsetLeft = ( eventData.pageX ) ?
			eventData.pageX :
			linkData.offset.left;

	// X Flip
	if ( offsetLeft > ( windowData.width / 2 ) ) {
		offsetLeft += ( !eventData.pageX ) ? linkData.width : 0;
		offsetLeft -= !isPreviewTall ?
			SIZES.portraitPopupWidth :
			SIZES.landscapePopupWidth;
		flippedX = true;
	}

	if ( eventData.pageX ) {
		offsetLeft += ( flippedX ) ? 20 : -20;
	}

	// Y Flip
	if ( clientTop > ( windowData.height / 2 ) ) {
		flippedY = true;

		// Mirror the positioning of the preview when there's no "Y flip": rest
		// the pokey on the edge of the link's bounding rectangle. In this case
		// the edge is the top-most.
		offsetTop = linkData.offset.top;

		// Change the Y position to the top of the link
		if ( eventData.pageY ) {
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			offsetTop = getClosestYPosition(
				eventData.pageY - windowData.scrollTop,
				linkData.clientRects,
				true
			) + windowData.scrollTop;
		}

		offsetTop -= pokeySize;
	}

	return {
		offset: {
			top: offsetTop,
			left: offsetLeft
		},
		flippedX: flippedX,
		flippedY: flippedY
	};
}

/**
 * Generates a list of declarative CSS classes that represent the layout of
 * the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {String[]}
 */
export function getClasses( preview, layout ) {
	var classes = [];

	if ( layout.flippedY ) {
		classes.push( 'mwe-popups-fade-in-down' );
	} else {
		classes.push( 'mwe-popups-fade-in-up' );
	}

	if ( layout.flippedY && layout.flippedX ) {
		classes.push( 'flipped_x_y' );
	}

	if ( layout.flippedY && !layout.flippedX ) {
		classes.push( 'flipped_y' );
	}

	if ( layout.flippedX && !layout.flippedY ) {
		classes.push( 'flipped_x' );
	}

	if ( ( !preview.hasThumbnail || preview.isTall ) && !layout.flippedY ) {
		classes.push( 'mwe-popups-no-image-tri' );
	}

	if ( ( preview.hasThumbnail && !preview.isTall ) && !layout.flippedY ) {
		classes.push( 'mwe-popups-image-tri' );
	}

	if ( preview.isTall ) {
		classes.push( 'mwe-popups-is-tall' );
	} else {
		classes.push( 'mwe-popups-is-not-tall' );
	}

	return classes;
}

/**
 * Lays out the preview given the layout.
 *
 * If the preview should be oriented differently, then the pokey is updated,
 * e.g. if the preview should be flipped vertically, then the pokey is
 * removed.
 *
 * If the thumbnail is landscape and isn't the full height of the thumbnail
 * container, then pull the extract up to keep whitespace consistent across
 * previews.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @param {string[]} classes class names used for layout out the preview
 * @param {number} predefinedLandscapeImageHeight landscape image height
 * @param {number} pokeySize
 */
export function layoutPreview( preview, layout, classes, predefinedLandscapeImageHeight, pokeySize ) {
	var popup = preview.el,
		isTall = preview.isTall,
		hasThumbnail = preview.hasThumbnail,
		thumbnail = preview.thumbnail,
		flippedY = layout.flippedY,
		flippedX = layout.flippedX,
		offsetTop = layout.offset.top;

	if (
		!flippedY && !isTall && hasThumbnail &&
			thumbnail.height < predefinedLandscapeImageHeight
	) {
		popup.find( '.mwe-popups-extract' ).css(
			'margin-top',
			thumbnail.height - pokeySize
		);
	}

	popup.addClass( classes.join( ' ' ) );

	if ( flippedY ) {
		offsetTop -= popup.outerHeight();
	}

	popup.css( {
		top: offsetTop,
		left: layout.offset.left + 'px'
	} );

	if ( flippedY && hasThumbnail ) {
		popup.find( 'image' )[ 0 ]
			.removeAttribute( 'clip-path' );
	}

	if ( flippedY && flippedX && hasThumbnail && isTall ) {
		popup.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask-flip)' );
	}

	if ( flippedX && !flippedY && hasThumbnail && !isTall ) {
		popup.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
	}

	if ( flippedX && !flippedY && hasThumbnail && isTall ) {
		popup.removeClass( 'mwe-popups-no-image-tri' )
			.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
	}
}

/**
 * Given the rectangular box(es) find the 'y' boundary of the closest
 * rectangle to the point 'y'. The point 'y' is the location of the mouse
 * on the 'y' axis and the rectangular box(es) are the borders of the
 * element over which the mouse is located. There will be more than one
 * rectangle in case the element spans multiple lines.
 *
 * In the majority of cases the mouse pointer will be inside a rectangle.
 * However, some browsers (i.e. Chrome) trigger a hover action even when
 * the mouse pointer is just outside a bounding rectangle. That's why
 * we need to look at all rectangles and not just the rectangle that
 * encloses the point.
 *
 * @private
 * @param {Number} y the point for which the closest location is being
 *  looked for
 * @param {ClientRectList} rects list of rectangles defined by four edges
 * @param {Boolean} [isTop] should the resulting rectangle's top 'y'
 *  boundary be returned. By default the bottom 'y' value is returned.
 * @return {Number}
 */
export function getClosestYPosition( y, rects, isTop ) {
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
