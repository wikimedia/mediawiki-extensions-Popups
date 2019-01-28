/**
 * @module pagePreview
 */

import { renderPopup } from '../popup/popup';
import { escapeHTML } from '../templateUtil';

/**
 * @param {ext.popups.PreviewModel} model
 * @param {boolean} hasThumbnail
 * @return {string} HTML string.
 */
export function renderPagePreview(
	model, hasThumbnail
) {
	const url = escapeHTML( model.url ),
		languageCode = escapeHTML( model.languageCode ),
		languageDirection = escapeHTML( model.languageDirection );

	return renderPopup( model.type,
		`
			${ hasThumbnail ? `<a href='${ url }' class='mwe-popups-discreet'></a>` : '' }
			<a dir='${ languageDirection }' lang='${ languageCode }' class='mwe-popups-extract' href='${ url }'></a>
			<footer>
				<a class='mwe-popups-settings-icon'>
					<span class="mw-ui-icon mw-ui-icon-element mw-ui-icon-popups-settings"></span>
				</a>
			</footer>
		`
	);
}
