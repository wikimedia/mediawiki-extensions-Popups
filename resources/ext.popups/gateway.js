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
	 * @interface Gateway
	 * @function
	 * @param {mw.Api|jQuery}
	 */

	/**
	 * Get page summary
	 *
	 * @function
	 * @name Gateway#getPageSummary
	 * @param {String} title Page title we're querying
	 * @returns {jQuery.Promise} that resolves with {ext.popups.PreviewModel}
	 * if the request is successful and the response is not empty; otherwise
	 * it rejects.
	 */

	/**
	 * MediaWiki API gateway
	 *
	 * @class
	 * @param {mw.Api} api
	 * @implements {ext.popups.Gateway}
	 */
	function MediaWikiApiGateway( api ) {
		this.api = api;
	}

	/**
	 * Fetch page data from the API
	 *
	 * @private
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	MediaWikiApiGateway.prototype.fetch = function ( title ) {
		return this.api.get( {
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
	};

	/**
	 * Extract page data from the response
	 *
	 * @private
	 * @param {Object} data API response data
	 * @throws {Error} Throw an error if page data cannot be extracted,
	 * i.e. if the response is empty,
	 * @returns {Object}
	 */
	MediaWikiApiGateway.prototype.extractPageFromResponse = function( data ) {
		if (
			data.query &&
			data.query.pages &&
			data.query.pages.length
		) {
			return data.query.pages[ 0 ];
		}

		throw new Error( 'API response `query.pages` is empty.' );
	};

	/**
	 * Transform the API response to a preview model
	 *
	 * @private
	 * @param {Object} page
	 * @returns {ext.popups.PreviewModel}
	 */
	MediaWikiApiGateway.prototype.convertPageToModel = function( page ) {
		return mw.popups.preview.createModel(
			page.title,
			page.canonicalurl,
			page.pagelanguagehtmlcode,
			page.pagelanguagedir,
			page.extract,
			page.thumbnail
		);
	};

	MediaWikiApiGateway.prototype.getPageSummary = function( title ) {
		return this.fetch( title )
			.then( this.extractPageFromResponse )
			.then( this.convertPageToModel );
	};

	/**
	 * RESTBase gateway
	 *
	 * @class
	 * @param {jQuery} api
	 * @implements {ext.popups.Gateway}
	 */
	function RESTBaseGateway( api ) {
		this.api = api;
	}

	/**
	 * Fetch page data from the API
	 *
	 * @private
	 * @param {String} title
	 * @return {jQuery.Promise}
	 */
	RESTBaseGateway.prototype.fetch = function ( title ) {
		return this.api.ajax( {
			url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
			headers: {
				Accept: 'application/json; charset=utf-8' +
					'profile="' + RESTBASE_PROFILE + '"'
			}
		} );
	};

	/**
	 * Transform the API response to a preview model
	 *
	 * @private
	 * @param {Object} page
	 * @returns {ext.popups.PreviewModel}
	 */
	RESTBaseGateway.prototype.convertPageToModel = function( page ) {
		return mw.popups.preview.createModel(
			page.title,
			new mw.Title( page.title ).getUrl(),
			page.lang,
			page.dir,
			page.extract,
			page.thumbnail
		);
	};

	RESTBaseGateway.prototype.getPageSummary = function( title ) {
		return this.fetch( title )
			.then( this.convertPageToModel );
	};

	mw.popups.MediaWikiApiGateway = MediaWikiApiGateway;
	mw.popups.RESTBaseGateway = RESTBaseGateway;
}( mediaWiki, jQuery ) );
