import { SIZES } from '../../src/ui/thumbnail';
import { createPreviewWithType, layoutPreview, getClasses,
	createLayout,
	registerPreviewUI,
	createPagePreview,
	createDisambiguationPreview,
	createReferencePreview,
	pointerSize, landscapePopupWidth, portraitPopupWidth
} from '../../src/ui/renderer.js';
import { previewTypes } from '../../src/preview/model';
import scaleDownThumbnail from './scaleDownThumbnail';

registerPreviewUI( previewTypes.TYPE_PAGE, createPagePreview );
registerPreviewUI( previewTypes.TYPE_REFERENCE, createReferencePreview );
registerPreviewUI( previewTypes.TYPE_DISAMBIGUATION, createDisambiguationPreview );

/**
 * @typedef {LayoutHint}
 * @property {boolean} flippedX
 * @property {boolean} flippedY
 */
/**
 * Creates a static/stateless Popup and returns its HTML.
 *
 * @param {ext.popups.PreviewModel} model
 * @param {LayoutHint} layoutHint
 *
 * @return {string} HTML
 */
function createPopup( model, layoutHint ) {
	if ( model.thumbnail ) {
		model.thumbnail = scaleDownThumbnail( model.thumbnail );
	}

	const preview = createPreviewWithType( model );
	const WINDOW_WIDTH = preview.isTall ? 500 : 500;
	const WINDOW_HEIGHT = preview.isTall ? 450 : 500;
	const LINK_HEIGHT = 40;
	const POPUP_SIZE = preview.isTall ? landscapePopupWidth : portraitPopupWidth;

	const LINK_POS_X = layoutHint.flippedX ?
		WINDOW_WIDTH - LINK_HEIGHT : LINK_HEIGHT;
	const LINK_POS_Y = layoutHint.flippedY ?
		WINDOW_HEIGHT - LINK_HEIGHT :
		- POPUP_SIZE + LINK_HEIGHT;

	const measures = {
		pageX: LINK_POS_X,
		pageY: 0,
		clientY: 0,
		clientRects: [
			{
				top: WINDOW_HEIGHT,
				bottom:  WINDOW_WIDTH
			}
		],
		// Represent link position based on hints
		offset: {
			// control it.
			top: LINK_POS_Y,
			left: 0
		},
		width: POPUP_SIZE,
		height: POPUP_SIZE,
		scrollTop: 0,
		windowWidth: WINDOW_WIDTH,
		windowHeight: WINDOW_HEIGHT
	};

	// Mirror logic in render::createLayout
	const layout = createLayout(
		preview.isTall,
		measures,
		pointerSize,
		model.languageDirection
	);

	const wrapper = document.createElement( 'div' );
	const LANG_DIR = layout.dir === 'rtl' ? layout.dir : 'ltr';
	wrapper.setAttribute( 'dir', LANG_DIR );
	wrapper.setAttribute( 'class', `popups-storybook-example storybook-${LANG_DIR}` );
	wrapper.style.maxHeight = `${WINDOW_HEIGHT}px;`;
	wrapper.style.maxWidth = `${WINDOW_HEIGHT}px;`;
	if ( layout.flippedX ) {
		wrapper.classList.add( 'popups-storybook-example-flipped-x' );
	}
	if ( layout.flippedY ) {
		wrapper.classList.add( 'popups-storybook-example-flipped-y' );
	}
	if ( preview.isTall ) {
		wrapper.classList.add( 'popups-storybook-example-tall' );
	}

	const link = document.createElement( 'a' );
	link.setAttribute( 'href', '#' );
	link.setAttribute( 'class', 'popups-storybook-link' );
	link.textContent = `Page preview ${layout.flippedX ? 'flipped-x' : ''}
		${layout.flippedY ? 'flipped-y' : ''} 
		${preview.isTall ? '(landscape)' : '(portrait)'} 
		${preview.hasThumbnail ? 'with thumbnail' : ''}`;

	wrapper.appendChild( link );
	layoutPreview(
		preview,
		layout,
		getClasses( preview, {
			dir: layout.dir,
			flippedX: layout.flippedX,
			flippedY: layout.flippedY
		} ),
		SIZES.landscapeImage.h,
		pointerSize,
		WINDOW_HEIGHT
	);
	wrapper.appendChild( preview.el );
	return wrapper.outerHTML;
}

export default createPopup;
