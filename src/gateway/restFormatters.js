import * as formatter from '../formatter';

/**
 * Prepare extract
 *
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */
export function parseHTMLResponse( page ) {
	const extract = page.extract_html;
	const extractNode = document.createElement( 'div' );
	extractNode.innerHTML = extract;
	return extract.length === 0 ? [] : extractNode.childNodes;
}

/**
 * Prepare extract
 *
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */
export function parsePlainTextResponse( page ) {
	return formatter.formatPlainTextExtract( page.extract, page.title );
}
