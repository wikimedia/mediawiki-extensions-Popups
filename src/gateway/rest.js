( function ( mw ) {

	var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
		RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0';

	/**
	 * RESTBase gateway factory
	 *
	 * @param {Function} ajax function from jQuery for example
	 * @returns {ext.popups.Gateway}
	 */
	function createRESTBaseGateway( ajax ) {

		/**
		 * Fetch page data from the API
		 *
		 * @param {String} title
		 * @return {jQuery.Promise}
		 */
		function fetch( title ) {
			return ajax( {
				url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
				headers: {
					Accept: 'application/json; charset=utf-8' +
						'profile="' + RESTBASE_PROFILE + '"'
				}
			} );
		}

		/**
		 * Get the page summary from the api and transform the data
		 *
		 * @param {String} title
		 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
		 */
		function getPageSummary( title ) {
			return fetch( title )
				.then( convertPageToModel );
		}

		return {
			fetch: fetch,
			convertPageToModel: convertPageToModel,
			getPageSummary: getPageSummary
		};
	}

	/**
	 * Transform the rest API response to a preview model
	 *
	 * @param {Object} page
	 * @returns {ext.popups.PreviewModel}
	 */
	function convertPageToModel( page ) {
		return mw.popups.preview.createModel(
			page.title,
			new mw.Title( page.title ).getUrl(),
			page.lang,
			page.dir,
			page.extract,
			page.thumbnail
		);
	}

	module.exports = createRESTBaseGateway;

}( mediaWiki ) );
