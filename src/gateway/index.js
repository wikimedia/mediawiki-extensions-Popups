import constants from '../constants';
import createMediaWikiApiGateway from './mediawiki';
import createRESTBaseGateway from './rest';
import * as formatters from './restFormatters';

const mw = mediaWiki,
	$ = jQuery;

/**
 * The interface implemented by all preview gateways.
 * @typedef Gateway
 * @prop {function(string): JQuery.jqXHR} fetch
 * @prop {GetPageSummary} getPageSummary
 * @prop {ConvertPageToModel} convertPageToModel
 */

/**
 * A Promise, usually for a long running or costly task such as an HTTP request,
 * that is abortable.
 * @template T
 * @typedef {JQuery.Promise<T>} AbortPromise
 * @prop {function(): void} abort
 */

/**
 * Fetches a preview for a page.
 *
 * If the underlying request is successful and contains data about the page,
 * then the resulting promise will resolve. If not, then it will reject.
 *
 * @typedef {Function(string): AbortPromise<PreviewModel>} GetPageSummary
 */

/**
 * Converts the API response to a preview model. Exposed for testing only.
 *
 * @typedef {Function(object, ...any): PreviewModel} ConvertPageToModel
 */

/**
 * Creates a gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {Gateway}
 */
export default function createGateway( config ) {
	const restConfig = $.extend( {}, constants,
		{
			endpoint: config.get( 'wgPopupsRestGatewayEndpoint' )
		}
	);
	switch ( config.get( 'wgPopupsGateway' ) ) {
		case 'mwApiPlain':
			return createMediaWikiApiGateway( new mw.Api(), constants );
		case 'restbasePlain':
			return createRESTBaseGateway(
				$.ajax, restConfig, formatters.parsePlainTextResponse );
		case 'restbaseHTML':
			return createRESTBaseGateway(
				$.ajax, restConfig, formatters.parseHTMLResponse );
		default:
			throw new Error( 'Unknown gateway' );
	}
}
