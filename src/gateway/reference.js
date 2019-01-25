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
	 * @returns {AbortPromise<PreviewModel>}
	 */
	function fetchPreviewForTitle( title ) {
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

		return $.Deferred().resolve( {
			// TODO: Provide different titles depending on the type of reference (e.g. "Book")
			// title: '',
			url: `#${ id }`,
			// TODO: Can probably be removed
			// languageCode: 'en',
			// languageDirection: 'ltr',
			extract: $referenceText.html(),
			type: previewTypes.TYPE_REFERENCE
			// TODO: Can probably be removed
			// thumbnail: '',
			// pageId: '0'
		} ).promise( { abort() {} } );
	}

	return {
		fetchPreviewForTitle
	};
}
