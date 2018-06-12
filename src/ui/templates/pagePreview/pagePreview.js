/**
 * @module pagePreview
 */

import { renderPopup } from '../popup/popup';

/**
 * @param {ext.popups.PreviewModel} model
 * @param {boolean} hasThumbnail
 * @return {string} HTML string.
 */
export function renderPagePreview(
	{ url, type, languageCode, languageDirection }, hasThumbnail
) {
	return renderPopup( type,
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
