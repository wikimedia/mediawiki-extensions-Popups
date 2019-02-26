/**
 * @module gateway/reference
 */

import { previewTypes } from '../preview/model';

const $ = jQuery;

/**
 * @return {Gateway}
 */
export default function createReferenceGateway() {

	function scrapeReferenceText( id ) {
		const idSelector = `#${ $.escapeSelector( id ) }`;

		/**
		 * Same alternative selectors with and without mw-… as in the RESTbased endpoint.
		 * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$138
		 */
		return $( `${ idSelector } .mw-reference-text, ${ idSelector } .reference-text` );
	}

	/**
	 * This duplicates the strict type detection from
	 * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$93
	 *
	 * @param {JQuery} $referenceText
	 * @returns {string|null}
	 */
	function scrapeReferenceType( $referenceText ) {
		const $cite = $referenceText.find( 'cite[class]' );
		if ( $cite.length === 1 ) {
			return $cite.attr( 'class' ).replace( /\bcitation\b/g, '' ).trim();
		}

		return null;
	}

	/**
	 * @param {mw.Title} title
	 * @param {Element} el
	 * @returns {AbortPromise<PreviewModel>}
	 */
	function fetchPreviewForTitle( title, el ) {
		// Need to encode the fragment again as mw.Title returns it as decoded text
		const id = title.getFragment().replace( / /g, '_' ),
			$referenceText = scrapeReferenceText( id );

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
			referenceType: scrapeReferenceType( $referenceText ),
			sourceElementId: el && el.parentNode && el.parentNode.id
		};

		return $.Deferred().resolve( model ).promise( { abort() {} } );
	}

	return {
		fetchPreviewForTitle
	};
}
