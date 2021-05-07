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
	 * Attempts to find a single reference type identifier, limited to a list of known types.
	 * - When a `class="…"` attribute mentions multiple known types, the last one is used, following
	 *   CSS semantics.
	 * - When there are multiple <cite> tags, the first with a known type is used.
	 *
	 * @param {JQuery} $referenceText
	 * @return {string|null}
	 */
	function scrapeReferenceType( $referenceText ) {
		const KNOWN_TYPES = [ 'book', 'journal', 'news', 'note', 'web' ];
		let type = null;
		$referenceText.find( 'cite[class]' ).each( ( index, element ) => {
			const classNames = element.className.split( /\s+/ );
			for ( let i = classNames.length; i--; ) {
				if ( KNOWN_TYPES.indexOf( classNames[ i ] ) !== -1 ) {
					type = classNames[ i ];
					return false;
				}
			}
		} );
		return type;
	}

	/**
	 * @param {mw.Title} title
	 * @param {HTMLAnchorElement} el
	 * @return {AbortPromise<ReferencePreviewModel>}
	 */
	function fetchPreviewForTitle( title, el ) {
		// Need to encode the fragment again as mw.Title returns it as decoded text
		const id = title.getFragment().replace( / /g, '_' ),
			$referenceText = scrapeReferenceText( id );

		if ( !$referenceText.length ||
			// Skip references that don't contain anything but whitespace, e.g. a single &nbsp;
			( !$referenceText.text().trim() && !$referenceText.children().length )
		) {
			return $.Deferred().reject(
				'Footnote not found or empty',
				// Required to set `showNullPreview` to false and not open an error popup
				{ textStatus: 'abort', xhr: { readyState: 0 } }
			).promise( { abort() {} } );
		}

		const model = {
			url: `#${id}`,
			extract: $referenceText.html(),
			type: previewTypes.TYPE_REFERENCE,
			referenceType: scrapeReferenceType( $referenceText ),
			// Note: Even the top-most HTMLHtmlElement is guaranteed to have a parent.
			sourceElementId: el.parentNode.id
		};

		return $.Deferred().resolve( model ).promise( { abort() {} } );
	}

	return {
		fetchPreviewForTitle
	};
}
