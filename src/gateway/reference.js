/**
 * @module gateway/reference
 */

import { previewTypes } from '../preview/model';

const $ = jQuery;

/**
 * @return {Gateway}
 */
export default function createReferenceGateway() {
	/**
	 * @param {mw.Title} title
	 * @param {Element} el
	 * @returns {AbortPromise<PreviewModel>}
	 */
	function fetchPreviewForTitle( title, el ) {
		// Need to encode the fragment again as mw.Title returns it as decoded text
		const id = title.getFragment().replace( / /g, '_' ),
			$referenceText = $( `#${ $.escapeSelector( id ) } .reference-text` );

		if ( !$referenceText.length ) {
			return $.Deferred().reject(
				'Footnote not found',
				// Required to set `showNullPreview` to false and not open an error popup
				{ textStatus: 'abort', xhr: { readyState: 0 } }
			).promise( { abort() {} } );
		}

		const model = {
			url: `#${ id }`,
			extract: $referenceText.html(),
			type: previewTypes.TYPE_REFERENCE,
			sourceElementId: el && el.parentNode && el.parentNode.id
		};

		return $.Deferred().resolve( model ).promise( { abort() {} } );
	}

	return {
		fetchPreviewForTitle
	};
}
