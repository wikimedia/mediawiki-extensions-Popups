( function ( mw, $ ) {
	// FIXME: These constants (and others like 'em) should be in some top-level
	// configuration file.
	var EXTRACT_LENGTH = 525,
		THUMBNAIL_SIZE = 300 * $.bracketedDevicePixelRatio(),
		CACHE_LIFETIME = 300, // Public and private cache lifetime (5 minutes)
		RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
		RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0';

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

	/**
	 * MediaWiki API gateway factory
	 *
	 * @param {mw.Api} api
	 * @returns {ext.popups.Gateway}
	 */
	function createMediaWikiApiGateway( api ) {

		/**
		 * Fetch page data from the API
		 *
		 * @param {String} title
		 * @return {jQuery.Promise}
		 */
		function fetch( title ) {
			return api.get( {
				action: 'query',
				prop: 'info|extracts|pageimages|revisions|info',
				formatversion: 2,
				redirects: true,
				exintro: true,
				exchars: EXTRACT_LENGTH,

				// There is an added geometric limit on .mwe-popups-extract
				// so that text does not overflow from the card.
				explaintext: true,

				piprop: 'thumbnail',
				pithumbsize: THUMBNAIL_SIZE,
				rvprop: 'timestamp',
				inprop: 'url',
				titles: title,
				smaxage: CACHE_LIFETIME,
				maxage: CACHE_LIFETIME,
				uselang: 'content'
			}, {
				headers: {
					'X-Analytics': 'preview=1'
				}
			} );
		}

		/**
		 * Extract page data from the response
		 *
		 * @param {Object} data API response data
		 * @throws {Error} Throw an error if page data cannot be extracted,
		 * i.e. if the response is empty,
		 * @returns {Object}
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
		 * Transform the API response to a preview model
		 *
		 * @param {Object} page
		 * @returns {ext.popups.PreviewModel}
		 */
		function convertPageToModel( page ) {
			return mw.popups.preview.createModel(
				page.title,
				page.canonicalurl,
				page.pagelanguagehtmlcode,
				page.pagelanguagedir,
				page.extract,
				page.thumbnail
			);
		}

		/**
		 * Get the page summary from the api and transform the data
		 *
		 * @param {String} title
		 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
		 */
		function getPageSummary( title ) {
			return fetch( title )
				.then( extractPageFromResponse )
				.then( convertPageToModel );
		}

		return {
			fetch: fetch,
			extractPageFromResponse: extractPageFromResponse,
			convertPageToModel: convertPageToModel,
			getPageSummary: getPageSummary
		};
	}

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
		 * Transform the API response to a preview model
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

	mw.popups.createMediaWikiApiGateway = createMediaWikiApiGateway;
	mw.popups.createRESTBaseGateway = createRESTBaseGateway;
}( mediaWiki, jQuery ) );
