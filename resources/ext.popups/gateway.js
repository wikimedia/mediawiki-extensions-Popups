( function ( mw, $ ) {

	// FIXME: These constants (and others like 'em) should be in some top-level
	// configuration file.
	var EXTRACT_LENGTH = 525,
		THUMBNAIL_SIZE = 300 * $.bracketedDevicePixelRatio(),
		CACHE_LIFETIME = 300, // Public and private cache lifetime (5 minutes)
		ONE_DAY = 24 * 60 * 60 * 1000; // ms.

	/**
	 * @typedef {Function} ext.popups.Gateway
	 * @param {String} title
	 */

	/**
	 * Creates a function that fetches all of the data required to give the user a
	 * preview of the page from the MediaWiki API given the title of the page (see
	 * `mw.popups.processLinks` for the definition of "title").
	 *
	 * If the API request fails or if the API response is empty, then the gateway
	 * will reject; otherwise, it'll resolve.
	 *
	 * @param {mw.Api} api
	 * @return {ext.popups.Gateway}
	 */
	mw.popups.createGateway = function ( api ) {
		return function ( title ) {
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
			},
				{
					headers: {
						'X-Analytics': 'preview=1'
					}
				} )
				.then( function ( data ) {
					// If the response is empty, i.e. data.query.pages is empty or isn't
					// set, then reject rather than resolve.
					if (
						data.query &&
						data.query.pages &&
						data.query.pages.length
					) {
						return data.query.pages[ 0 ];
					}

					return $.Deferred().reject();
				} )
				.then( processPage );
		};
	};

	/**
	 * Processes a page as represented by the MediaWiki API (including the
	 * additional data requested above).
	 *
	 * @param {Object} page
	 * @returns {Object}
	 */
	function processPage( page ) {
		var lastModified,
			result;

		result = {
			title: page.title,
			languageCode: page.pagelanguagehtmlcode,
			languageDirection: page.pagelanguagedir,
			url: page.canonicalurl,
			extract: processExtract( page.extract )
		};

		if ( page.revisions && page.revisions.length ) {
			lastModified = new Date( page.revisions[ 0 ].timestamp );

			result.lastModified = lastModified;
			result.isRecent = new Date() - lastModified < ONE_DAY;
		}

		if ( page.thumbnail ) {
			result.thumbnail = page.thumbnail;
		}

		return result;
	}

	/**
	 * Processes the extract returned by the TextExtracts MediaWiki API query
	 * module.
	 *
	 * @param {String|undefined} extract
	 * @return {String|undefined}
	 */
	function processExtract( extract ) {
		var result;

		if ( extract === undefined || extract === '' ) {
			return undefined;
		}

		result = extract;
		result = removeParentheticals( result );
		result = removeEllipsis( result );

		return result.length > 0 ? result : undefined;
	}

	/**
	 * Removes the trailing ellipsis from the extract, if it's there.
	 *
	 * This function was extracted from
	 * `mw.popups.renderer.article#removeEllipsis`.
	 *
	 * @param {String} extract
	 * @return {String}
	 */
	function removeEllipsis( extract ) {
		return extract.replace( /\.\.\.$/, '' );
	}

	/**
	 * Removes parentheticals from the extract.
	 *
	 * If the parenthesis are unbalanced or out of order, then the extract is
	 * returned without further processing.
	 *
	 * This function was extracted from
	 * `mw.popups.renderer.article#removeParensFromText`.
	 *
	 * @param {String} extract
	 * @return {String}
	 */
	function removeParentheticals( extract ) {
		var
			ch,
			result = '',
			level = 0,
			i = 0;

		for ( i; i < extract.length; i++ ) {
			ch = extract.charAt( i );

			if ( ch === ')' && level === 0 ) {
				return extract;
			}
			if ( ch === '(' ) {
				level++;
				continue;
			} else if ( ch === ')' ) {
				level--;
				continue;
			}
			if ( level === 0 ) {
				// Remove leading spaces before brackets
				if ( ch === ' ' && extract.charAt( i + 1 ) === '(' ) {
					continue;
				}
				result += ch;
			}
		}

		return ( level === 0 ) ? result : extract;
	}

}( mediaWiki, jQuery ) );
