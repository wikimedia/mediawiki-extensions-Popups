import constants from '../constants';
import createMediaWikiApiGateway from './mediawiki';
import createRESTBaseGateway from './rest';
import * as formatters from './restFormatters';

var mw = mediaWiki,
	$ = jQuery;

// Note that this interface definition is in the global scope.
/**
 * The interface implemented by all preview gateways.
 *
 * @interface Gateway
 */

/**
 * Fetches a preview for a page.
 *
 * If the underlying request is successful and contains data about the page,
 * then the resulting promise will resolve. If not, then it will reject.
 *
 * @function
 * @name Gateway#getPageSummary
 * @param {String} title The title of the page
 * @returns {jQuery.Promise<PreviewModel>}
 */

/**
 * Creates a gateway with sensible values for the dependencies.
 *
 * @param {mw.Map} config
 * @return {Gateway}
 */
export default function createGateway( config ) {
	switch ( config.get( 'wgPopupsGateway' ) ) {
		case 'mwApiPlain':
			return createMediaWikiApiGateway( new mw.Api(), constants );
		case 'restbasePlain':
			return createRESTBaseGateway( $.ajax, constants, formatters.parsePlainTextResponse );
		case 'restbaseHTML':
			return createRESTBaseGateway( $.ajax, constants, formatters.parseHTMLResponse );
		default:
			throw new Error( 'Unknown gateway' );
	}
}
