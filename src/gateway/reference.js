/**
 * @module gateway/reference
 */

import { previewTypes } from '../preview/model';

/**
 * @return {Gateway}
 */
export default function createReferenceGateway() {

	function scrapeReferenceText( id ) {
		const idSelector = `#${$.escapeSelector( id )}`;

		/**
		 * Same alternative selectors with and without mw-… as in the RESTbased endpoint.
		 *
		 * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$138
		 */
		return $( `${idSelector} .mw-reference-text, ${idSelector} .reference-text` );
	}

	/**
	 * This extracts the type (e.g. "web") from one or more <cite> elements class name lists, as
	 * long as these don't conflict. A "citation" class is always ignored. <cite> elements without
	 * another class (other than "citation") are ignored as well.
	 *
	 * Note this might return multiple types, e.g. <cite class="web citation paywalled"> will be
	 * returned as "web paywalled". Validation must be done in the code consuming this.
	 *
	 * This duplicates the strict type detection from
	 *
	 * @see https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/references/structureReferenceListContent.js$93
	 *
	 * @param {JQuery} $referenceText
	 * @return {string|null}
	 */
	function scrapeReferenceType( $referenceText ) {
		let type = null;

		$referenceText.find( 'cite[class]' ).each( function ( index, el ) {
			const nextType = el.className.replace( /\bcitation\b\s*/g, '' ).trim();

			if ( !type ) {
				type = nextType;
			} else if ( nextType && nextType !== type ) {
				type = null;
				return false;
			}
		} );

		return type;
	}

	/**
	 * @param {mw.Title} title
	 * @param {Element} el
	 * @return {AbortPromise<ReferencePreviewModel>}
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
			url: `#${id}`,
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
