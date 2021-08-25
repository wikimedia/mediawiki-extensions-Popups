import {renderPagePreview} from '../pagePreview/pagePreview';
import {escapeHTML} from '../templateUtil';

const mw = mediaWiki;

export function renderPagePreviewWithButton(model, thumbnail) {
	const url = escapeHTML(model.url);
	const $el = renderPagePreview(model, thumbnail)

	const buttonSection = $('<div class="mwe-popups-buttons-section"></div>')
	buttonSection.append(`<a href="${url}" target="_blank" class="wds-button">${mw.msg('popups-fandom-action-button')}</a>`);

	$el.find('.mwe-popups-container')
		.prepend(`<div class="mwe-popups-header">${mw.msg('popups-fandom-header-text')}</div>`)
		.append(buttonSection);
	return $el;
}
