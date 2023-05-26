/**
 * @module preview
 */

import { renderPopup } from '../popup/popup';
import { createNodeFromTemplate, escapeHTML } from '../templateUtil';

const templateHTML = `
	<div class="mwe-popups-container">
		<div class="mw-ui-icon mw-ui-icon-element"></div>
		<strong class="mwe-popups-title"></strong>
		<a class="mwe-popups-extract">
			<span class="mwe-popups-message"></span>
		</a>
		<footer>
			<a class="mwe-popups-read-link"></a>
		</footer>
	</div>
`;

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
	const popup = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );

	// The following classes are used here:
	// * mw-icon-preview-reference
	// * mw-icon-preview-unknown
	// * mw-icon-preview-generic
	// * mw-icon-preview-disambiguation
	popup.querySelector( '.mw-ui-icon' ).classList.add( `mw-ui-icon-preview-${model.type}` );
	popup.querySelector( '.mwe-popups-extract' ).setAttribute( 'href', model.url );
	popup.querySelector( '.mwe-popups-message' ).innerHTML = escapeHTML( extractMsg );
	const readLink = popup.querySelector( '.mwe-popups-read-link' );
	readLink.innerHTML = escapeHTML( linkMsg );
	readLink.setAttribute( 'href', model.url );
	const title = popup.querySelector( '.mwe-popups-title' );
	if ( showTitle ) {
		title.innerHTML = escapeHTML( model.title );
	} else {
		title.remove();
	}

	return popup;
}
