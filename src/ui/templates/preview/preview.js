/**
 * @module preview
 */

import { renderPopup } from '../popup/popup';
import { escapeHTML } from '../templateUtil';

/**
 * @param {ext.popups.PagePreviewModel} model
 * @param {boolean} showTitle
 * @param {string} extractMsg
 * @param {string} linkMsg
 * @return {JQuery}
 */
export function renderPreview(
	model, showTitle, extractMsg, linkMsg
) {
	const title = escapeHTML( model.title ),
		url = escapeHTML( model.url ),
		type = escapeHTML( model.type );
	extractMsg = escapeHTML( extractMsg );
	linkMsg = escapeHTML( linkMsg );

	return renderPopup( model.type,
		`
			<div class='mw-ui-icon mw-ui-icon-element mw-ui-icon-preview-${type}'></div>
			${showTitle ? `<strong class='mwe-popups-title'>${title}</strong>` : ''}
			<a href='${url}' class='mwe-popups-extract'>
				<span class='mwe-popups-message'>${extractMsg}</span>
			</a>
			<footer>
				<a href='${url}' class='mwe-popups-read-link'>${linkMsg}</a>
			</footer>
		`
	);
}
