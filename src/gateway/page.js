/**
 * @module gateway/page
 */

import constants from '../constants';
import createMediaWikiApiGateway from './mediawiki';
import createRESTBaseGateway from './rest';
import * as formatters from './restFormatters';
import { abortablePromise } from './index.js';

/**
 * @param {Object} options
 * @return {Promise}
 */
function ajax( options ) {
	const controller = new AbortController();
	const signal = controller.signal;

	return abortablePromise(
		fetch( options.url, {
			headers: options.headers,
			signal
		} ).then( ( resp ) => resp.json() ),
		() => {
			controller.abort();
		}
	);
}

/**
 * Creates a page preview gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {Gateway}
 */
export default function createPagePreviewGateway( config ) {
	const gatewayConfig = Object.assign( {}, constants, {
		acceptLanguage: config.get( 'wgPageContentLanguage' )
	} );
	const restConfig = Object.assign( {}, gatewayConfig, {
		endpoint: config.get( 'wgPopupsRestGatewayEndpoint' )
	} );
	switch ( config.get( 'wgPopupsGateway' ) ) {
		case 'mwApiPlain':
			return createMediaWikiApiGateway( new mw.Api(), gatewayConfig );
		case 'restbasePlain':
			return createRESTBaseGateway(
				ajax, restConfig, formatters.parsePlainTextResponse );
		case 'restbaseHTML':
			return createRESTBaseGateway(
				ajax, restConfig, formatters.parseHTMLResponse );
		default:
			throw new Error( 'Unknown gateway' );
	}
}
