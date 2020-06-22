/**
 * @module renderer
 */

import wait from '../wait';
import pointerMaskSVG from './pointer-mask.svg';
import { SIZES, createThumbnail } from './thumbnail';
import { previewTypes } from '../preview/model';
import { renderPreview } from './templates/preview/preview';
import { renderReferencePreview } from './templates/referencePreview/referencePreview';
import { renderPagePreview } from './templates/pagePreview/pagePreview';

const $window = $( window ),
	landscapePopupWidth = 450,
	portraitPopupWidth = 320,
	pointerSize = 8, // Height of the pointer.
	maxLinkWidthForCenteredPointer = 28; // Link with roughly < 4 chars.

/**
 * Extracted from `mw.popups.createSVGMasks`. This is just an SVG mask to point
 * or "point" at the link that's hovered over. The "pointer" appears to be cut
 * out of the image itself:
 *   _______                  link
 *  |       |    _/\_____     _/\____ <-- Pointer pointing at link
 *  |  :-]  | + |xxxxxxx   = |  :-]  |
 *  |_______|   |xxxxxxx     |_______|
 *              :
 *  Thumbnail    Pointer     Page preview
 *    image     clip-path   bubble w/ pointer
 *
 * SVG masks are used in place of CSS masks for browser support issues (see
 * https://caniuse.com/#feat=css-masks).
 *
 * @private
 * @param {Object} container DOM object to which pointer masks are appended
 * @return {void}
 */
export function createPointerMasks( container ) {
	$( '<div>' )
		.attr( 'id', 'mwe-popups-svg' )
		.html( pointerMaskSVG )
		.appendTo( container );
}

/**
 * Initializes the renderer.
 *
 * @return {void}
 */
export function init() {
	createPointerMasks( document.body );
}

/**
 * The model of how a view is rendered, which is constructed from a response
 * from the gateway.
 *
 * TODO: Rename `isTall` to `isPortrait`.
 *
 * @typedef {Object} ext.popups.Preview
 * @property {JQuery} el
 * @property {boolean} hasThumbnail
 * @property {Object} thumbnail
 * @property {boolean} isTall Sugar around
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
 *   their keyboard or other assistive device.
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
	const preview = createPreviewWithType( model );

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
		 * @param {string} token The unique token representing the link interaction
		 *  that resulted in showing the preview
		 * @return {JQuery.Promise<void>}
		 */
		show( event, boundActions, token ) {
			return show(
				preview, event, $( event.target ), boundActions, token,
				document.body, document.documentElement.getAttribute( 'dir' )
			);
		},

		/**
		 * Hides the preview.
		 *
		 * See `hide` for more detail.
		 *
		 * @return {JQuery.Promise<void>}
		 */
		hide() {
			return hide( preview );
		}
	};
}
/**
 * Creates an instance of a Preview based on
 * the type property of the PreviewModel
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createPreviewWithType( model ) {
	switch ( model.type ) {
		case previewTypes.TYPE_PAGE:
			return createPagePreview( model );
		case previewTypes.TYPE_DISAMBIGUATION:
			return createDisambiguationPreview( model );
		case previewTypes.TYPE_REFERENCE:
			return createReferencePreview( model );
		default:
			return createEmptyPreview( model );
	}
}

/**
 * Creates an instance of the DTO backing a preview.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */
function createPagePreview( model ) {
	const thumbnail = createThumbnail( model.thumbnail ),
		hasThumbnail = thumbnail !== null;

	return {
		el: renderPagePreview( model, thumbnail ),
		hasThumbnail,
		thumbnail,
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
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */
function createEmptyPreview( model ) {
	const showTitle = false,
		extractMsg = mw.msg( 'popups-preview-no-preview' ),
		linkMsg = mw.msg( 'popups-preview-footer-read' );

	return {
		el: renderPreview( model, showTitle, extractMsg, linkMsg ),
		hasThumbnail: false,
		isTall: false
	};
}

/**
 * Creates an instance of the disambiguation preview.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */
function createDisambiguationPreview( model ) {
	const showTitle = true,
		extractMsg = mw.msg( 'popups-preview-disambiguation' ),
		linkMsg = mw.msg( 'popups-preview-disambiguation-link' );

	return {
		el: renderPreview( model, showTitle, extractMsg, linkMsg ),
		hasThumbnail: false,
		isTall: false
	};
}

/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {ext.popups.Preview}
 */
function createReferencePreview( model ) {
	return {
		el: renderReferencePreview( model ),
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
 * between rendering and showing a preview. Merge #render and Preview#show.
 *
 * @param {ext.popups.Preview} preview
 * @param {Event} event
 * @param {JQuery} $link event target
 * @param {ext.popups.PreviewBehavior} behavior
 * @param {string} token
 * @param {Object} container DOM object to which pointer masks are appended
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {JQuery.Promise<void>} A promise that resolves when the promise has
 *                                faded in.
 */
export function show(
	preview, event, $link, behavior, token, container, dir
) {
	const layout = createLayout(
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
		pointerSize,
		dir
	);

	preview.el.appendTo( container );

	layoutPreview(
		preview, layout, getClasses( preview, layout ),
		SIZES.landscapeImage.h, pointerSize
	);

	preview.el.show();

	// Trigger fading effect for reference previews after the popup has been rendered
	if ( preview.el.hasClass( 'mwe-popups-type-reference' ) ) {
		preview.el.find( '.mw-parser-output' ).first().trigger( 'scroll' );
	}

	return wait( 200 )
		.then( () => {
			bindBehavior( preview, behavior );
			behavior.previewShow( token );
		} );
}

/**
 * Binds the behavior to the interactive elements of the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewBehavior} behavior
 * @return {void}
 */
export function bindBehavior( preview, behavior ) {
	preview.el.on( 'mouseenter', behavior.previewDwell )
		.on( 'mouseleave', behavior.previewAbandon );

	preview.el.click( behavior.click );

	preview.el.find( '.mwe-popups-settings-icon' )
		.attr( 'href', behavior.settingsUrl )
		.click( ( event ) => {
			event.stopPropagation();

			behavior.showSettings( event );
		} );
}

/**
 * Extracted from `mw.popups.render.closePopup`.
 *
 * @param {ext.popups.Preview} preview
 * @return {JQuery.Promise<void>} A promise that resolves when the preview has
 *                                faded out.
 */
export function hide( preview ) {
	// FIXME: This method clearly needs access to the layout of the preview.
	const fadeInClass = ( preview.el.hasClass( 'mwe-popups-fade-in-up' ) ) ?
		'mwe-popups-fade-in-up' :
		'mwe-popups-fade-in-down';

	const fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
		'mwe-popups-fade-out-down' :
		'mwe-popups-fade-out-up';

	// Classes documented above
	// eslint-disable-next-line mediawiki/class-doc
	preview.el
		.removeClass( fadeInClass )
		.addClass( fadeOutClass );

	return wait( 150 ).then( () => {
		preview.el.remove();
	} );
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
 * @property {boolean} flippedX
 * @property {boolean} flippedY
 * @property {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 */

/**
 * @param {boolean} isPreviewTall
 * @param {Object} eventData Data related to the event that triggered showing
 *  a popup
 * @param {number} eventData.pageX
 * @param {number} eventData.pageY
 * @param {number} eventData.clientY
 * @param {Object} linkData Data related to the link that’s used for showing
 *  a popup
 * @param {ClientRectList} linkData.clientRects list of rectangles defined by
 *  four edges
 * @param {Object} linkData.offset
 * @param {number} linkData.width
 * @param {number} linkData.height
 * @param {Object} windowData Data related to the window
 * @param {number} windowData.scrollTop
 * @param {number} windowData.width
 * @param {number} windowData.height
 * @param {number} pointerSize Space reserved for the pointer
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {ext.popups.PreviewLayout}
 */
export function createLayout(
	isPreviewTall, eventData, linkData, windowData, pointerSize, dir
) {
	let flippedX = false,
		flippedY = false,
		offsetTop = eventData.pageY ?
			// If it was a mouse event, position according to mouse
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			getClosestYPosition(
				eventData.pageY - windowData.scrollTop,
				linkData.clientRects,
				false
			) + windowData.scrollTop + pointerSize :
			// Position according to link position or size
			linkData.offset.top + linkData.height + pointerSize,
		offsetLeft;
	const clientTop = eventData.clientY ? eventData.clientY : offsetTop;

	if ( eventData.pageX ) {
		if ( linkData.width > maxLinkWidthForCenteredPointer ) {
			// For wider links, position the popup's pointer at the
			// mouse pointer's location. (x-axis)
			offsetLeft = eventData.pageX;
		} else {
			// For smaller links, position the popup's pointer at
			// the link's center. (x-axis)
			offsetLeft = linkData.offset.left + linkData.width / 2;
		}
	} else {
		offsetLeft = linkData.offset.left;
	}

	// X Flip
	if ( offsetLeft > ( windowData.width / 2 ) ) {
		offsetLeft += ( !eventData.pageX ) ? linkData.width : 0;
		offsetLeft -= !isPreviewTall ?
			portraitPopupWidth :
			landscapePopupWidth;
		flippedX = true;
	}

	if ( eventData.pageX ) {
		offsetLeft += ( flippedX ) ? 18 : -18;
	}

	// Y Flip
	if ( clientTop > ( windowData.height / 2 ) ) {
		flippedY = true;

		// Mirror the positioning of the preview when there's no "Y flip": rest
		// the pointer on the edge of the link's bounding rectangle. In this case
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

		offsetTop -= pointerSize;
	}

	return {
		offset: {
			top: offsetTop,
			left: offsetLeft
		},
		flippedX: dir === 'rtl' ? !flippedX : flippedX,
		flippedY,
		dir
	};
}

/**
 * Generates a list of declarative CSS classes that represent the layout of
 * the preview.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {string[]}
 */
export function getClasses( preview, layout ) {
	const classes = [];

	if ( layout.flippedY ) {
		classes.push( 'mwe-popups-fade-in-down' );
	} else {
		classes.push( 'mwe-popups-fade-in-up' );
	}

	if ( layout.flippedY && layout.flippedX ) {
		classes.push( 'flipped-x-y' );
	} else if ( layout.flippedY ) {
		classes.push( 'flipped-y' );
	} else if ( layout.flippedX ) {
		classes.push( 'flipped-x' );
	}

	if ( ( !preview.hasThumbnail || preview.isTall && !layout.flippedX ) &&
		!layout.flippedY ) {
		classes.push( 'mwe-popups-no-image-pointer' );
	}

	if ( preview.hasThumbnail && !preview.isTall && !layout.flippedY ) {
		classes.push( 'mwe-popups-image-pointer' );
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
 * If the thumbnail is landscape and isn't the full height of the thumbnail
 * container, then pull the extract up to keep whitespace consistent across
 * previews.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @param {string[]} classes class names used for layout out the preview
 * @param {number} predefinedLandscapeImageHeight landscape image height
 * @param {number} pointerSize
 * @return {void}
 */
export function layoutPreview(
	preview, layout, classes, predefinedLandscapeImageHeight, pointerSize
) {
	const popup = preview.el,
		isTall = preview.isTall,
		hasThumbnail = preview.hasThumbnail,
		thumbnail = preview.thumbnail,
		flippedY = layout.flippedY;
	let offsetTop = layout.offset.top;

	if (
		!flippedY && !isTall && hasThumbnail &&
			thumbnail.height < predefinedLandscapeImageHeight
	) {
		popup.find( '.mwe-popups-extract' ).css(
			'margin-top',
			thumbnail.height - pointerSize
		);
	}

	// eslint-disable-next-line mediawiki/class-doc
	popup.addClass( classes.join( ' ' ) );

	if ( flippedY ) {
		offsetTop -= popup.outerHeight();
	}

	popup.css( {
		top: offsetTop,
		left: `${layout.offset.left}px`
	} );

	if ( hasThumbnail ) {
		setThumbnailClipPath( preview, layout );
	}
}

/**
 * Sets the thumbnail SVG clip-path.
 *
 * If the preview should be oriented differently, then the pointer is updated,
 * e.g. if the preview should be flipped vertically, then the pointer is
 * removed.
 *
 * Note: SVG clip-paths are supported everywhere but clip-paths as CSS
 * properties are not (https://caniuse.com/#feat=css-clip-path). For this
 * reason, RTL flipping is handled in JavaScript instead of CSS.
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {void}
 */
export function setThumbnailClipPath(
	{ el, isTall, thumbnail }, { flippedY, flippedX, dir }
) {
	const maskID = getThumbnailClipPathID( isTall, flippedY, flippedX );
	if ( maskID ) {
		// CSS matrix transform entries:
		// ⎡ sx c tx ⎤
		// ⎣ sy d ty ⎦
		const matrix = {
			scaleX: 1,
			// moving the mask horizontally if the image is less than the maximum width
			translateX: isTall ? Math.min( thumbnail.width - SIZES.portraitImage.w, 0 ) : 0
		};

		if ( dir === 'rtl' ) {
			// flipping the mask horizontally
			matrix.scaleX = -1;
			// moving the mask horizontally to the max width of the thumbnail
			matrix.translateX = isTall ? SIZES.portraitImage.w : SIZES.landscapeImage.w;
		}

		// Transform the clip-path not the image it is applied to.
		const mask = document.getElementById( maskID );
		mask.setAttribute(
			'transform',
			`matrix(${matrix.scaleX} 0 0 1 ${matrix.translateX} 0)`
		);

		el.find( 'image' )[ 0 ]
			.setAttribute( 'clip-path', `url(#${maskID})` );
	}
}

/**
 * Gets the thumbnail SVG clip-path element ID as specified in pointer-mask.svg.
 *
 * @param {boolean} isTall Sugar around
 *  `preview.hasThumbnail && thumbnail.isTall`
 * @param {boolean} flippedY
 * @param {boolean} flippedX
 * @return {string|undefined}
 */
export function getThumbnailClipPathID( isTall, flippedY, flippedX ) {
	// Clip-paths are only needed when the pointer is in a corner that is covered by the thumbnail.
	// This is only the case in 4 of 8 situations:
	if ( !isTall && !flippedY ) {
		// 1. Landscape thumbnails cover the upper half of the popup. This is only the case when the
		// pointer is not flipped to the bottom.
		return flippedX ? 'mwe-popups-mask-flip' : 'mwe-popups-mask';
	} else if ( isTall && flippedX ) {
		// 2. Tall thumbnails cover the right half of the popup. This is only the case when the
		// pointer is flipped to the right.
		return flippedY ? 'mwe-popups-landscape-mask-flip' : 'mwe-popups-landscape-mask';
	}

	// The 4 combinations not covered above don't need a clip-path.
	return undefined;
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
 * @param {number} y the point for which the closest location is being
 *  looked for
 * @param {ClientRectList} rects list of rectangles defined by four edges
 * @param {boolean} [isTop] should the resulting rectangle's top 'y'
 *  boundary be returned. By default the bottom 'y' value is returned.
 * @return {number}
 */
export function getClosestYPosition( y, rects, isTop ) {
	let minY = null, result;

	Array.prototype.slice.call( rects ).forEach( ( rect ) => {
		const deltaY = Math.abs( y - rect.top + y - rect.bottom );

		if ( minY === null || minY > deltaY ) {
			minY = deltaY;
			// Make sure the resulting point is at or outside the rectangle
			// boundaries.
			result = ( isTop ) ? Math.floor( rect.top ) : Math.ceil( rect.bottom );
		}
	} );

	return result;
}
