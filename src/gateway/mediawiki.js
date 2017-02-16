// Public and private cache lifetime (5 minutes)
var CACHE_LIFETIME = 300,
	createModel = require( '../preview/model' ).createModel;

/**
 * MediaWiki API gateway factory
 *
 * @param {mw.Api} api
 * @param {mw.ext.constants} config
 * @returns {ext.popups.Gateway}
 */
function createMediaWikiApiGateway( api, config ) {

	/**
	 * Fetch page data from the API
	 *
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

	/**
	 * Get the page summary from the api and transform the data
	 *
	 * @param {String} title
	 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
	 */
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
}

/**
 * Extract page data from the MediaWiki API response
 *
 * @param {Object} data API response data
 * @throws {Error} Throw an error if page data cannot be extracted,
 * i.e. if the response is empty,
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
 * Transform the MediaWiki API response to a preview model
 *
 * @param {Object} page
 * @returns {ext.popups.PreviewModel}
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

module.exports = createMediaWikiApiGateway;
