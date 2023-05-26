/**
 * @module popup
 */

import { createNodeFromTemplate } from '../templateUtil';

const templateHTML = `
	<div class="mwe-popups" aria-hidden></div>
`;
/**
 * @param {ext.popups.previewTypes} type
 * @param {Element} element The contents of the popup.
 * @return {Element}
 */

export function renderPopup( type, container ) {
	const element = createNodeFromTemplate( templateHTML );
	// The following classes are used here:
	// * mwe-popups-type-reference
	// * mwe-popups-type-unknown
	// * mwe-popups-type-generic
	// * mwe-popups-type-disambiguation
	element.className = `mwe-popups mwe-popups-type-${type}`;
	container.className = 'mwe-popups-container';
	element.appendChild( container );
	return element;
}
