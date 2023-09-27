/**
 * @module renderer
 */

import wait from '../wait';
import pointerMaskSVG from './pointer-mask.svg';
import { SIZES, createThumbnail } from './thumbnail';
import { renderPreview } from './templates/preview/preview';
import { renderReferencePreview } from './templates/referencePreview/referencePreview';
import { renderPagePreview } from './templates/pagePreview/pagePreview';

const landscapePopupWidth = 450,
	portraitPopupWidth = 320,
	pointerSize = 8, // Height of the pointer.
	maxLinkWidthForCenteredPointer = 28; // Link with roughly < 4 chars.

export { pointerSize, landscapePopupWidth, portraitPopupWidth }; // for use in storybook

/**
 * @typedef {Object} ext.popups.Measures
 * @property {number} pageX
 * @property {number} pageY
 * @property {number} clientY
 * @property {ClientRectList} clientRects list of rectangles defined by
 *  four edges
 * @property {Object} offset
 * @property {number} width
 * @property {number} height
 * @property {number} scrollTop
 * @property {number} windowWidth
 * @property {number} windowHeight
 */

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
	const node = document.createElement( 'div' );
	node.setAttribute( 'id', 'mwe-popups-svg' );
	node.innerHTML = pointerMaskSVG;
	container.appendChild( node );
}

/**
 * Initializes the renderer.
 *
 * @return {void}
 */
export function init() {
	if ( !supportsCSSClipPath() ) {
		createPointerMasks( document.body );
	}
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
		 * @return {jQuery.Promise<void>}
		 */
		show( event, boundActions, token ) {
			return show(
				preview, event, event.target, boundActions, token,
				document.body, document.documentElement.getAttribute( 'dir' )
			);
		},

		/**
		 * Hides the preview.
		 *
		 * See `hide` for more detail.
		 *
		 * @return {jQuery.Promise<void>}
		 */
		hide() {
			return hide( preview );
		}
	};
}

let renderers = {};

/**
 * @param {string} type
 * @param {function( ext.popups.PreviewModel ): ext.popups.Preview} [previewFn]
 *
 */
export function registerPreviewUI( type, previewFn ) {
	renderers[ type ] = previewFn || createPagePreview;
}

/**
 * Creates an instance of a Preview based on
 * the type property of the PreviewModel
 *
 * @param {ext.popups.PreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createPreviewWithType( model ) {
	const fn = renderers[ model.type ] || createEmptyPreview;
	return fn( model );
}

function supportsCSSClipPath() {
	return window.CSS &&
		typeof CSS.supports === 'function' &&
		CSS.supports( 'clip-path', 'polygon(1px 1px)' );
	/* eslint-enable compat/compat */
}

/**
 * Creates an instance of the DTO backing a preview.
 *
 * @param {ext.popups.PagePreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createPagePreview( model ) {
	const thumbnail = createThumbnail( model.thumbnail, supportsCSSClipPath() ),
		hasThumbnail = thumbnail !== null,
		withCSSClipPath = supportsCSSClipPath(),
		linkTitle = mw.msg( 'popups-settings-icon-gear-title' );

	return {
		el: renderPagePreview( model, thumbnail, withCSSClipPath, linkTitle ),
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
export function createEmptyPreview( model ) {
	model.title = mw.msg( 'popups-preview-no-preview' );
	const linkMsg = mw.msg( 'popups-preview-footer-read' );

	return {
		el: renderPreview( model, null, linkMsg ),
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
export function createDisambiguationPreview( model ) {
	const extractMsg = mw.msg( 'popups-preview-disambiguation' );
	const linkMsg = mw.msg( 'popups-preview-disambiguation-link' );

	return {
		el: renderPreview( model, extractMsg, linkMsg ),
		hasThumbnail: false,
		isTall: false
	};
}

/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {ext.popups.Preview}
 */
export function createReferencePreview( model ) {
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
 * @param {ext.popups.Measures} measures
 * @param {HTMLElement} _link event target (unused)
 * @param {ext.popups.PreviewBehavior} behavior
 * @param {string} token
 * @param {Object} container DOM object to which pointer masks are appended
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {jQuery.Promise<void>} A promise that resolves when the promise has
 *                                faded in.
 */
export function show(
	preview, measures, _link, behavior, token, container, dir
) {
	const layout = createLayout(
		preview.isTall,
		measures,
		pointerSize,
		dir
	);

	container.appendChild( preview.el );

	layoutPreview(
		preview, layout, getClasses( preview, layout ),
		SIZES.landscapeImage.h, pointerSize, measures.windowHeight
	);

	preview.el.style.display = 'block';

	// Trigger fading effect for reference previews after the popup has been rendered
	if ( preview.el.classList.contains( 'mwe-popups-type-reference' ) ) {
		preview.el.querySelector( '.mwe-popups-scroll' ).dispatchEvent( new Event( 'scroll' ) );
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
	preview.el.addEventListener( 'mouseenter', behavior.previewDwell );
	preview.el.addEventListener( 'mouseleave', behavior.previewAbandon );

	preview.el.addEventListener( 'click', behavior.click );

	const button = preview.el.querySelector( 'a.mwe-popups-settings-button' );
	if ( button ) {
		button.href = behavior.settingsUrl;
		button.addEventListener( 'click', ( event ) => {
			event.stopPropagation();

			behavior.showSettings( event );
		} );
	}
}

/**
 * Extracted from `mw.popups.render.closePopup`.
 *
 * @param {ext.popups.Preview} preview
 * @return {jQuery.Promise<void>} A promise that resolves when the preview has
 *                                faded out.
 */
export function hide( preview ) {
	// FIXME: This method clearly needs access to the layout of the preview.
	const fadeInClass = ( preview.el.classList.contains( 'mwe-popups-fade-in-up' ) ) ?
		'mwe-popups-fade-in-up' :
		'mwe-popups-fade-in-down';

	const fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
		'mwe-popups-fade-out-down' :
		'mwe-popups-fade-out-up';

	// Classes documented above
	// eslint-disable-next-line mediawiki/class-doc
	preview.el.classList.remove( fadeInClass );
	// eslint-disable-next-line mediawiki/class-doc
	preview.el.classList.add( fadeOutClass );

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
 * @param {ext.popups.Measures} measures
 * @param {number} pointerSpaceSize Space reserved for the pointer
 * @param {string} dir 'ltr' if left-to-right, 'rtl' if right-to-left.
 * @return {ext.popups.PreviewLayout}
 */
export function createLayout(
	isPreviewTall, measures, pointerSpaceSize, dir
) {
	let flippedX = false,
		flippedY = false,
		offsetTop = measures.pageY ?
			// If it was a mouse event, position according to mouse
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			getClosestYPosition(
				measures.pageY - measures.scrollTop,
				measures.clientRects,
				false
			) + measures.scrollTop + pointerSpaceSize :
			// Position according to link position or size
			measures.offset.top + measures.height + pointerSize,
		offsetLeft;
	const clientTop = measures.clientY ? measures.clientY : offsetTop;

	if ( measures.pageX ) {
		if ( measures.width > maxLinkWidthForCenteredPointer ) {
			// For wider links, position the popup's pointer at the
			// mouse pointer's location. (x-axis)
			offsetLeft = measures.pageX;
		} else {
			// For smaller links, position the popup's pointer at
			// the link's center. (x-axis)
			offsetLeft = measures.offset.left + measures.width / 2;
		}
	} else {
		offsetLeft = measures.offset.left;
	}

	// X Flip
	if ( offsetLeft > ( measures.windowWidth / 2 ) ) {
		offsetLeft += ( !measures.pageX ) ? measures.width : 0;
		offsetLeft -= !isPreviewTall ?
			portraitPopupWidth :
			landscapePopupWidth;
		flippedX = true;
	}

	if ( measures.pageX ) {
		offsetLeft += ( flippedX ) ? 18 : -18;
	}

	// Y Flip
	if ( clientTop > ( measures.windowHeight / 2 ) ) {
		flippedY = true;

		// Mirror the positioning of the preview when there's no "Y flip": rest
		// the pointer on the edge of the link's bounding rectangle. In this case
		// the edge is the top-most.
		offsetTop = measures.offset.top;

		// Change the Y position to the top of the link
		if ( measures.pageY ) {
			// Since client rectangles are relative to the viewport,
			// take scroll position into account.
			offsetTop = getClosestYPosition(
				measures.pageY - measures.scrollTop,
				measures.clientRects,
				true
			) + measures.scrollTop;
		}

		offsetTop -= pointerSpaceSize;
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
 * is there a pointer on the image of the preview?
 *
 * @param {ext.popups.Preview} preview
 * @param {ext.popups.PreviewLayout} layout
 * @return {boolean}
 */
export function hasPointerOnImage( preview, layout ) {
	if ( ( !preview.hasThumbnail || preview.isTall && !layout.flippedX ) &&
		!layout.flippedY ) {
		return false;
	}
	if ( preview.hasThumbnail ) {
		if (
			( !preview.isTall && !layout.flippedY ) ||
			( preview.isTall && layout.flippedX )
		) {
			return true;
		}
	}
	return false;
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

	classes.push(
		hasPointerOnImage( preview, layout ) ?
			'mwe-popups-image-pointer' : 'mwe-popups-no-image-pointer'
	);

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
 * @param {number} pointerSpaceSize
 * @param {number} windowHeight
 * @return {void}
 */
export function layoutPreview(
	preview, layout, classes, predefinedLandscapeImageHeight, pointerSpaceSize, windowHeight
) {
	const popup = preview.el,
		isTall = preview.isTall,
		hasThumbnail = preview.hasThumbnail,
		thumbnail = preview.thumbnail,
		flippedY = layout.flippedY;

	if (
		!flippedY && !isTall && hasThumbnail &&
			thumbnail.height < predefinedLandscapeImageHeight && !supportsCSSClipPath()
	) {
		const popupExtract = popup.querySelector( '.mwe-popups-extract' );
		popupExtract.style.marginTop = `${( thumbnail.height - pointerSpaceSize )}px`;
	}

	// The following classes are used here:
	// * flipped-x
	// * flipped-x-y
	// * flipped-y
	// * mwe-popups-fade-in-down
	// * mwe-popups-fade-in-up
	// * mwe-popups-image-pointer
	// * mwe-popups-is-not-tall
	// * mwe-popups-is-tall
	// * mwe-popups-no-image-pointer
	popup.classList.add.apply( popup.classList, classes );

	popup.style.left = `${layout.offset.left}px`;
	popup.style.top = flippedY ? 'auto' : `${layout.offset.top}px`;
	popup.style.bottom = flippedY ? `${windowHeight - layout.offset.top}px` : 'auto';

	if ( hasThumbnail && !supportsCSSClipPath() ) {
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

		el.querySelector( 'image' )
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

export const test = {
	/** For testing only */
	reset: () => {
		renderers = {};
	}
};
