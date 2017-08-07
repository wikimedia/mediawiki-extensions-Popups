/**
 * @module preview/model
 */

/**
 * @constant {String}
 */
export var TYPE_GENERIC = 'generic';

/**
 * @constant {String}
 */
export var TYPE_PAGE = 'page'; // eslint-disable-line one-var

/**
 * @typedef {Object} PreviewModel
 * @property {String} title
 * @property {String} url The canonical URL of the page being previewed
 * @property {String} languageCode
 * @property {String} languageDirection Either "ltr" or "rtl"
 * @property {?Array} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed
 * @property {String} type Either "extract" or "generic"
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
export function createModel(
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
}

/**
 * Creates an empty preview model.
 *
 * @param {String} title
 * @return {PreviewModel}
 */
export function createNullModel( title ) {
	return createModel( title, '', '', '', [], '' );
}

/**
 * Processes the extract returned by the TextExtracts MediaWiki API query
 * module.
 *
 * If the extract is `undefined`, `null`, or empty, then `undefined` is
 * returned.
 *
 * @param {Array|undefined|null} extract
 * @return {Array|undefined} Array when extract is an not empty array, undefined otherwise
 */
function processExtract( extract ) {
	if ( extract === undefined || extract === null || extract.length === 0 ) {
		return undefined;
	}
	return extract;
}
