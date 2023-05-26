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
 * @param {boolean} withCSSClipPath
 * @param {string} linkTitle
 * @return {Element}
 */
export function renderPagePreview(
	model, thumbnail, withCSSClipPath, linkTitle
) {
	const el = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );

	const linkDiscreet = el.querySelector( '.mwe-popups-discreet' );
	const extract = el.querySelector( '.mwe-popups-extract' );
	extract.setAttribute( 'href', model.url );
	linkDiscreet.setAttribute( 'href', model.url );
	extract.setAttribute( 'dir', model.languageDirection );
	extract.setAttribute( 'lang', model.languageCode );

	el.querySelector( '.mwe-popups-settings-icon' )
		.setAttribute( 'title', linkTitle );

	if ( thumbnail ) {
		el.querySelector( '.mwe-popups-discreet' ).appendChild( thumbnail.el );
	} else {
		linkDiscreet.remove();
	}

	if ( model.extract ) {
		extract.append( ...model.extract );
		const extractWidth = getExtractWidth( thumbnail );
		if ( !withCSSClipPath ) {
			extract.style.width = extractWidth;
			el.querySelector( 'footer' ).style.width = extractWidth;
		}
	}

	return el;
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
