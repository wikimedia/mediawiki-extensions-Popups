( function ( mw, $ ) {

	var createModel = mw.popups.preview.createModel;

	/**
	 * @private
	 *
	 * @param {Object} data
	 */
	function createGateway( data ) {
		var api = {
			get: function () {
				return $.Deferred()
					.resolve( data )
					.promise();
			}
		};

		return mw.popups.createGateway( api );
	}

	/**
	 * @private
	 *
	 * @param {Object} page
	 */
	function createGatewayWithPage( page ) {
		return createGateway( {
			query: {
				pages: [ page ]
			}
		} );
	}

	QUnit.module( 'ext.popups/gateway' );

	QUnit.test( 'it should handle the API request failing', function ( assert ) {
		var getDeferred = this.getDeferred = $.Deferred(),
			api = {
				get: function () {
					return getDeferred.promise();
				}
			},
			fetchPreview = mw.popups.createGateway( api ),
			done = assert.async( 1 );

		fetchPreview( 'Foo' ).fail( function () {
			assert.ok( true );

			done();
		} );

		getDeferred.reject();
	} );

	QUnit.test( 'it should fail if the response is empty', function ( assert ) {
		var cases,
			done;

		cases = [
			{},
			{
				query: {}
			},
			{
				query: {
					pages: []
				}
			}
		];

		done = assert.async( cases.length );

		$.each( cases, function ( _, data ) {
			var fetchPreview = createGateway( data );

			fetchPreview( 'Foo' ).fail( function () {
				assert.ok( true );

				done();
			} );
		} );
	} );

	QUnit.test( 'it should handle an API response', function ( assert ) {
		var done = assert.async( 1 ),
			fetchPreview;

		fetchPreview = createGateway( {
			batchcomplete: true,
			query: {
				pages: [ {
					contentmodel: 'wikitext',
					extract: 'Richard Paul "Rick" Astley (/\u02c8r\u026ak \u02c8\u00e6stli/; born 6 February 1966) is an English singer, songwriter, musician, and radio personality. His 1987 song, "Never Gonna Give You Up" was a No. 1 hit single in 25 countries. By the time of his retirement in 1993, Astley had sold approximately 40 million records worldwide.\nAstley made a comeback in 2007, becoming an Internet phenomenon when his video "Never Gonna Give You Up" became integral to the meme known as "rickrolling". Astley was voted "Best Act Ever" by Internet users at the...',
					lastrevid: 748725726,
					length: 32132,
					fullurl: 'https://en.wikipedia.org/wiki/Rick_Astley',
					editurl: 'https://en.wikipedia.org/w/index.php?title=Rick_Astley&action=edit',
					canonicalurl: 'https://en.wikipedia.org/wiki/Rick_Astley',
					ns: 0,
					pageid: 447541,
					pagelanguage: 'en',
					pagelanguagedir: 'ltr',
					pagelanguagehtmlcode: 'en',
					revisions: [ {
						timestamp: '2016-11-10T00:14:14Z'
					} ],
					thumbnail: {
						height: 300,
						source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Rick_Astley_-_Pepsifest_2009.jpg/200px-Rick_Astley_-_Pepsifest_2009.jpg',
						width: 200
					},
					title: 'Rick Astley',
					touched: '2016-11-10T00:14:14Z'
				} ]
			}
		} );

		fetchPreview( 'Rick Astley' ).done( function ( result ) {
			assert.deepEqual( result, createModel(
				'Rick Astley',
				'https://en.wikipedia.org/wiki/Rick_Astley',
				'en',
				'ltr',
				'Richard Paul "Rick" Astley is an English singer, songwriter, musician, and radio personality. His 1987 song, "Never Gonna Give You Up" was a No. 1 hit single in 25 countries. By the time of his retirement in 1993, Astley had sold approximately 40 million records worldwide.\nAstley made a comeback in 2007, becoming an Internet phenomenon when his video "Never Gonna Give You Up" became integral to the meme known as "rickrolling". Astley was voted "Best Act Ever" by Internet users at the',
				{
					height: 300,
					source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Rick_Astley_-_Pepsifest_2009.jpg/200px-Rick_Astley_-_Pepsifest_2009.jpg',
					width: 200
				}
			) );

			done();
		} );
	} );

	QUnit.test( 'it handles missing pages', function ( assert ) {
		var done = assert.async( 1 ),
			fetchPreview;

		fetchPreview = createGatewayWithPage( {
			canonicalurl: 'http://dev.wiki.local.wmftest.net:8080/wiki/Missing_page',
			contentmodel: 'wikitext',
			editurl: 'http://dev.wiki.local.wmftest.net:8080/w/index.php?title=Missing_page&action=edit',
			fullurl: 'http://dev.wiki.local.wmftest.net:8080/wiki/Missing_page',
			missing: true,
			ns: 0,
			pagelanguage: 'en',
			pagelanguagedir: 'ltr',
			pagelanguagehtmlcode: 'en',
			title: 'Missing page'
		} );

		fetchPreview( 'Missing page' ).done( function ( result ) {
			assert.deepEqual( result, createModel(
				'Missing page',
				'http://dev.wiki.local.wmftest.net:8080/wiki/Missing_page',
				'en',
				'ltr',
				undefined,
				undefined
			) );

			done();
		} );
	} );

}( mediaWiki, jQuery ) );
