( function ( mw, $ ) {

	var createModel = mw.popups.preview.createModel,
		createRESTBaseGateway = mw.popups.gateway.createRESTBaseGateway,
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

	QUnit.module( 'ext.popups/gateway/rest' );

	QUnit.test( 'RESTBase gateway is called with correct arguments', function ( assert ) {
		var getSpy = this.sandbox.spy(),
			gateway = createRESTBaseGateway( getSpy ),
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
		var gateway = createRESTBaseGateway();

		assert.deepEqual(
			gateway.convertPageToModel( RESTBASE_RESPONSE ),
			RESTBASE_RESPONSE_PREVIEW_MODEL
		);
	} );

	QUnit.test( 'RESTBase gateway handles the API failure', function ( assert ) {
		var deferred = $.Deferred(),
			api = this.sandbox.stub().returns( deferred.promise() ),
			gateway = createRESTBaseGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Test Title' ).fail( function () {
			assert.ok( true );
			done();
		} );

		deferred.reject();
	} );

	QUnit.test( 'RESTBase gateway returns the correct data ', function ( assert ) {
		var api = this.sandbox.stub().returns(
				$.Deferred().resolve( RESTBASE_RESPONSE ).promise()
			),
			gateway = createRESTBaseGateway( api ),
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
			api = this.sandbox.stub().returns(
				$.Deferred().rejectWith( response ).promise()
			),
			gateway = createRESTBaseGateway( api ),
			done = assert.async( 1 );

		gateway.getPageSummary( 'Missing Page' ).fail( function () {
			assert.ok( true );

			done();
		} );
	} );

}( mediaWiki, jQuery ) );
