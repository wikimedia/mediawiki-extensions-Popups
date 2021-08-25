import {renderPagePreviewWithButton} from '../pagePreviewWithButton/pagePreviewWithButton';
import {escapeHTML} from '../templateUtil';
import {SIZES} from '../../thumbnail';

export function renderPagePreviewWithImage(model, thumbnail) {
	const $el = renderPagePreviewWithButton(model, thumbnail)

	// If there is no thumbnail we cannot do anything. For now display normal element with buttons
	if (!thumbnail) {
		return $el;
	}

	// Remove unnecessary elements
	$el.find('.mwe-popups-header').remove();
	$el.find('.mwe-popups-extract').remove();

	// Adjust width and height of overflow to match actual image size
	const maxHeight = thumbnail.isTall ? SIZES.portraitImage.h : SIZES.landscapeImage.h;
	const thumbHeight = maxHeight < thumbnail.height ? maxHeight : thumbnail.height;
	const $overflow = $('<span class="mwe-popups-overflow"></span>')
		.css({
			width: '100%',
			height: thumbHeight
		});

	const title = escapeHTML(model.title);
	const $title = $(`<h4 class="mwe-popups-overflow-title">${title}</h4>`)
		.css({
			top: thumbHeight * 0.2 + "px"
		});
	$overflow.append($title);

	const $imageContainer = $el.find('.mwe-popups-discreet')
		.prepend($overflow)


	// We display all images in landscape view, therefore we need to put image in the middle
	thumbnail.isTall && $imageContainer.find('svg').css({
		display: 'block',
		margin: '0 auto'
	});

	return $el;
}
