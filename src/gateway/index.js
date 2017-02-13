/**
 * Interface for API gateway that fetches page summary
 *
 * @interface ext.popups.Gateway
 */

/**
 * Returns a preview model fetched from the api
 * @function
 * @name ext.popups.Gateway#getPageSummary
 * @param {String} title Page title we're querying
 * @returns {jQuery.Promise} that resolves with {ext.popups.PreviewModel}
 * if the request is successful and the response is not empty; otherwise
 * it rejects.
 */
module.exports = {
	createMediaWikiApiGateway: require( './mediawiki' ),
	createRESTBaseGateway: require( './rest' )
};
