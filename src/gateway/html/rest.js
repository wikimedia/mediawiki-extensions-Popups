var formatter = require( '../../formatter' ),
	restbaseProvider = require( '../restProvider' ),
	$ = jQuery;

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
 * @param {Number} config.THUMBNAIL_SIZE The length of the major dimension of
 *  the thumbnail.
 * @returns {RESTBaseGateway}
 */
module.exports = function createRESTHTMLBaseGateway( ajax, config ) {
	return restbaseProvider( ajax, config, parseHTMLResponse );
};

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @returns {Array} An array of DOM Elements
 */
function parseHTMLResponse( page ) {
	var extract = page.extract_html;
	extract = formatter.removeTrailingEllipsis( extract );
	extract = formatter.removeParentheticals( extract );

	return extract.length === 0 ? [] : $.parseHTML( extract );
}
