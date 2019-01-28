/**
 * @module popup
 */

import { escapeHTML } from '../templateUtil';

/**
 * @param {ext.popups.previewTypes} type
 * @param {string} html HTML string.
 * @return {string} HTML string.
 */
export function renderPopup( type, html ) {
	type = escapeHTML( type );

	return `
	<div class='mwe-popups mwe-popups-type-${ type }' role='tooltip' aria-hidden>
		<div class='mwe-popups-container'>${ html }</div>
	</div>
	`.trim();
}
