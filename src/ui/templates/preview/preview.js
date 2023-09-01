/**
 * @module preview
 */

import { renderPopup } from '../popup/popup';
import { createNodeFromTemplate, escapeHTML } from '../templateUtil';

const templateHTML = `
	<div class="mwe-popups-container">
		<a class="mwe-popups-extract">
       		<div class="mwe-popups-scroll">
				<strong class="mwe-popups-title">
					<span class="popups-icon"></span>
				</strong>
				<div class="mwe-popups-message"></div>
			</div>
		</a>
		<footer>
			<a class="mwe-popups-read-link"></a>
		</footer>
	</div>
`;

/**
 * Render generic and disambiguation previews
 *
 * @param {ext.popups.PagePreviewModel} model
 * @param {string|null} message
 * @param {string} linkMsg
 * @return {JQuery}
 */
export function renderPreview(
	model, message, linkMsg
) {
	const popup = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );

	// The following classes are used here:
	// * popups-icon--preview-unknown
	// * popups-icon--preview-generic
	// * popups-icon--preview-disambiguation
	popup.querySelector( '.popups-icon' ).classList.add( `popups-icon--preview-${model.type}` );
	popup.querySelector( '.mwe-popups-extract' ).setAttribute( 'href', model.url );
	const messageElement = popup.querySelector( '.mwe-popups-message' );
	if ( message ) {
		messageElement.innerHTML = escapeHTML( message );
	} else {
		messageElement.remove();
	}
	const readLink = popup.querySelector( '.mwe-popups-read-link' );
	readLink.innerHTML = escapeHTML( linkMsg );
	readLink.setAttribute( 'href', model.url );
	const title = popup.querySelector( '.mwe-popups-title' );
	title.innerHTML += escapeHTML( model.title );
	return popup;
}
