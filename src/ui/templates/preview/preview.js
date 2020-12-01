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
	const $popup = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );

	// The following classes are used here:
	// * mw-icon-preview-reference
	// * mw-icon-preview-unknown
	// * mw-icon-preview-generic
	// * mw-icon-preview-disambiguation
	$popup.find( '.mw-ui-icon ' ).addClass( `mw-ui-icon-preview-${model.type}` );
	$popup.find( '.mwe-popups-extract' ).attr( 'href', model.url );
	$popup.find( '.mwe-popups-message' ).html( escapeHTML( extractMsg ) );
	$popup.find( '.mwe-popups-read-link' )
		.html( escapeHTML( linkMsg ) )
		.attr( 'href', model.url );
	if ( showTitle ) {
		$popup.find( '.mwe-popups-title' ).html( escapeHTML( model.title ) );
	} else {
		$popup.find( '.mwe-popups-title' ).remove();
	}

	return $popup;
}
