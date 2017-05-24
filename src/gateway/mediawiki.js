/**
 * @module gateway/mediawiki
 */

/**
 * @interface MediaWikiGateway
 * @extends Gateway
 *
 * @global
 */

// Public and private cache lifetime (5 minutes)
//
// FIXME: Move this to src/constants.js.
var CACHE_LIFETIME = 300,
	createModel = require( '../preview/model' ).createModel;

/**
 * Creates an instance of the MediaWiki API gateway.
 *
 * @param {mw.Api} api
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {Number} config.THUMBNAIL_SIZE The length of the major dimension of
 *  the thumbnail.
 * @param {Number} config.EXTRACT_LENGTH The maximum length, in characters,
 *  of the extract.
 * @returns {MediaWikiGateway}
 */
module.exports = function createMediaWikiApiGateway( api, config ) {

	/**
	 * Fetches page data from the API.
	 *
	 * @function
	 * @name MediaWikiGateway#fetch
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	function fetch( title ) {
		return api.get( {
			action: 'query',
			prop: 'info|extracts|pageimages|revisions|info',
			formatversion: 2,
			redirects: true,
			exintro: true,
			exchars: config.EXTRACT_LENGTH,

			// There is an added geometric limit on .mwe-popups-extract
			// so that text does not overflow from the card.
			explaintext: true,

			piprop: 'thumbnail',
			pithumbsize: config.THUMBNAIL_SIZE,
			pilicense: 'any',
			rvprop: 'timestamp',
			inprop: 'url',
			titles: title,
			smaxage: CACHE_LIFETIME,
			maxage: CACHE_LIFETIME,
			uselang: 'content'
		}, {
			headers: {
				'X-Analytics': 'preview=1'
			}
		} );
	}

	function getPageSummary( title ) {
		return fetch( title )
			.then( extractPageFromResponse )
			.then( convertPageToModel );
	}

	return {
		fetch: fetch,
		extractPageFromResponse: extractPageFromResponse,
		convertPageToModel: convertPageToModel,
		getPageSummary: getPageSummary
	};
};

/**
 * Extracts page data from the API response.
 *
 * @function
 * @name MediaWikiGateway#extractPageFromResponse
 * @param {Object} data The response
 * @throws {Error} If the response is empty or doesn't contain data about the
 *  page
 * @returns {Object}
 */
function extractPageFromResponse( data ) {
	if (
		data.query &&
		data.query.pages &&
		data.query.pages.length
	) {
		return data.query.pages[ 0 ];
	}

	throw new Error( 'API response `query.pages` is empty.' );
}

/**
 * Converts the API response to a preview model.
 *
 * @function
 * @name MediaWikiGateway#convertPageToModel
 * @param {Object} page
 * @returns {PreviewModel}
 */
function convertPageToModel( page ) {
	return createModel(
		page.title,
		page.canonicalurl,
		page.pagelanguagehtmlcode,
		page.pagelanguagedir,
		page.extract,
		page.thumbnail
	);
}
