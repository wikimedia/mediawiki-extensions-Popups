/**
 * @module popup
 */

import { escapeHTML } from '../templateUtil';

/**
 * @param {ext.popups.previewTypes} type
 * @param {string} html HTML string.
 * @return {JQuery}
 */
export function renderPopup( type, html ) {
	type = escapeHTML( type );

	return $( $.parseHTML( `
	<div class='mwe-popups mwe-popups-type-${type}' aria-hidden>
		<div class='mwe-popups-container'>${html}</div>
	</div>
	`.trim() ) );
}
