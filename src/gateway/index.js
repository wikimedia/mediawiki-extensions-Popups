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

module.exports = {
	createMediaWikiApiGateway: require( './mediawiki' ),
	createRESTBaseGateway: require( './rest' )
};
