/**
 * @module pagePreview
 */

/**
 * @param {ext.popups.PreviewModel} model
 * @param {boolean} hasThumbnail
 * @return {string} HTML string.
 */
export function renderPagePreview(
	{ url, languageCode, languageDirection }, hasThumbnail
) {
	return `
		<div class='mwe-popups' role='tooltip' aria-hidden>
			<div class='mwe-popups-container'>
				${ hasThumbnail ? `<a href='${ url }' class='mwe-popups-discreet'></a>` : '' }
				<a dir='${ languageDirection }' lang='${ languageCode }' class='mwe-popups-extract' href='${ url }'></a>
				<footer>
					<a class='mwe-popups-settings-icon mw-ui-icon mw-ui-icon-element mw-ui-icon-popups-settings'></a>
				</footer>
			</div>
		</div>
	`.trim();
}
