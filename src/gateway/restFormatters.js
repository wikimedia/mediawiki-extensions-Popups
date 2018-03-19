import * as formatter from '../formatter';

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */
export function parseHTMLResponse( page ) {
	const extract = page.extract_html;

	return extract.length === 0 ? [] : $.parseHTML( extract );
}

/**
 * Prepare extract
 * @param {Object} page Rest response
 * @return {Array} An array of DOM Elements
 */
export function parsePlainTextResponse( page ) {
	return formatter.formatPlainTextExtract( page.extract, page.title );
}
