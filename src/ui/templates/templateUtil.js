/**
 * @module templateUtil
 */

/**
 * @param {string} str
 * @return {string} The string with any HTML entities escaped.
 */
export function escapeHTML( str ) {
	return mw.html.escape( str );
}
