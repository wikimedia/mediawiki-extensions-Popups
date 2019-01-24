/**
 * @module gateway/reference
 */

import { previewTypes } from '../preview/model';

const mw = mediaWiki,
	$ = jQuery;

/**
 * @return {Gateway}
 */
export default function createReferenceGateway() {
	/**
	 * @param {mw.Title} title
	 * @returns {AbortPromise<PreviewModel>}
	 */
	function fetchPreviewForTitle( title ) {
		const id = title.getFragment();

		return $.Deferred().resolve( {
			title: mw.message( 'popups-refpreview-footnote' ).text(),
			url: `#${id}`,
			// TODO: Can probably be removed
			// languageCode: 'en',
			// languageDirection: 'ltr',
			extract: $( `#${id} .reference-text` ).html(),
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
