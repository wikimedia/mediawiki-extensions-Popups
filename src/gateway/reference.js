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
		const id = title.getFragment().replace( / /g, '_' );

		return $.Deferred().resolve( {
			// TODO: Provide different titles depending on the type of reference (e.g. "Book")
			// title: '',
			url: `#${ id }`,
			// TODO: Can probably be removed
			// languageCode: 'en',
			// languageDirection: 'ltr',
			extract: $( `#${ $.escapeSelector( id ) } .reference-text` ).html(),
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
