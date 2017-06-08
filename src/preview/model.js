/**
 * @module preview/model
 */

var TYPE_GENERIC = 'generic',
	TYPE_PAGE = 'page';

/**
 * @constant {String}
 */
exports.TYPE_GENERIC = TYPE_GENERIC;

/**
 * @constant {String}
 */
exports.TYPE_PAGE = TYPE_PAGE;

/**
 * @typedef {Object} PreviewModel
 * @property {String} title
 * @property {String} url The canonical URL of the page being previewed
 * @property {String} languageCode
 * @property {String} languageDirection Either "ltr" or "rtl"
 * @property {?Array} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed
 * @property {String} type Either "EXTRACT" or "GENERIC"
 * @property {?Object} thumbnail
 *
 * @global
 */

/**
 * Creates a preview model.
 *
 * @param {String} title
 * @param {String} url The canonical URL of the page being previewed
 * @param {String} languageCode
 * @param {String} languageDirection Either "ltr" or "rtl"
 * @param {?Array} extract
 * @param {?Object} thumbnail
 * @return {PreviewModel}
 */
exports.createModel = function createModel(
	title,
	url,
	languageCode,
	languageDirection,
	extract,
	thumbnail
) {
	var processedExtract = processExtract( extract );

	return {
		title: title,
		url: url,
		languageCode: languageCode,
		languageDirection: languageDirection,
		extract: processedExtract,
		type: processedExtract === undefined ? TYPE_GENERIC : TYPE_PAGE,
		thumbnail: thumbnail
	};
};

/**
 * Processes the extract returned by the TextExtracts MediaWiki API query
 * module.
 *
 * If the extract is `undefined`, `null`, or empty, then `undefined` is
 * returned.
 *
 * @param {?Array} extract
 * @return {?String}
 */
function processExtract( extract ) {
	if ( extract === undefined || extract.length === 0 ) {
		return undefined;
	}
	return extract;
}
