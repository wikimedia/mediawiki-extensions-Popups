var mw = mediaWiki,
	$ = jQuery,
	constants = require( '../constants' ),
	mwApiPlain = require( './plain/mediawiki' ),
	restbasePlain = require( './plain/rest' ),
	restbaseHTML = require( './html/rest' );

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
function createGateway( config ) {
	switch ( config.get( 'wgPopupsGateway' ) ) {
		case 'mwApiPlain':
			return mwApiPlain( new mw.Api(), constants );
		case 'restbasePlain':
			return restbasePlain( $.ajax, constants );
		case 'restbaseHTML':
			return restbaseHTML( $.ajax, constants );
		default:
			throw new Error( 'Unknown gateway' );
	}
}

module.exports = createGateway;
