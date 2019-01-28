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
		url = escapeHTML( model.url ),
		linkMsg = escapeHTML( mw.msg( 'popups-refpreview-jump-to-reference' ) );

	return renderPopup( model.type,
		`
			${ showTitle ? `<strong class='mwe-popups-title'>${ title }</strong>` : '' }
			<div class='mwe-popups-extract'>
				<span class='mwe-popups-message'>${ model.extract }</span>
			</div>
			<footer>
				<a href='${ url }' class='mwe-popups-read-link'>${ linkMsg }</a>
			</footer>
		`
	);
}
