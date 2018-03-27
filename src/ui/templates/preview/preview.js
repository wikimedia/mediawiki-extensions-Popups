/**
 * @module preview
 */

import { escapeHTML } from '../templateUtil';

/**
 * @param {ext.popups.PreviewModel} model
 * @param {boolean} showTitle
 * @param {string} extractMsg
 * @param {string} linkMsg
 * @return {string} HTML string.
 */
export function renderPreview(
	{ title, url, type }, showTitle, extractMsg, linkMsg
) {
	title = escapeHTML( title );
	extractMsg = escapeHTML( extractMsg );
	linkMsg = escapeHTML( linkMsg );
	return `
	<div class='mwe-popups mwe-popups-type-${ type }' role='tooltip' aria-hidden>
		<div class='mwe-popups-container'>
			<div class='mw-ui-icon mw-ui-icon-element mw-ui-icon-preview-${ type }'></div>
			${ showTitle ? `<strong class='mwe-popups-title'>${ title }</strong>` : '' }
			<a href='${ url }' class='mwe-popups-extract'>
					<span class='mwe-popups-message'>${ extractMsg }</span>
			</a>
			<footer>
				<a href='${ url }' class='mwe-popups-read-link'>${ linkMsg }</a>
			</footer>
		</div>
	</div>
	`.trim();
}
