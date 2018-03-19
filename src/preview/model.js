/**
 * @module preview/model
 */

/**
 * Page Preview types as defined in Schema:Popups
 * https://meta.wikimedia.org/wiki/Schema:Popups
 *
 * @constant {Object}
 */
const previewTypes = {
	/** empty preview */
	TYPE_GENERIC: 'generic',
	/** standard preview */
	TYPE_PAGE: 'page',
	/** disambiguation preview */
	TYPE_DISAMBIGUATION: 'disambiguation'
};

export { previewTypes };

/**
 * Preview Model
 *
 * @typedef {Object} PreviewModel
 * @property {String} title
 * @property {String} url The canonical URL of the page being previewed
 * @property {String} languageCode
 * @property {String} languageDirection Either "ltr" or "rtl"
 * @property {?Array} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed; this can be used to present default or error states
 * @property {String} type One of TYPE_GENERIC, TYPE_PAGE, TYPE_DISAMBIGUATION
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
 * @param {String} type
 * @param {?Object} thumbnail
 * @param {?Number} pageId
 * @return {PreviewModel}
 */
export function createModel(
	title,
	url,
	languageCode,
	languageDirection,
	extract,
	type,
	thumbnail,
	pageId
) {
	const processedExtract = processExtract( extract ),
		previewType = getPreviewType( type, processedExtract );

	return {
		title,
		url,
		languageCode,
		languageDirection,
		extract: processedExtract,
		type: previewType,
		thumbnail,
		pageId
	};
}

/**
 * Creates an empty preview model.
 *
 * @param {!String} title
 * @param {!String} url
 * @return {!PreviewModel}
 */
export function createNullModel( title, url ) {
	return createModel( title, url, '', '', [], '' );
}

/**
 * Processes the extract returned by the TextExtracts MediaWiki API query
 * module.
 *
 * If the extract is `undefined`, `null`, or empty, then `undefined` is
 * returned.
 *
 * @param {Array|undefined|null} extract
 * @return {Array|undefined} Array when extract is an not empty array, undefined
 *  otherwise
 */
function processExtract( extract ) {
	if ( extract === undefined || extract === null || extract.length === 0 ) {
		return undefined;
	}
	return extract;
}

/**
 * Determines the preview type based on whether or not:
 * a. Is the preview empty.
 * b. The preview type matches one of previewTypes.
 * c. Assume standard page preview if both above are false
 *
 * @param {String} type
 * @param {string} [processedExtract]
 * @return {String} one of TYPE_GENERIC, TYPE_PAGE, TYPE_DISAMBIGUATION.
 */

function getPreviewType( type, processedExtract ) {

	if ( processedExtract === undefined ) {
		return previewTypes.TYPE_GENERIC;
	}

	switch ( type ) {
		case previewTypes.TYPE_GENERIC:
		case previewTypes.TYPE_DISAMBIGUATION:
		case previewTypes.TYPE_PAGE:
			return type;
		default:
			/**
			 * Assume type="page" if extract exists & not one of previewTypes.
			 * Note:
			 * - Restbase response includes "type" prop but other gateways don't.
			 * - event-logging Schema:Popups requires type="page" but restbase
			 * provides type="standard". Model must conform to event-logging schema.
			 */
			return previewTypes.TYPE_PAGE;
	}
}
