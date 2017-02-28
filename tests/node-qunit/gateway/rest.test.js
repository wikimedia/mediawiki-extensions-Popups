var createModel = require( '../../../src/preview/model' ).createModel,
	createRESTBaseGateway = require( '../../../src/gateway/rest' ),
	DEFAULT_CONSTANTS = {
		THUMBNAIL_SIZE: 512
	},
	RESTBASE_RESPONSE = {
		title: 'Barack Obama',
		extract: 'Barack Hussein Obama II born August 4, 1961) ...',
		thumbnail: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/200px-President_Barack_Obama.jpg',
			width: 200,
			height: 250
		},
		originalimage: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg',
			width: 800,
			height: 1000
		},
		lang: 'en',
		dir: 'ltr',
		timestamp: '2017-01-30T10:17:41Z',
		description: '44th President of the United States of America'
	},
	SVG_RESTBASE_RESPONSE = {
		title: 'Barack Obama',
		extract: 'Barack Hussein Obama II born August 4, 1961) ...',
		thumbnail: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.svg/200px-President_Barack_Obama.svg',
			width: 200,
			height: 250
		},
		originalimage: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.svg',
			width: 800,
			height: 1000
		},
		lang: 'en',
		dir: 'ltr',
		timestamp: '2017-01-30T10:17:41Z',
		description: '44th President of the United States of America'
	},
	RESTBASE_RESPONSE_WITHOUT_IMAGE = {
		title: 'Barack Obama',
		extract: 'Barack Hussein Obama II born August 4, 1961) ...',
		lang: 'en',
		dir: 'ltr',
		timestamp: '2017-01-30T10:17:41Z',
		description: '44th President of the United States of America'
	},
	RESTBASE_RESPONSE_PREVIEW_MODEL = createModel(
		'Barack Obama',
		'url/Barack Obama', // Generated in the stub below
		'en',
		'ltr',
		'Barack Hussein Obama II born August 4, 1961) ...',
		{
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/512px-President_Barack_Obama.jpg',
			width: 512,
			height: 640
		}
	);

QUnit.module( 'gateway/rest', {
	beforeEach: function () {
		mediaWiki.Title = function ( title ) {
			this.getUrl = function () { return 'url/' + title; };
		};
	},
	afterEach: function () {
		mediaWiki.Title = null;
	}
} );

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
		gateway.convertPageToModel( RESTBASE_RESPONSE, 512 ),
		RESTBASE_RESPONSE_PREVIEW_MODEL
	);
} );

QUnit.test( 'RESTBase gateway doesn\'t stretch thumbnails', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();

	model = gateway.convertPageToModel( RESTBASE_RESPONSE, 2000 );

	assert.equal(
		model.thumbnail.source,
		'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/800px-President_Barack_Obama.jpg',
		'If the requested thumbnail size is bigger than the originalimage width the originalimage width is used'
	);
} );

QUnit.test( 'RESTBase gateway stretches SVGs', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();

	model = gateway.convertPageToModel( SVG_RESTBASE_RESPONSE, 2000 );

	assert.equal(
		model.thumbnail.source,
		'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.svg/2000px-President_Barack_Obama.svg',
		'If the requested thumbnail size is bigger than the originalimage and its an SVG all is good'
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
		gateway = createRESTBaseGateway( api, DEFAULT_CONSTANTS ),
		done = assert.async( 1 );

	gateway.getPageSummary( 'Test Title' ).done( function ( result ) {
		assert.deepEqual( result, RESTBASE_RESPONSE_PREVIEW_MODEL );
		done();
	} );
} );

QUnit.test( 'RESTBase gateway handles missing images ', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();
	model = gateway.convertPageToModel( RESTBASE_RESPONSE_WITHOUT_IMAGE, 300 );

	assert.equal(
		model.originalimage,
		undefined,
		'If restbase handles missing image information'
	);
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
		gateway = createRESTBaseGateway( api, DEFAULT_CONSTANTS ),
		done = assert.async( 1 );

	gateway.getPageSummary( 'Missing Page' ).fail( function () {
		assert.ok( true );

		done();
	} );
} );
