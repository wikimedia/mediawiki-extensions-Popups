/**
 * @module pagePreview
 */

import { renderPopup } from '../popup/popup';
import { createNodeFromTemplate } from '../templateUtil';

const defaultExtractWidth = 215;
const templateHTML = `
<div>
    <a class="mwe-popups-discreet"></a>
    <a class="mwe-popups-extract"></a>
    <footer>
        <a class="mwe-popups-settings-icon">
            <span class="mw-ui-icon mw-ui-icon-element mw-ui-icon-small mw-ui-icon-settings"></span>
        </a>
    </footer>
</div>
	`;

/**
 * @param {ext.popups.PagePreviewModel} model
 * @param {ext.popups.Thumbnail|null} thumbnail
 * @return {JQuery}
 */
export function renderPagePreview(
	model, thumbnail
) {
	const $el = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );

	$el.find( '.mwe-popups-discreet, .mwe-popups-extract' )
		.attr( 'href', model.url );

	$el.find( '.mwe-popups-extract' )
		.attr( 'dir', model.languageDirection )
		.attr( 'lang', model.languageCode );

	if ( thumbnail ) {
		$el.find( '.mwe-popups-discreet' ).append( thumbnail.el );
	} else {
		$el.find( '.mwe-popups-discreet' ).remove();
	}

	if ( model.extract ) {
		const extractWidth = getExtractWidth( thumbnail );
		$el.find( '.mwe-popups-extract' )
			.css( 'width', extractWidth )
			.append( model.extract );
		$el.find( 'footer' ).css( 'width', extractWidth );
	}

	return $el;
}

export { defaultExtractWidth }; // for testing

/**
 * Calculates width of extract based on the associated thumbnail
 *
 * @param {ext.popups.Thumbnail|null} thumbnail model
 * @return {string} representing the css width attribute to be
 *   used for the extract
 */
export function getExtractWidth( thumbnail ) {
	return thumbnail && thumbnail.isNarrow ? `${defaultExtractWidth + thumbnail.offset}px` : '';
}
