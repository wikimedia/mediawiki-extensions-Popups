import { createModel } from '../../../src/preview/model';
import createRESTBaseGateway from '../../../src/gateway/rest';

const DEFAULT_CONSTANTS = {
		THUMBNAIL_SIZE: 512,
		endpoint: '/api/rest_v1/page/summary/'
	},
	RESTBASE_RESPONSE = {
		type: 'standard',
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
		type: 'standard',
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
		type: 'standard',
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
		type: 'standard',
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
	// As above, a no "px-" thumbnail is provided which is not customizable.
	RESTBASE_RESPONSE_WITH_NO_PX_IMAGE = {
		type: 'standard',
		title: 'Barack Obama',
		extract: 'Barack Hussein Obama II born August 4, 1961) ...',
		thumbnail: {
			source: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg',
			width: 800,
			height: 1000
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
	RESTBASE_RESPONSE_WITH_LANDSCAPE_IMAGE = {
		type: 'standard',
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
	RESTBASE_RESPONSE_DISAMBIGUATION = {
		type: 'disambiguation',
		title: 'Barack (disambiguation)',
		extract: 'Barack Hussein Obama II born August 4, 1961) ...',
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
		'standard',
		{
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
			width: 409,
			height: 512
		}
	),
	RESTBASE_RESPONSE_DISAMBIGUATION_MODEL = createModel(
		'Barack (disambiguation)',
		'url/Barack (disambiguation)',
		'en',
		'ltr',
		'!Barack Hussein Obama II born August 4, 1961) ...!',
		'disambiguation'
	);

function provideParsedExtract( page ) {
	return `!${ page.extract }!`;
}

QUnit.module( 'gateway/rest', {
	beforeEach() {
		window.mediaWiki.Title = function ( title ) {
			this.getUrl = () => `url/${ title }`;
		};
	},
	afterEach() {
		window.mediaWiki.Title = null;
	}
} );

QUnit.test( 'RESTBase gateway is called with correct arguments', function ( assert ) {
	const getSpy = this.sandbox.spy(),
		gateway = createRESTBaseGateway( getSpy, DEFAULT_CONSTANTS ),
		expectedOptions = {
			url: DEFAULT_CONSTANTS.endpoint + encodeURIComponent( 'Test Title' ),
			headers: {
				Accept: 'application/json; charset=utf-8; ' +
					'profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"'
			}
		};

	gateway.fetch( 'Test Title' );
	assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], expectedOptions, 'options' );
} );

QUnit.test( 'RESTBase provider uses extract parser', function ( assert ) {
	const getSpy = this.sandbox.spy(),
		gateway = createRESTBaseGateway();

	gateway.convertPageToModel( RESTBASE_RESPONSE, 512, getSpy );
	assert.deepEqual( getSpy.getCall( 0 ).args[ 0 ], RESTBASE_RESPONSE );
} );

QUnit.test( 'RESTBase gateway is correctly converting the page data to a model', ( assert ) => {
	const gateway = createRESTBaseGateway();

	assert.deepEqual(
		gateway.convertPageToModel( RESTBASE_RESPONSE, 512, provideParsedExtract ),
		RESTBASE_RESPONSE_PREVIEW_MODEL
	);
} );

QUnit.test( 'RESTBase gateway is correctly converting the page data to a disambiguation model', ( assert ) => {
	const gateway = createRESTBaseGateway();

	assert.deepEqual(
		gateway.convertPageToModel( RESTBASE_RESPONSE_DISAMBIGUATION,
			512, provideParsedExtract ),
		RESTBASE_RESPONSE_DISAMBIGUATION_MODEL
	);
} );

QUnit.test( 'RESTBase gateway doesn\'t stretch thumbnails', ( assert ) => {
	const gateway = createRESTBaseGateway();

	let model = gateway.convertPageToModel(
		RESTBASE_RESPONSE, 2000, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE.originalimage,
		'If the requested thumbnail size is bigger than that of the original, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel(
		RESTBASE_RESPONSE,
		RESTBASE_RESPONSE.originalimage.height,
		provideParsedExtract
	);

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE.originalimage,
		'If the requested thumbnail size is the same as that of the original, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel(
		RESTBASE_RESPONSE_WITH_SMALL_IMAGE, 320, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail,
		RESTBASE_RESPONSE_WITH_SMALL_IMAGE.originalimage,
		'If the requested thumbnail can\'t be generated because the original is too small, then use the original.'
	);

	// ---
	model = gateway.convertPageToModel(
		RESTBASE_RESPONSE_WITH_LANDSCAPE_IMAGE, 640, provideParsedExtract );

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

QUnit.test( 'RESTBase gateway handles thumbnail URLs with missing dimensions', ( assert ) => {
	const gateway = createRESTBaseGateway();
	const model = gateway.convertPageToModel(
		RESTBASE_RESPONSE_WITH_NO_PX_IMAGE, 300, provideParsedExtract );

	assert.equal(
		model.thumbnail.source,
		'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg',
		'If restbase handles missing image dimensions in thumbnail URLs'
	);
} );

QUnit.test( 'RESTBase gateway handles awkward thumbnails', ( assert ) => {
	const gateway = createRESTBaseGateway();

	const response = Object.assign( {}, RESTBASE_RESPONSE );
	response.thumbnail = Object.assign( {}, RESTBASE_RESPONSE.thumbnail );
	response.thumbnail.source = 'http://foo.bar/baz/Qux-320px-Quux.png/800px-Qux-320px-Quux.png';

	const model =
		gateway.convertPageToModel( response, 500, provideParsedExtract );

	assert.deepEqual(
		model.thumbnail.source,
		'http://foo.bar/baz/Qux-320px-Quux.png/400px-Qux-320px-Quux.png',
		'If the requested thumbnail size is the same as that of the original, then use the original.'
	);
} );

QUnit.test( 'RESTBase gateway stretches SVGs', ( assert ) => {
	const gateway = createRESTBaseGateway();

	const model = gateway.convertPageToModel(
		SVG_RESTBASE_RESPONSE, 2000, provideParsedExtract );

	assert.equal(
		model.thumbnail.source,
		'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.svg/1600px-President_Barack_Obama.svg.png',
		'If the requested thumbnail is for an SVG, then it\'s always scaled.'
	);
} );

QUnit.test( 'RESTBase gateway handles API failure', function ( assert ) {
	const api = this.sandbox.stub()
			.returns( $.Deferred().reject( { status: 500 } ).promise() ),
		gateway = createRESTBaseGateway( api, {} );

	return gateway.getPageSummary( 'Test Title' ).catch( () => {
		assert.ok( true );
	} );
} );

QUnit.test( 'RESTBase gateway does not treat a 404 as a failure', function ( assert ) {
	const response = {
			status: 404,
			type: 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found',
			title: 'Not found.',
			method: 'get',
			detail: 'Page or revision not found.',
			uri: '/en.wikipedia.org/v1/page/summary/Missing_page'
		},
		api = this.sandbox.stub().returns(
			$.Deferred().reject( response ).promise()
		),
		gateway = createRESTBaseGateway(
			api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Missing Page' ).then( ( result ) => {
		assert.equal( result.title, 'Missing Page', 'Title' );
		// Extract is undefined since the parser is only invoked for successful
		// responses.
		assert.equal( result.extract, undefined, 'Extract' );
	} );
} );

QUnit.test( 'RESTBase gateway returns the correct data ', function ( assert ) {
	const api = this.sandbox.stub().returns(
			$.Deferred().resolve( RESTBASE_RESPONSE ).promise()
		),
		gateway = createRESTBaseGateway(
			api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Test Title' ).then( ( result ) => {
		assert.deepEqual( result, RESTBASE_RESPONSE_PREVIEW_MODEL );
	} );
} );

QUnit.test( 'RESTBase gateway handles missing images ', ( assert ) => {
	const gateway = createRESTBaseGateway();
	const model = gateway.convertPageToModel(
		RESTBASE_RESPONSE_WITHOUT_IMAGE, 300, provideParsedExtract );

	assert.equal(
		model.originalimage,
		undefined,
		'If restbase handles missing image information'
	);
} );

QUnit.test( 'RESTBase gateway handles missing extracts', function ( assert ) {
	const
		api = this.sandbox.stub().returns( $.Deferred().resolve( {} ).promise() ),
		gateway = createRESTBaseGateway(
			api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Test Title with missing extract' )
		.then( ( result ) => {
			assert.equal( result.title, 'Test Title with missing extract', 'Title' );
			assert.equal( result.extract, '!!', 'Extract' );
		} );
} );

QUnit.test( 'RESTBase gateway handles no content success responses', function ( assert ) {
	const api = this.sandbox.stub()
			.returns( $.Deferred().resolve( { status: 204 } ).promise() ),
		gateway = createRESTBaseGateway(
			api, DEFAULT_CONSTANTS, provideParsedExtract );

	return gateway.getPageSummary( 'Test Title with empty response' )
		.then( ( result ) => {
			assert.equal( result.title, 'Test Title with empty response', 'Title' );
			assert.equal( result.extract, '!!', 'Extract' );
		} );
} );
