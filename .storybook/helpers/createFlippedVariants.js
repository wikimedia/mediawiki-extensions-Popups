import createPopup from './createPopup';

/**
 * Creates the 4 variants for a preview.
 *
 * @param {ext.popups.PreviewModel} model
 * @return {string}
 */
export default function createFlippedVariants( model ) {
	return `
		${createPopup( model, { flippedX: false, flippedY: false } )}
		${createPopup( model, { flippedX: true, flippedY: false } )}
		${createPopup( model, { flippedX: false, flippedY: true } )}
		${createPopup( model, { flippedX: true, flippedY: true } )}
	`;
}
