/**
 * @module gateway/rest
 */

import { createModel } from '../preview/model';
import { abortablePromise } from './index.js';

const RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.2.0';

/** @typedef {function(JQuery.AjaxSettings=): JQuery.jqXHR} Ajax */

/**
 * Creates an instance of the RESTBase gateway.
 *
 * This gateway differs from the {@link MediaWikiGateway MediaWiki gateway} in
 * that it fetches page data from [the RESTBase page summary endpoint][0].
 *
 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
 *
 * @param {Ajax} ajax A function with the same signature as `jQuery.ajax`
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {Function} extractParser A function that takes response and returns
 *  parsed extract
 * @return {Gateway}
 */
export default function createRESTBaseGateway( ajax, config, extractParser ) {
	/**
	 * Fetches page data from [the RESTBase page summary endpoint][0].
	 *
	 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
	 *
	 * @method
	 * @name RESTBaseGateway#fetch
	 * @param {string} title
	 * @return {jQuery.jqXHR}
	 */
	function fetch( title ) {
		const endpoint = config.endpoint;

		return ajax( {
			url: endpoint + encodeURIComponent( title ),
			headers: {
				Accept: `application/json; charset=utf-8; profile="${RESTBASE_PROFILE}"`,
				'Accept-Language': config.acceptLanguage
			}
		} );
	}

	/**
	 * @param {mw.Title} title
	 * @return {AbortPromise<PagePreviewModel>}
	 */
	function fetchPreviewForTitle( title ) {
		const titleText = title.getPrefixedDb(),
			xhr = fetch( titleText );
		return abortablePromise( xhr.then( ( page ) => {
			// Endpoint response may be empty or simply missing a title.
			page = page || {};
			page.title = page.title || titleText;
			// And extract may be omitted if empty string
			page.extract = page.extract || '';
			return convertPageToModel(
				page, config.THUMBNAIL_SIZE, extractParser
			);
		} ).catch( ( jqXHR, textStatus, errorThrown ) => {
			// The client will choose how to handle these errors which may include
			// those due to HTTP 4xx and 5xx status. The rejection typing matches
			// fetch failures.
			return Promise.reject( 'http', {
				xhr: jqXHR,
				textStatus,
				exception: errorThrown
			} );
		} ), () => xhr.abort() );
	}

	return {
		fetch,
		convertPageToModel,
		fetchPreviewForTitle
	};
}

/**
 * Checks whether the `originalImage` property contains an image
 * format that's safe to render.
 * https://www.mediawiki.org/wiki/Help:Images#Supported_media_types_for_images
 *
 * @param {string} filename
 *
 * @return {boolean}
 */
function isSafeImgFormat( filename ) {
	const safeImage = new RegExp( /\.(jpg|jpeg|png|gif)$/i );
	return safeImage.test( filename );
}

/**
 * Resizes the thumbnail to the requested width, preserving its aspect ratio.
 *
 * The requested width is limited to that of the original image unless the image
 * is an SVG, which can be scaled infinitely.
 *
 * This function is only intended to mangle the pretty thumbnail URLs used on
 * Wikimedia Commons. Once [an official thumb API](https://phabricator.wikimedia.org/T66214)
 * is fully specified and implemented, this function can be made more general.
 *
 * @param {Object} thumbnail The thumbnail image
 * @param {Object} original The original image
 * @param {number} thumbSize The requested size
 * @return {{source: string, width: number, height: number}|undefined}
 */
function generateThumbnailData( thumbnail, original, thumbSize ) {
	const parts = thumbnail.source.split( '/' ),
		lastPart = parts[ parts.length - 1 ],
		originalIsSafe = isSafeImgFormat( original.source ) || undefined;

	// The last part, the thumbnail's full filename, is in the following form:
	// ${width}px-${filename}.${extension}. Splitting the thumbnail's filename
	// makes this function resilient to the thumbnail not having the same
	// extension as the original image, which is definitely the case for SVG's
	// where the thumbnail's extension is .svg.png.
	const filenamePxIndex = lastPart.indexOf( 'px-' );
	if ( filenamePxIndex === -1 ) {
		// The thumbnail size is not customizable. Presumably, RESTBase requested a
		// width greater than the original and so MediaWiki returned the original's
		// URL instead of a thumbnail compatible URL. An original URL does not have
		// a "thumb" path, e.g.:
		//
		//   https://upload.wikimedia.org/wikipedia/commons/a/aa/Red_Giant_Earth_warm.jpg
		//
		// Instead of:
		//
		//   https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Red_Giant_Earth_warm.jpg/512px-Red_Giant_Earth_warm.jpg
		//
		// Use the original if it's a supported image format.
		return originalIsSafe && original;
	}
	const filename = lastPart.slice( filenamePxIndex + 3 );

	// Scale the thumbnail's largest dimension.
	let width, height;
	if ( thumbnail.width > thumbnail.height ) {
		width = thumbSize;
		height = Math.floor( ( thumbSize / thumbnail.width ) * thumbnail.height );
	} else {
		width = Math.floor( ( thumbSize / thumbnail.height ) * thumbnail.width );
		height = thumbSize;
	}

	// If the image isn't an SVG, then it shouldn't be scaled past its original
	// dimensions.
	if ( width >= original.width && filename.indexOf( '.svg' ) === -1 ) {
		// if the image format is not supported, it shouldn't be rendered.
		return originalIsSafe && original;
	}

	parts[ parts.length - 1 ] = `${width}px-${filename}`;

	return {
		source: parts.join( '/' ),
		width,
		height
	};
}

/**
 * Converts the API response to a preview model.
 *
 * @method
 * @name RESTBaseGateway#convertPageToModel
 * @param {Object} page
 * @param {number} thumbSize
 * @param {Function} extractParser
 * @return {PagePreviewModel}
 */
export function convertPageToModel( page, thumbSize, extractParser ) {
	return createModel(
		page.title,
		new mw.Title( page.title ).getUrl(),
		page.lang,
		page.dir,
		extractParser( page ),
		page.type,
		page.thumbnail ?
			generateThumbnailData(
				page.thumbnail, page.originalimage, thumbSize
			) : undefined,
		page.pageid
	);
}
