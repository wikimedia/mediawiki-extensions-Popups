/**
 * @module thumbnail
 */

import constants from '../constants';

export const SIZES = {
	portraitImage: {
		h: 250, // Exact height
		w: 203 // Max width
	},
	landscapeImage: {
		h: 200, // Max height
		w: 320 // Exact Width
	}
};

/**
 * @typedef {Object} ext.popups.Thumbnail
 * @property {JQuery} el
 * @property {boolean} isTall Whether or not the thumbnail is portrait
 * @property {number} width
 * @property {number} height
 * @property {boolean} isNarrow whether the thumbnail is portrait and also
 *  thinner than the default portrait thumbnail width
 *  (as defined in SIZES.portraitImage.w)
 * @property {number} offset in pixels between the thumbnail width and the
 *  standard portrait thumbnail width (as defined in SIZES.portraitImage.w)
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
 * @param {boolean} useCSSClipPath
 * @return {ext.popups.Thumbnail|null}
 */
export function createThumbnail( rawThumbnail, useCSSClipPath ) {
	const devicePixelRatio = constants.BRACKETED_DEVICE_PIXEL_RATIO;

	if ( !rawThumbnail ) {
		return null;
	}

	const thumbWidth = rawThumbnail.width / devicePixelRatio;
	const thumbHeight = rawThumbnail.height / devicePixelRatio;
	// For images less than 320 wide, try to display a 250 high vertical slice instead
	const tall = rawThumbnail.height > rawThumbnail.width || thumbWidth < SIZES.landscapeImage.w;

	if (
		// Image too small for portrait display
		( tall && thumbHeight < SIZES.portraitImage.h &&
			rawThumbnail.height < SIZES.portraitImage.h ) ||
		// These characters in URL that could inject CSS and thus JS
		(
			rawThumbnail.source.indexOf( '\\' ) > -1 ||
			rawThumbnail.source.indexOf( '\'' ) > -1 ||
			rawThumbnail.source.indexOf( '"' ) > -1
		)
	) {
		return null;
	}

	const aspectRatio = thumbWidth / thumbHeight;
	const isSquare = aspectRatio > 0.7 && aspectRatio < 1.3;

	let x, y, width, height;
	if ( tall ) {
		x = ( thumbWidth > SIZES.portraitImage.w ) ?
			( ( thumbWidth - SIZES.portraitImage.w ) / -2 ) :
			( SIZES.portraitImage.w - thumbWidth );
		y = ( thumbHeight > SIZES.portraitImage.h ) ?
			( ( thumbHeight - SIZES.portraitImage.h ) / -2 ) : 0;
		width = SIZES.portraitImage.w;
		height = SIZES.portraitImage.h;

		// Special handling for thin tall images
		// https://phabricator.wikimedia.org/T192928#4312088
		if ( thumbWidth < width ) {
			x = 0;
			width = thumbWidth;
		}
	} else {
		x = 0;
		y = ( thumbHeight > SIZES.landscapeImage.h ) ?
			( ( thumbHeight - SIZES.landscapeImage.h ) / -2 ) : 0;
		width = SIZES.landscapeImage.w;
		height = ( thumbHeight > SIZES.landscapeImage.h ) ?
			SIZES.landscapeImage.h : thumbHeight;
	}

	const isNarrow = tall && thumbWidth < SIZES.portraitImage.w;
	const el = useCSSClipPath ? createThumbnailImg( rawThumbnail.source ) : createThumbnailSVG(
		tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall',
		rawThumbnail.source,
		x,
		y,
		thumbWidth,
		thumbHeight,
		width,
		height
	);

	return {
		el,
		isTall: tall || isSquare,
		isNarrow,
		offset: isNarrow ? SIZES.portraitImage.w - thumbWidth : 0,
		width: thumbWidth,
		height: thumbHeight
	};
}

function createThumbnailImg( url ) {
	const img = document.createElement( 'img' );
	img.className = 'mwe-popups-thumbnail';
	img.src = url;
	return img;
}

/**
 * Sets multiple attributes on a node.
 *
 * @param {HTMLElement} node
 * @param {Record<String, String>} attrs
 */
const addAttributes = ( node, attrs ) => {
	Object.keys( attrs ).forEach( ( key ) => {
		node.setAttribute( key, attrs[ key ] );
	} );
};

/**
 * Creates the SVG image element that represents the thumbnail.
 *
 * This function is distinct from `createThumbnail` as it abstracts away some
 * browser issues that are uncovered when manipulating elements across
 * namespaces.
 *
 * @param {string} className
 * @param {string} url
 * @param {number} x
 * @param {number} y
 * @param {number} thumbnailWidth
 * @param {number} thumbnailHeight
 * @param {number} width
 * @param {number} height
 * @return {HTMLElement}
 */

export function createThumbnailSVG(
	className, url, x, y, thumbnailWidth, thumbnailHeight, width, height
) {
	const nsSvg = 'http://www.w3.org/2000/svg',
		nsXlink = 'http://www.w3.org/1999/xlink';

	// We want to visually separate the image from the summary
	// Given we use an SVG mask, we cannot rely on border to do this
	// and instead must insert a polyline element to visually separate
	const line = document.createElementNS( nsSvg, 'polyline' );
	const isTall = className.indexOf( 'not-tall' ) === -1;
	const points = isTall ? [ 0, 0, 0, height ] :
		[ 0, height - 1, width, height - 1 ];

	line.setAttribute( 'stroke', 'rgba(0,0,0,0.1)' );
	line.setAttribute( 'points', points.join( ' ' ) );
	line.setAttribute( 'stroke-width', 1 );

	const thumbnailSVGImage = document.createElementNS( nsSvg, 'image' );
	thumbnailSVGImage.setAttributeNS( nsXlink, 'href', url );
	// The following classes are used here:
	// * mwe-popups-is-not-tall
	// * mwe-popups-is-tall
	thumbnailSVGImage.classList.add( className );
	addAttributes(
		thumbnailSVGImage,
		{
			x,
			y,
			width: thumbnailWidth,
			height: thumbnailHeight
		}
	);

	const thumbnail = document.createElementNS( nsSvg, 'svg' );
	addAttributes(
		thumbnail, {
			xmlns: nsSvg,
			width,
			height
		}
	);
	thumbnail.appendChild( thumbnailSVGImage );
	thumbnail.appendChild( line );
	return thumbnail;
}
