/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	( function ( mw ) {
	
		mw.popups.gateway = {
			createMediaWikiApiGateway: __webpack_require__( 7 ),
			createRESTBaseGateway: __webpack_require__( 8 )
		};
	
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
	
	}( mediaWiki ) );


/***/ },

/***/ 7:
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		var EXTRACT_LENGTH = 525,
			THUMBNAIL_SIZE = 300 * $.bracketedDevicePixelRatio(),
			// Public and private cache lifetime (5 minutes)
			CACHE_LIFETIME = 300;
	
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
		 * Extract page data from the MediaWiki API response
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
		 * Transform the MediaWiki API response to a preview model
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
	
		module.exports = createMediaWikiApiGateway;
	
	}( mediaWiki, jQuery ) );


/***/ },

/***/ 8:
/***/ function(module, exports) {

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


/***/ }

/******/ });
//# sourceMappingURL=index.js.map