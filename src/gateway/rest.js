var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
	RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0',
	createModel = require( '../preview/model' ).createModel,
	mw = window.mediaWiki;

/**
 * RESTBase gateway factory
 *
 * @param {Function} ajax function from jQuery for example
 * @param {ext.popups.constants} config set of configuration values
 * @returns {ext.popups.Gateway}
 */
function createRESTBaseGateway( ajax, config ) {

	/**
	 * Fetch page data from the API
	 *
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	function fetch( title ) {
		return ajax( {
			url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
			headers: {
				Accept: 'application/json; charset=utf-8' +
					'profile="' + RESTBASE_PROFILE + '"'
			}
		} );
	}

	/**
	 * Get the page summary from the api and transform the data
	 *
	 * @param {String} title
	 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
	 */
	function getPageSummary( title ) {
		return fetch( title )
			.then( function( page ) {
				return convertPageToModel( page, config.THUMBNAIL_SIZE );
			} );
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
 * @param {int} thumbSize The requested size
 * @returns {Object}
 */
function generateThumbnailData( thumbnail, original, thumbSize ) {
	var parts = thumbnail.source.split( '/' ),
		lastPart = parts[ parts.length - 1 ],
		filename;

	// The last part, the thumbnail's full filename, is in the following form:
	// ${width}px-${filename}.${extension}. Splitting the thumbnail's filename
	// makes this function resilient to the thumbnail not having the same
	// extension as the original image, which is definitely the case for SVG's
	// where the thumbnail's extension is .svg.png.
	filename = lastPart.substr( lastPart.indexOf( 'px-' ) + 3 );

	// If the image isn't an SVG then it shouldn't be scaled past its original
	// dimensions.
	if ( thumbSize >= original.width && filename.indexOf( '.svg' ) === -1 ) {
		return original;
	}

	parts[ parts.length - 1 ] = thumbSize + 'px-' + filename;

	return {
		source: parts.join( '/' ),

		// Scale the thumbnail's dimensions, preserving its aspect ratio.
		width: thumbSize,
		height: ( thumbSize / thumbnail.width ) * thumbnail.height
	};
}

/**
 * Transform the rest API response to a preview model
 *
 * @param {Object} page
 * @param {int} thumbSize
 * @returns {ext.popups.PreviewModel}
 */
function convertPageToModel( page, thumbSize ) {
	return createModel(
		page.title,
		new mw.Title( page.title ).getUrl(),
		page.lang,
		page.dir,
		page.extract,
		page.thumbnail ? generateThumbnailData( page.thumbnail, page.originalimage, thumbSize ) : undefined
	);
}

module.exports = createRESTBaseGateway;
