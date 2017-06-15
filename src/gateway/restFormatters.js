var formatter = require( '../formatter' );

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @returns {Array} An array of DOM Elements
 */
exports.parseHTMLResponse = function parseHTMLResponse( page ) {
	var extract = page.extract_html;
	extract = formatter.removeTrailingEllipsis( extract );
	extract = formatter.removeParentheticals( extract );

	return extract.length === 0 ? [] : $.parseHTML( extract );
};

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @returns {Array} An array of DOM Elements
 */
exports.parsePlainTextResponse = function parsePlainTextResponse( page ) {
	return formatter.formatPlainTextExtract( page.extract, page.title );
};
