/**
 * @module gateway/rest
 */

import { createModel, createNullModel } from '../preview/model';

var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
	RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.2.0',
	mw = window.mediaWiki,
	$ = jQuery;
/**
 * @interface RESTBaseGateway
 * @extends Gateway
 *
 * @global
 */

/**
 * Creates an instance of the RESTBase gateway.
 *
 * This gateway differs from the {@link MediaWikiGateway MediaWiki gateway} in
 * that it fetches page data from [the RESTBase page summary endpoint][0].
 *
 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
 *
 * @param {Function} ajax A function with the same signature as `jQuery.ajax`
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {Function} extractParser A function that takes response and returns parsed extract
 * @return {RESTBaseGateway}
 */
export default function createRESTBaseGateway( ajax, config, extractParser ) {

	/**
	 * Fetches page data from [the RESTBase page summary endpoint][0].
	 *
	 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
	 *
	 * @function
	 * @name MediaWikiGateway#fetch
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	function fetch( title ) {
		return ajax( {
			url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
			headers: {
				Accept: 'application/json; charset=utf-8; ' +
					'profile="' + RESTBASE_PROFILE + '"'
			}
		} );
	}

	function getPageSummary( title ) {
		var result = $.Deferred();

		fetch( title )
			.then(
				function ( page ) {
					// Endpoint response may be empty or simply missing a title.
					if ( !page || !page.title ) {
						page = $.extend( true, page || {}, { title: title } );
					}
					// And extract may be omitted if empty string
					if ( page.extract === undefined ) {
						page.extract = '';
					}
					result.resolve(
						convertPageToModel( page, config.THUMBNAIL_SIZE, extractParser ) );
				},
				function ( jqXHR, textStatus, errorThrown ) {
					// Adapt the response to the ideal API.
					// TODO: should we just let the client handle this too?
					if ( jqXHR.status === 404 ) {
						result.resolve(
							createNullModel( title, new mw.Title( title ).getUrl() )
						);
					} else {
						// The client will choose how to handle these errors which may include those due to HTTP
						// 5xx status. The rejection typing matches Fetch failures.
						result.reject( 'http', { xhr: jqXHR, textStatus: textStatus, exception: errorThrown } );
					}
				}
			);

		return result.promise();
	}

	return {
		fetch: fetch,
		convertPageToModel: convertPageToModel,
		getPageSummary: getPageSummary
	};
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
 * @param {Number} thumbSize The requested size
 * @return {Object}
 */
function generateThumbnailData( thumbnail, original, thumbSize ) {
	var parts = thumbnail.source.split( '/' ),
		lastPart = parts[ parts.length - 1 ],
		filename,
		width,
		height;

	// The last part, the thumbnail's full filename, is in the following form:
	// ${width}px-${filename}.${extension}. Splitting the thumbnail's filename
	// makes this function resilient to the thumbnail not having the same
	// extension as the original image, which is definitely the case for SVG's
	// where the thumbnail's extension is .svg.png.
	filename = lastPart.substr( lastPart.indexOf( 'px-' ) + 3 );

	// Scale the thumbnail's largest dimension.
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
		return original;
	}

	parts[ parts.length - 1 ] = width + 'px-' + filename;

	return {
		source: parts.join( '/' ),
		width: width,
		height: height
	};
}

/**
 * Converts the API response to a preview model.
 *
 * @function
 * @name RESTBaseGateway#convertPageToModel
 * @param {Object} page
 * @param {Number} thumbSize
 * @param {Function} extractParser
 * @return {PreviewModel}
 */
function convertPageToModel( page, thumbSize, extractParser ) {
	return createModel(
		page.title,
		new mw.Title( page.title ).getUrl(),
		page.lang,
		page.dir,
		extractParser( page ),
		page.thumbnail ? generateThumbnailData( page.thumbnail, page.originalimage, thumbSize ) : undefined
	);
}
