( function ( mw, $ ) {

	// FIXME: These constants (and others like 'em) should be in some top-level
	// configuration file.
	var EXTRACT_LENGTH = 525,
		THUMBNAIL_SIZE = 300 * $.bracketedDevicePixelRatio(),
		CACHE_LIFETIME = 300; // Public and private cache lifetime (5 minutes)

	/**
	 * Creates a function that fetches all of the data required to give the user a
	 * preview of the page from the MediaWiki API given the title of the page (see
	 * `mw.popups.processLinks` for the definition of "title").
	 *
	 * If the API request fails or if the API response is empty, then the gateway
	 * will reject; otherwise, it'll resolve.
	 *
	 * @param {mw.Api} api
	 * @return {Function}
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
						return data.query.pages[0];
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
	 * @result {Object}
	 */
	function processPage( page ) {
		var result = {
				title: page.title,
				languageCode: page.pagelanguagehtmlcode,
				languageDirection: page.pagelanguagedir,
				url: page.canonicalurl,
				lastModified: new Date( page.revisions[0].timestamp ),
				extract: processExtract( page.extract )
			};

		if ( page.thumbnail ) {
			result.thumbnail = page.thumbnail;

			result.thumbnail.url = result.thumbnail.source;
			delete( result.thumbnail.source );
		}

		return result;
	}

	/**
	 * @private
	 *
	 * Processes the extract returned by the TextExtracts MediaWiki API query
	 * module.
	 *
	 * @param {String} extract
	 * @return {String|undefined} If the extract is set, then, if it's there, the
	 *  trailing ellipsis is removed and the new extract returned; otherwise,
	 *  `undefined` is returned.
	 */
	function processExtract( extract ) {
		if ( extract === undefined || extract === '' ) {
			return undefined;
		}

		if ( extract.length ) {
			extract = extract.replace( /\.\.\.$/, '' );
		}

		return extract.length > 0 ? extract : undefined;
	}

}( mediaWiki, jQuery ) );
