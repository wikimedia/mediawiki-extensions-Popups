/**
 * @module referencePreview
 */

import { renderPopup } from '../popup/popup';
import { escapeHTML } from '../templateUtil';

const mw = mediaWiki;

/**
 * @param {ext.popups.PreviewModel} model
 * @return {string} HTML string.
 */
export function renderReferencePreview(
	model
) {
	// TODO: Possibly remove this unused boolean flag.
	const showTitle = true,
		// TODO: Implement a fallback to the default localized title "Footnote".
		title = escapeHTML( model.title ),
		linkMsg = mw.message( 'popups-refpreview-jump-to-reference' ).escaped();

	return renderPopup( model.type,
		`
			${ showTitle ? `<strong class='mwe-popups-title'>${ title }</strong>` : '' }
			<div class='mwe-popups-extract'>
				<span class='mwe-popups-message'>${ model.extract }</span>
			</div>
			<footer>
				<a href='${ model.url }' class='mwe-popups-read-link'>${ linkMsg }</a>
			</footer>
		`
	);
}
