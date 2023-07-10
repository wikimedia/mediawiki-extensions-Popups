import {
	createModel, getPreviewType, previewTypes, registerModel, test,
	isAnythingEligible, findNearestEligibleTarget, createNullModel
} from '../../../src/preview/model';

QUnit.module( 'ext.popups.preview#createModel' );

QUnit.test( 'it should copy the basic properties', ( assert ) => {
	const thumbnail = {},
		model = createModel(
			'Foo',
			'https://en.wikipedia.org/wiki/Foo',
			'en',
			'ltr',
			'Foo bar baz.',
			'standard',
			thumbnail
		);

	assert.strictEqual(
		model.title,
		'Foo',
		'The title is passed.'
	);
	assert.strictEqual(
		model.url,
		'https://en.wikipedia.org/wiki/Foo',
		'The URL is generated.'
	);
	assert.strictEqual(
		model.languageCode,
		'en',
		'The language code is passed.'
	);
	assert.strictEqual(
		model.languageDirection,
		'ltr',
		'The language direction is passed.'
	);
	assert.strictEqual(
		model.type,
		previewTypes.TYPE_PAGE,
		'The preview type is "page preview".'
	);
	assert.strictEqual( model.thumbnail, thumbnail, 'The thumbnail is passed' );
} );

QUnit.test( 'it computes the type property', ( assert ) => {
	function createModelWith( { extract, type } ) {
		return createModel(
			'Foo',
			'https://en.wikipedia.org/wiki/Foo',
			'en',
			'ltr',
			extract,
			type
		);
	}

	assert.strictEqual(
		createModelWith( { extract: 'Foo', type: 'standard' } ).type,
		previewTypes.TYPE_PAGE,
		'A non-generic ("page") preview has an extract and type "standard" property.'
	);

	assert.strictEqual(
		createModelWith( { extract: 'Foo', type: undefined } ).type,
		previewTypes.TYPE_PAGE,
		'A non-generic ("page") preview has an extract with an undefined "type" property.'
	);

	assert.strictEqual(
		createModelWith( { extract: undefined, type: undefined } ).type,
		previewTypes.TYPE_GENERIC,
		'A generic ("empty") preview has an undefined extract and an undefined "type" property.'
	);

	assert.strictEqual(
		createModelWith( { extract: undefined, type: 'standard' } ).type,
		previewTypes.TYPE_GENERIC,
		'A generic ("empty") preview has an undefined extract regardless of "type".'
	);

	assert.strictEqual(
		createModelWith( { extract: 'Foo', type: 'disambiguation' } ).type,
		previewTypes.TYPE_DISAMBIGUATION,
		'A disambiguation preview has an extract and type ("disambiguation") property.'
	);
} );

QUnit.module( 'ext.popups.preview#getPreviewType', {
	beforeEach() {
		this.referenceLink = $( '<a>' )
			.attr( 'href', '#RefLink' )
			.appendTo( $( '<span>' ).addClass( 'reference' ) ).get( 0 );
		this.referenceLinkNoFragment = $( '<a>' )
			.attr( 'href', '/wiki/Url' )
			.appendTo( $( '<span>' ).addClass( 'reference' ) ).get( 0 );
		this.validEl = $( '<a>' ).appendTo( $( '<span>' ).addClass( 'reference' ) ).get( 0 );
		this.registerRefModel = () => {
			registerModel(
				previewTypes.TYPE_REFERENCE,
				'.reference a[ href*="#" ]'
			);
		};
	},
	afterEach() {
		test.reset();
	}
} );

QUnit.test( 'isAnythingEligible returns false by default', function ( assert ) {
	test.reset();
	assert.strictEqual(
		isAnythingEligible(),
		false
	);
} );

QUnit.test( 'isAnythingEligible returns true when model is registered', function ( assert ) {
	this.registerRefModel();
	assert.strictEqual(
		isAnythingEligible(),
		true
	);
} );

QUnit.test( 'it uses the reference gateway with valid element', function ( assert ) {
	this.registerRefModel();
	assert.strictEqual(
		getPreviewType( this.referenceLink ),
		previewTypes.TYPE_REFERENCE
	);
} );

QUnit.test( 'it does not suggest page previews on reference links when reference previews are not registered', function ( assert ) {
	assert.strictEqual(
		getPreviewType( this.referenceLink ),
		null
	);
} );

QUnit.test( 'it uses the page gateway when on links to a different page', function ( assert ) {
	registerModel(
		previewTypes.TYPE_PAGE,
		'a'
	);
	assert.strictEqual(
		getPreviewType(
			this.validEl
		),
		previewTypes.TYPE_PAGE
	);
} );

QUnit.test( 'it does not use the reference gateway when there is no fragment', function ( assert ) {
	this.registerRefModel();
	assert.strictEqual(
		getPreviewType(
			this.referenceLinkNoFragment
		),
		null
	);
} );

QUnit.test( 'it does not suggest page previews on reference links not having a parent with reference class', function ( assert ) {
	const el = $( '<a>' ).appendTo( $( '<span>' ) ).get( 0 );
	this.registerRefModel();
	assert.strictEqual(
		getPreviewType( el ),
		null
	);
} );

QUnit.test( 'findNearestEligibleTarget returns null by default', function ( assert ) {
	test.reset();
	assert.strictEqual(
		findNearestEligibleTarget( document.createElement( 'div' ) ),
		null
	);
} );

QUnit.test( 'createNullModel returns an empty page preview model', function ( assert ) {
	const testTitle = 'test title';
	const testUrl = 'test://url.com';
	const nullModel = createNullModel( testTitle, testUrl );
	assert.strictEqual(
		nullModel.title,
		testTitle
	);
	assert.strictEqual(
		nullModel.url,
		testUrl
	);
} );
