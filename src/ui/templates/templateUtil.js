/**
 * @module templateUtil
 */

const mw = window.mediaWiki;

/**
 * @param {string} str
 * @return {string} The string with any HTML entities escaped.
 */
export function escapeHTML( str ) {
	return mw.html.escape( str );
}
