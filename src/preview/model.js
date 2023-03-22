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
	/** Empty preview used in error situations */
	TYPE_GENERIC: 'generic',
	/** Standard page preview with or without thumbnail */
	TYPE_PAGE: 'page',
	/** Disambiguation page preview */
	TYPE_DISAMBIGUATION: 'disambiguation',
	/** Reference preview */
	TYPE_REFERENCE: 'reference'
};

export { previewTypes };

/**
 * Preview Model
 *
 * @typedef {Object} PreviewModel
 * @property {string} url The canonical URL of the page being previewed
 * @property {string} type One of the previewTypes.TYPE_… constants.
 *
 * @global
 */

/**
 * @typedef {Object} PagePreviewModel
 * @extends PreviewModel
 * @property {string} title
 * @property {Array|undefined} extract `undefined` if the extract isn't
 *  viable, e.g. if it's empty after having ellipsis and parentheticals
 *  removed; this can be used to present default or error states
 * @property {string} languageCode
 * @property {string} languageDirection Either "ltr" or "rtl", or an empty string if undefined.
 * @property {{source: string, width: number, height: number}|undefined} thumbnail
 * @property {number} pageId Currently not used by any known popup type.
 *
 * @global
 */

/**
 * @typedef {Object} ReferencePreviewModel
 * @extends PreviewModel
 * @property {string} extract An HTML snippet, not necessarily with a single top-level node
 * @property {string} referenceType A type identifier, e.g. "web"
 * @property {string} sourceElementId ID of the parent element that triggered the preview
 *
 * @global
 */

/**
 * Creates a page preview model.
 *
 * @param {string} title
 * @param {string} url The canonical URL of the page being previewed
 * @param {string} languageCode
 * @param {string} languageDirection Either "ltr" or "rtl"
 * @param {Array|undefined|null} extract
 * @param {string} type
 * @param {{source: string, width: number, height: number}|undefined} [thumbnail]
 * @param {number} [pageId]
 * @return {PagePreviewModel}
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
		previewType = getPagePreviewType( type, processedExtract );

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
 * Creates an empty page preview model.
 *
 * @param {string} title
 * @param {string} url
 * @return {PagePreviewModel}
 */
export function createNullModel( title, url ) {
	return createModel( title, url, '', '', [], '' );
}

/**
 * @param {Element} element
 * @param {string} selector
 * @return {boolean}
 */
const elementMatchesSelector = ( element, selector ) => {
	return element.matches( selector );
};

/**
 * Recursively checks the element and its parents.
 *
 * @param {Element} element
 * @return {Element|null}
 */
export function findNearestEligibleTarget( element ) {
	const selector = selectors.join( ', ' );
	return element.closest( selector );
}

/**
 * @typedef {Object} PreviewType
 * @property {string} name identifier for preview type
 * @property {string} selector a CSS selector
 * @type {PreviewType[]}
 */
const registeredPreviewTypes = [];

/**
 * Determines the applicable popup type based on title and link element.
 *
 * @param {HTMLAnchorElement} el
 * @return {string|null} One of the previewTypes.TYPE_… constants
 */
export function getPreviewType( el ) {
	const candidates = registeredPreviewTypes.filter( ( type ) => elementMatchesSelector( el, type.selector ) );

	// If the filter returned some possibilities, use the last registered one.
	if ( candidates.length > 0 ) {
		return candidates[ candidates.length - 1 ].name;
	}

	return null;
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
 * Determines the page preview type based on whether or not:
 * a. Is the preview empty.
 * b. The preview type matches one of previewTypes.
 * c. Assume standard page preview if both above are false
 *
 * @param {string} type
 * @param {Array|undefined} [processedExtract]
 * @return {string} One of the previewTypes.TYPE_… constants.
 */

function getPagePreviewType( type, processedExtract ) {
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

const selectors = [];

const dwellDelay = {};

/**
 * Determines the delay before showing the preview when dwelling a link.
 *
 * @param {string} type
 * @return {number}
 */
export function getDwellDelay( type ) {
	return dwellDelay[ type ] || 0;
}

/***
 * Set the delay before showing the preview when dwelling a link.
 *
 * @param {string} type
 * @param {number} delay
 */
export function setDwellTime( type, delay ) {
	dwellDelay[ type ] = delay;
}

/**
 * Allows extensions to register their own page previews.
 *
 * @stable
 * @param {string} type
 * @param {string} selector A valid CSS selector to associate preview with
 * @param {number} [delay] optional delay between hovering and displaying preview.
 *  If not defined, delay will be zero.
 */
export function registerModel( type, selector, delay ) {
	selectors.push( selector );
	registeredPreviewTypes.push( {
		name: type,
		selector
	} );
	if ( delay ) {
		setDwellTime( type, delay );
	}
}

/**
 * Check whether any kind of preview is enabled.
 *
 * @return {boolean}
 */
export function isAnythingEligible() {
	return !!selectors.length;
}

export const test = {
	/** For testing only */
	reset: () => {
		while ( registeredPreviewTypes.length ) {
			registeredPreviewTypes.pop();
		}
	}
};
