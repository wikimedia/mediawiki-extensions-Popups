const constants = require( '../constants.js' );
const mediawiki = require( './mediawiki.js' );
const rest = require( './rest.js' );
const formatters = require( './restFormatters.js' );
const { abortablePromise } = require( './index.js' );

/**
 * @module gateway/page
 * @private
 */
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
function createPagePreviewGateway( config ) {
	const gatewayConfig = {
		THUMBNAIL_SIZE: constants.THUMBNAIL_SIZE,
		EXTRACT_LENGTH: constants.EXTRACT_LENGTH,
		acceptLanguage: config.get( 'wgPageContentLanguage' )
	};
	const restConfig = Object.assign( {}, gatewayConfig, {
		endpoint: config.get( 'wgPopupsRestGatewayEndpoint' )
	} );
	switch ( config.get( 'wgPopupsGateway' ) ) {
		case 'mwApiPlain':
			return mediawiki.createMediaWikiApiGateway( new mw.Api(), gatewayConfig );
		case 'restbasePlain':
			return rest.createRESTBaseGateway(
				ajax, restConfig, formatters.parsePlainTextResponse );
		case 'restbaseHTML':
			return rest.createRESTBaseGateway(
				ajax, restConfig, formatters.parseHTMLResponse );
		default:
			throw new Error( 'Unknown gateway' );
	}
}

module.exports = createPagePreviewGateway;
