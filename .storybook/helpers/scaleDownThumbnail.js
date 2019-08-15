/**
 * Popups thumbnails are requested from the server at a size
 * relative to the screen DPI. Since we're not making that
 * server request, instead using predefined models, we have to
 * scale the thumbnail dimensions down manually for low-dpi displays.
 *
 * We're only scaling images down and not up since the correct
 * behaviour for popup is to not display an image if it's too small.
 * An image that's too big wouldn't be requested in the first place.
 *
 * It's best to define hi-dpi images in the models, unless the purpose
 * is to display the thumbnail on a low-dpi display and not a hi-dpi one.
 */

import { default as CONSTANTS } from '../../src/constants';


/**
 * Scaled down thumbnails for low-dpi displays.
 * @param {Object} thumbnail - PagePreviewModel.thumbnail property
 * @return {Object} PagePreviewModel.thumbnail property
 */
export default function scaleDownThumbnail( thumbnail ) {
	const
		x = thumbnail.width,
		y = thumbnail.height,
		ratio = Math.min(CONSTANTS.THUMBNAIL_SIZE / x, CONSTANTS.THUMBNAIL_SIZE / y),
		thumbSrc = thumbnail.source,
		maxPxSize = CONSTANTS.THUMBNAIL_SIZE + 'px',
		scaledSrc = thumbSrc.replace( /\d*.px/, maxPxSize );

	return Object.assign({}, thumbnail, {
		source: scaledSrc,
		width: x * ratio,
		height: y * ratio,
	});
}
