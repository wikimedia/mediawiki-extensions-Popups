var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
	RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0',
	createModel = require( '../preview/model' ).createModel,
	$ = window.jQuery,
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
 * Takes the original thumbnail and ensure it fits within limits of THUMBNAIL_SIZE
 *
 * @param {Object} original image
 * @param {int} thumbSize  expected thumbnail size
 * @returns {Object}
 */
function generateThumbnailData( original, thumbSize ) {
	var parts = original.source.split( '/' ),
		filename = parts[ parts.length - 1 ];

	if ( thumbSize > original.width && filename.indexOf( '.svg' ) === -1 ) {
		thumbSize = original.width;
	}

	return $.extend( {}, original, {
		source: parts.join( '/' ) + '/' + thumbSize + 'px-' + filename
	} );
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
		page.originalimage ? generateThumbnailData( page.originalimage, thumbSize ) : undefined
	);
}

module.exports = createRESTBaseGateway;
