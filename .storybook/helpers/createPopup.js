import { SIZES } from '../../src/ui/thumbnail';
import { createPreviewWithType, layoutPreview, getClasses } from '../../src/ui/renderer.js';
import scaleDownThumbnail from './scaleDownThumbnail';

const POINTER_SIZE = 8;

/**
 * Creates a static/stateless Popup adn returns its HTML as DOM.
 *
 * @param {ext.popups.PreviewModel} model
 * @param {object} layout
 *
 * @returns {Element} Popup DOM structure
 */
function createPopup( model, layout ) {
	if ( model.thumbnail ) {
		model.thumbnail = scaleDownThumbnail( model.thumbnail );
	}

	const preview = createPreviewWithType( model );

	Object.assign( layout, { dir: model.languageDirection } );
	layoutPreview(
		preview,
		layout,
		getClasses( preview, {
			flippedX: layout.flippedX,
			flippedY: layout.flippedY
		} ),
		SIZES.landscapeImage.h,
		POINTER_SIZE
	);
	return preview.el[ 0 ].outerHTML;
}

export default createPopup;
