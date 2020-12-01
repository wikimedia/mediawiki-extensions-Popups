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

const templates = {};
/**
 * @param {string} html markup of the template
 * @return {Element} a cloned root element of the template
 */
export function createNodeFromTemplate( html ) {
	if ( !templates[ html ] ) {
		// TODO: use <template> element when IE11 dies
		const div = document.createElement( 'div' );
		div.innerHTML = html;
		templates[ html ] = div.firstElementChild;
	}

	return templates[ html ].cloneNode( true );
}
