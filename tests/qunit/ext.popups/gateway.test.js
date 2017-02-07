( function ( mw, $ ) {

	var createModel = mw.popups.preview.createModel,
		MediaWikiApiGateway = mw.popups.MediaWikiApiGateway,
		RESTBaseGateway = mw.popups.RESTBaseGateway,
		MEDIAWIKI_API_RESPONSE = {
			query: {
				pages: [
					{
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
					}
				]
			}
		},
		MEDIAWIKI_API_RESPONSE_PREVIEW_MODEL = createModel(
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
		),
		RESTBASE_RESPONSE = {
			title: 'Barack Obama',
			extract: 'Barack Hussein Obama II born August 4, 1961) ...',
			thumbnail: {
				source: 'https://upload.wikimedia.org/someImage.jpg',
				width: 256,
				height: 320
			},
			lang: 'en',
			dir: 'ltr',
			timestamp: '2017-01-30T10:17:41Z',
			description: '44th President of the United States of America'
		},
		RESTBASE_RESPONSE_PREVIEW_MODEL = createModel(
			'Barack Obama',
			new mw.Title( 'Barack Obama' ).getUrl(),
			'en',
			'ltr',
			'Barack Hussein Obama II born August 4, 1961) ...',
			{
				source: 'https://upload.wikimedia.org/someImage.jpg',
				width: 256,
				height: 320
			}
		);

	QUnit.module( 'ext.popups/gateway' );

	QUnit.test( 'MediaWiki API gateway is called with correct arguments', function ( assert ) {
		var getSpy = this.sandbox.spy(),
			api = {
				get: getSpy
			},
			gateway = new MediaWikiApiGateway( api ),
			expectedOptions = {
				action: 'query',
				prop: 'info|extracts|pageimages|revisions|info',
				formatversion: 2,
				redirects: true,
				exintro: true,
				exchars: 525,
				explaintext: true,
				piprop: 'thumbnail',
				pithumbsize: 300 * $.bracketedDevicePixelRatio(),
				rvprop: 'timestamp',
				inprop: 'url',
				titles: 'Test Title',
				smaxage: 300,
				maxage: 300,
				uselang: 'content'
			},
			expectedHeaders = {
				headers: {
					'X-Analytics': 'preview=1'
				}
			};

		gateway.fetch( 'Test Title' );

		assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], expectedOptions, 'options' );
		assert.deepEqual( getSpy.getCall( 0 ).args[ 1 ], expectedHeaders, 'headers' );
	} );

	QUnit.test( 'MediaWiki API gateway is correctly extracting the page data from the response ', function ( assert ) {
		var gateway = new MediaWikiApiGateway(),
			errorCases = [
				{},
				{
					query: {}
				},
				{
					query: {
						pages: []
					}
				}
			],
			successCases = [
				[
					{
						query: {
							pages: [ { someData: 'Yes' } ]
						}
					},
					{
						someData: 'Yes'
					}
				]
			];

		assert.expect( errorCases.length + successCases.length );

		$.each( errorCases, function ( _, data ) {
			assert.throws( function () {
				gateway.extractPageFromResponse( data );
			} );
		} );

		$.each( successCases, function ( _, data ) {
			assert.deepEqual(
				gateway.extractPageFromResponse( data[ 0 ] ),
				data[ 1 ]
			);
		} );
	} );

	QUnit.test( 'MediaWiki API gateway is correctly converting the page data to a model ', function ( assert ) {
		var gateway = new MediaWikiApiGateway(),
			page = gateway.extractPageFromResponse( MEDIAWIKI_API_RESPONSE );

		assert.deepEqual(
			gateway.convertPageToModel( page ),
			MEDIAWIKI_API_RESPONSE_PREVIEW_MODEL
		);
	} );

	QUnit.test( 'MediaWiki API gateway handles the API failure', function ( assert ) {
		var deferred = $.Deferred(),
			api = {
				get: this.sandbox.stub().returns( deferred.promise() )
			},
			gateway = new MediaWikiApiGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).fail( function () {
			assert.ok( true );
			done();
		} );

		deferred.reject();
	} );

	QUnit.test( 'MediaWiki API gateway returns the correct data ', function ( assert ) {
		var api = {
				get: this.sandbox.stub().returns(
					$.Deferred().resolve( MEDIAWIKI_API_RESPONSE ).promise()
				)
			},
			gateway = new MediaWikiApiGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).done( function ( result ) {
			assert.deepEqual( result, MEDIAWIKI_API_RESPONSE_PREVIEW_MODEL );
			done();
		} );
	} );

	QUnit.test( 'MediaWiki API gateway handles missing pages ', function ( assert ) {
		var response = {
				query: {
					pages: [ {
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
					} ]
				}
			},
			model = createModel(
				'Missing page',
				'http://dev.wiki.local.wmftest.net:8080/wiki/Missing_page',
				'en',
				'ltr',
				undefined,
				undefined
			),
			api = {
				get: this.sandbox.stub().returns(
					$.Deferred().resolve( response ).promise()
				)
			},
			gateway = new MediaWikiApiGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).done( function ( result ) {
			assert.deepEqual( result, model );

			done();
		} );
	} );

	QUnit.test( 'RESTBase gateway is called with correct arguments', function ( assert ) {
		var getSpy = this.sandbox.spy(),
			api = {
				ajax: getSpy
			},
			gateway = new RESTBaseGateway( api ),
			expectedOptions = {
				url: '/api/rest_v1/page/summary/' + encodeURIComponent( 'Test Title' ),
				headers: {
					Accept: 'application/json; charset=utf-8' +
						'profile="https://www.mediawiki.org/wiki/Specs/Summary/1.0.0"'
				}
			};

		gateway.fetch( 'Test Title' );

		assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], expectedOptions, 'options' );
	} );

	QUnit.test( 'RESTBase gateway is correctly converting the page data to a model ', function ( assert ) {
		var gateway = new RESTBaseGateway();

		assert.deepEqual(
			gateway.convertPageToModel( RESTBASE_RESPONSE ),
			RESTBASE_RESPONSE_PREVIEW_MODEL
		);
	} );

	QUnit.test( 'RESTBase gateway handles the API failure', function ( assert ) {
		var deferred = $.Deferred(),
			api = {
				ajax: this.sandbox.stub().returns( deferred.promise() )
			},
			gateway = new RESTBaseGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).fail( function () {
			assert.ok( true );
			done();
		} );

		deferred.reject();
	} );

	QUnit.test( 'RESTBase gateway returns the correct data ', function ( assert ) {
		var api = {
				ajax: this.sandbox.stub().returns(
					$.Deferred().resolve( RESTBASE_RESPONSE ).promise()
				)
			},
			gateway = new RESTBaseGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).done( function ( result ) {
			assert.deepEqual( result, RESTBASE_RESPONSE_PREVIEW_MODEL );
			done();
		} );
	} );

	QUnit.test( 'RESTBase gateway handles missing pages ', function ( assert ) {
		var response = {
				type: 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found',
				title: 'Not found.',
				method: 'get',
				detail: 'Page or revision not found.',
				uri: '/en.wikipedia.org/v1/page/summary/Missing_page'
			},
			api = {
				ajax: this.sandbox.stub().returns(
					$.Deferred().rejectWith( response ).promise()
				)
			},
			gateway = new RESTBaseGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Missing Page' ).fail( function () {
			assert.ok( true );

			done();
		} );
	} );

}( mediaWiki, jQuery ) );
