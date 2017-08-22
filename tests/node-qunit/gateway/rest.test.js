import { createModel } from '../../../src/preview/model';
import createRESTBaseGateway from '../../../src/gateway/rest';

var DEFAULT_CONSTANTS = {
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
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.svg/200px-President_Barack_Obama.svg.png',
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

	// Note well that the thumbnail and originalimage properties are
	// identical. This can be the case where RESTBase requests a thumbnail at
	// 320px width but the original image isn't that wide, in which instance
	// PageImages - and therefore RESTBase - return the original image as the
	// thumbnail.
	//
	// See https://phabricator.wikimedia.org/T158632#3071104 onward for additional
	// context.
	RESTBASE_RESPONSE_WITH_SMALL_IMAGE = {
		title: 'PreviewsNonFreeImage/sandbox',
		extract: 'Hello, I am the non-free image and parenthetical page (YOU CAN\'T SEE THIS). My preview should contain an image that is not free. My preview should contain a parenthetical you cannot see..',
		thumbnail: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/RH-Fedora_logo-nonfree.png',
			width: 300,
			height: 126,
			original: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/RH-Fedora_logo-nonfree.png'
		},
		originalimage: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/RH-Fedora_logo-nonfree.png',
			width: 300,
			height: 126
		},
		lang: 'en',
		dir: 'ltr',
		timestamp: '2017-02-17T22:29:56Z'
	},
	RESTBASE_RESPONSE_WITH_LANDSCAPE_IMAGE = {
		title: 'Landscape',
		extract: 'Landscape',
		thumbnail: {
			source: 'http://foo/bar/baz.png/500px-baz.png',
			width: 500,
			height: 300,
			original: 'http://foo/bar/baz.png'
		},
		originalimage: {
			source: 'http://foo/bar/baz.png',
			width: 1000,
			height: 600
		},
		lang: 'en',
		dir: 'ltr',
		timestamp: '2017-02-17T22:29:56Z'
	},
	RESTBASE_RESPONSE_PREVIEW_MODEL = createModel(
		'Barack Obama',
		'url/Barack Obama', // Generated in the stub below
		'en',
		'ltr',
		'!Barack Hussein Obama II born August 4, 1961) ...!',
		{
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
			width: 409,
			height: 512
		}
	);

function provideParsedExtract( page ) {
	return '!' + page.extract + '!';
}

QUnit.module( 'gateway/rest', {
	beforeEach: function () {
		window.mediaWiki.Title = function ( title ) {
			this.getUrl = function () { return 'url/' + title; };
		};
	},
	afterEach: function () {
		window.mediaWiki.Title = null;
	}
} );

QUnit.test( 'RESTBase gateway is called with correct arguments', function ( assert ) {
	var getSpy = this.sandbox.spy(),
		gateway = createRESTBaseGateway( getSpy ),
		expectedOptions = {
			url: '/api/rest_v1/page/summary/' + encodeURIComponent( 'Test Title' ),
			headers: {
				Accept: 'application/json; charset=utf-8; ' +
					'profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"'
			}
		};

	gateway.fetch( 'Test Title' );
	assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], expectedOptions, 'options' );
} );

QUnit.test( 'RESTBase provider uses extract parser', function ( assert ) {
	var getSpy = this.sandbox.spy(),
		gateway = createRESTBaseGateway();

	gateway.convertPageToModel( RESTBASE_RESPONSE, 512, getSpy );
	assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], RESTBASE_RESPONSE );
} );

QUnit.test( 'RESTBase gateway is correctly converting the page data to a model ', function ( assert ) {
	var gateway = createRESTBaseGateway();

	assert.deepEqual(
		gateway.convertPageToModel( RESTBASE_RESPONSE, 512, provideParsedExtract ),
		RESTBASE_RESPONSE_PREVIEW_MODEL
	);
} );

QUnit.test( 'RESTBase gateway doesn\'t stretch thumbnails', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();

	model = gateway.convertPageToModel( RESTBASE_RESPONSE, 2000, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE.originalimage,
		'If the requested thumbnail size is bigger than that of the orignal, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel( RESTBASE_RESPONSE, RESTBASE_RESPONSE.originalimage.height, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE.originalimage,
		'If the requested thumbnail size is the same as that of the original, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel( RESTBASE_RESPONSE_WITH_SMALL_IMAGE, 320, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE_WITH_SMALL_IMAGE.originalimage,
		'If the requested thumbnail can\'t be generated because the orignal is too small, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel( RESTBASE_RESPONSE_WITH_LANDSCAPE_IMAGE, 640, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		{
			source: 'http://foo/bar/baz.png/640px-baz.png',
			width: 640,
			height: 384 // ( 640 / 500 ) * 300
		},
		'When the requested thumbnail is scaled, then its largest dimension is preserved.'
	);
} );

QUnit.test( 'RESTBase gateway handles awkwardly thumbnails', function ( assert ) {
	var gateway = createRESTBaseGateway(),
		response,
		model;

	response = Object.assign( {}, RESTBASE_RESPONSE );
	response.thumbnail = Object.assign( {}, RESTBASE_RESPONSE.thumbnail );
	response.thumbnail.source = 'http://foo.bar/baz/Qux-320px-Quux.png/800px-Qux-320px-Quux.png';

	model = gateway.convertPageToModel( response, 500, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail.source,
		'http://foo.bar/baz/Qux-320px-Quux.png/400px-Qux-320px-Quux.png',
		'If the requested thumbnail size is the same as that of the original, then use the original.'
	);
} );

QUnit.test( 'RESTBase gateway stretches SVGs', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();

	model = gateway.convertPageToModel( SVG_RESTBASE_RESPONSE, 2000, provideParsedExtract );

	assert.equal(
		model.thumbnail.source,
		'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.svg/1600px-President_Barack_Obama.svg.png',
		'If the requested thumbnail is for an SVG, then it\'s always scaled.'
	);
} );

QUnit.test( 'RESTBase gateway handles the API failure', function ( assert ) {
	var deferred = $.Deferred(),
		api = this.sandbox.stub().returns( deferred.reject( { status: 500 } ).promise() ),
		gateway = createRESTBaseGateway( api );

	return gateway.getPageSummary( 'Test Title' ).catch( function () {
		assert.ok( true );
	} );

} );

QUnit.test( 'RESTBase gateway does not treat a 404 as a failure', function ( assert ) {
	var deferred = $.Deferred(),
		api = this.sandbox.stub().returns( deferred.reject( { status: 404 } ).promise() ),
		gateway = createRESTBaseGateway( api, { THUMBNAIL_SIZE: 200 }, provideParsedExtract );

	return gateway.getPageSummary( 'Test Title' ).then( function () {
		assert.ok( true );
	} );
} );

QUnit.test( 'RESTBase gateway returns the correct data ', function ( assert ) {
	var api = this.sandbox.stub().returns(
			$.Deferred().resolve( RESTBASE_RESPONSE ).promise()
		),
		gateway = createRESTBaseGateway( api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Test Title' ).then( function ( result ) {
		assert.deepEqual( result, RESTBASE_RESPONSE_PREVIEW_MODEL );
	} );
} );

QUnit.test( 'RESTBase gateway handles missing images ', function ( assert ) {
	var model,
		gateway = createRESTBaseGateway();
	model = gateway.convertPageToModel( RESTBASE_RESPONSE_WITHOUT_IMAGE, 300, provideParsedExtract );

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
			$.Deferred().reject( response ).promise()
		),
		gateway = createRESTBaseGateway( api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Missing Page' ).catch( function () {
		assert.ok( true );
	} );
} );
