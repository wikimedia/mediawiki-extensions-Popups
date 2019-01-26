/**
 * @module referencePreview
 */

import { renderPopup } from '../popup/popup';
import { escapeHTML } from '../templateUtil';

const mw = mediaWiki;

/**
 * @param {ext.popups.PreviewModel} model
 * @return {jQuery}
 */
export function renderReferencePreview(
	model
) {
	const title = escapeHTML( model.title || mw.msg( 'popups-refpreview-footnote' ) ),
		url = escapeHTML( model.url ),
		linkMsg = escapeHTML( mw.msg( 'popups-refpreview-jump-to-reference' ) );

	const $el = $( $.parseHTML( renderPopup( model.type,
		`
			<strong class='mwe-popups-title'>
				<span class='mw-ui-icon mw-ui-icon-element mw-ui-icon-preview-reference'></span>
				${ title }
			</strong>
			<div class='mwe-popups-extract'>
				<span class='mwe-popups-message'>${ model.extract }</span>
			</div>
			<footer>
				<a href='${ url }' class='mwe-popups-read-link'>${ linkMsg }</a>
			</footer>
		`
	) ) );

	// Make sure to not destroy existing targets, if any
	$el.find( '.mwe-popups-extract a[href]:not([target])' ).each( ( i, a ) => {
		a.target = '_blank';
		// Don't let the external site access and possibly manipulate window.opener.location
		a.rel = `${ a.rel ? `${ a.rel } ` : '' }noopener`;
	} );

	return $el;
}
