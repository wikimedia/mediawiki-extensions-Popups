var formatter = require( '../../formatter' ),
	restbaseProvider = require( '../restProvider' );

/**
 * Creates an instance of the RESTBase gateway that returns plain text
 *
 * This gateway differs from the {@link MediaWikiGateway MediaWiki gateway} in
 * that it fetches page data from [the RESTBase page summary endpoint][0].
 *
 * [0]: https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
 *
 * @param {Function} ajax A function with the same signature as `jQuery.ajax`
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {Number} config.THUMBNAIL_SIZE The length of the major dimension of
 *  the thumbnail.
 * @returns {RESTBaseGateway}
 */
module.exports = function createRESTBaseGateway( ajax, config ) {
	return restbaseProvider( ajax, config, parsePlainTextResponse );
};

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @returns {Array} An array of DOM Elements
 */
function parsePlainTextResponse( page ) {
	return formatter.formatPlainTextExtract( page.extract, page.title );
}
