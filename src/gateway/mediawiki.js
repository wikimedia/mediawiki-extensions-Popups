/**
 * @module gateway/mediawiki
 */

import { createModel } from '../preview/model';
import * as formatter from '../formatter';
import { abortablePromise } from './index.js';

// Public and private cache lifetime (5 minutes)
//
// FIXME: Move this to src/constants.js.
const CACHE_LIFETIME = 300;

/**
 * @typedef {Gateway} MediaWikiGateway
 * @property {function(Object): Object} extractPageFromResponse
 * @property {function(Object): Object} formatPlainTextExtract
 */

/**
 * Creates an instance of the MediaWiki API gateway.
 *
 * @param {mw.Api} api
 * @param {Object} config Configuration that affects the major behavior of the
 *  gateway.
 * @param {number} config.THUMBNAIL_SIZE The length of the major dimension of
 *  the thumbnail.
 * @param {number} config.EXTRACT_LENGTH The maximum length, in characters,
 *  of the extract.
 * @param {string} config.acceptLanguage The accepted language sent in the
 *  header
 * @return {MediaWikiGateway}
 */
export default function createMediaWikiApiGateway( api, config ) {
	function fetch( title ) {
		return api.get( {
			action: 'query',
			prop: 'info|extracts|pageimages|revisions|info',
			formatversion: 2,
			redirects: true,
			exintro: mw.config.get( 'wgPopupsTextExtractsIntroOnly', true ),
			exchars: config.EXTRACT_LENGTH,

			// There is an added geometric limit on .mwe-popups-extract
			// so that text does not overflow from the card.
			explaintext: true,
			exsectionformat: 'plain',

			piprop: 'thumbnail',
			pithumbsize: config.THUMBNAIL_SIZE,
			pilicense: 'any',
			rvprop: 'timestamp',
			inprop: 'url',
			titles: title,
			smaxage: CACHE_LIFETIME,
			maxage: CACHE_LIFETIME,
			uselang: 'content'
		}, {
			headers: {
				'X-Analytics': 'preview=1',
				'Accept-Language': config.acceptLanguage
			}
		} );
	}

	/**
	 * @param {mw.Title} title
	 * @return {AbortPromise<PagePreviewModel>}
	 */
	function fetchPreviewForTitle( title ) {
		const xhr = fetch( title.getPrefixedDb() );
		return abortablePromise( xhr.then( ( data ) => {
			const page = extractPageFromResponse( data );
			const plainTextExtract = formatPlainTextExtract( page );
			return convertPageToModel( plainTextExtract );
		} ), () => xhr.abort() );
	}

	return {
		fetch,
		extractPageFromResponse,
		convertPageToModel,
		fetchPreviewForTitle,
		formatPlainTextExtract
	};
}

/**
 * Extracts page data from the API response.
 *
 * @method
 * @name MediaWikiGateway#extractPageFromResponse
 * @param {Object} data The response
 * @throws {Error} If the response is empty or doesn't contain data about the
 *  page
 * @return {Object}
 */
function extractPageFromResponse( data ) {
	if (
		data.query &&
		data.query.pages &&
		data.query.pages.length
	) {
		return data.query.pages[ 0 ];
	}

	throw new Error( 'API response `query.pages` is empty.' );
}

/**
 * Make plain text nicer by applying formatter.
 *
 * @method
 * @name MediaWikiGateway#formatPlainTextExtract
 * @param {Object} data The response
 * @return {Object}
 */
function formatPlainTextExtract( data ) {
	const result = Object.assign( {}, data );
	result.extract = formatter.formatPlainTextExtract( data.extract, data.title );
	return result;
}

/**
 * Converts the API response to a preview model.
 *
 * @method
 * @name MediaWikiGateway#convertPageToModel
 * @param {Object} page
 * @return {PagePreviewModel}
 */
function convertPageToModel( page ) {
	return createModel(
		page.title,
		page.canonicalurl,
		page.pagelanguagehtmlcode,
		page.pagelanguagedir,
		page.extract,
		page.type,
		page.thumbnail,
		page.pageid
	);
}
