import { createModel, getPreviewType, previewTypes }
	from '../../../src/preview/model';
import { createStubTitle } from '../stubs';

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
		this.config = new Map();
		this.config.set( 'wgPopupsReferencePreviews', true );
		this.config.set( 'wgTitle', 'Foo' );
		this.config.set( 'wgNamespaceNumber', 1 );
		this.referenceLink = createStubTitle( 1, 'Foo', 'ref-fragment' );
		this.validEl = $( '<a>' ).appendTo( $( '<span>' ).addClass( 'reference' ) ).get( 0 );
	}
} );

QUnit.test( 'it uses the reference gateway with wgPopupsReferencePreviews == true and valid element', function ( assert ) {
	assert.strictEqual(
		getPreviewType( this.validEl, this.config, this.referenceLink ),
		previewTypes.TYPE_REFERENCE
	);
} );

QUnit.test( 'it does not suggest page previews on reference links when reference previews are disabled', function ( assert ) {
	this.config.set( 'wgPopupsReferencePreviews', false );

	assert.strictEqual(
		getPreviewType( this.validEl, this.config, this.referenceLink ),
		null
	);
} );

QUnit.test( 'it uses the page gateway when on links to a different page', function ( assert ) {
	assert.strictEqual(
		getPreviewType(
			this.validEl,
			this.config,
			createStubTitle( 1, 'NotFoo' )
		),
		previewTypes.TYPE_PAGE
	);

	assert.strictEqual(
		getPreviewType(
			this.validEl,
			this.config,
			createStubTitle( 1, 'NotFoo', 'fragment' )
		),
		previewTypes.TYPE_PAGE
	);

	assert.strictEqual(
		getPreviewType(
			this.validEl,
			this.config,
			createStubTitle( 2, 'Foo', 'fragment' )
		),
		previewTypes.TYPE_PAGE
	);
} );

QUnit.test( 'it does not use the reference gateway when there is no fragment', function ( assert ) {
	assert.strictEqual(
		getPreviewType(
			this.validEl,
			this.config,
			createStubTitle( 1, 'Foo' )
		),
		null
	);
} );

QUnit.test( 'it does not suggest page previews on reference links not having a parent with reference class', function ( assert ) {
	const el = $( '<a>' ).appendTo( $( '<span>' ) ).get( 0 );

	assert.strictEqual(
		getPreviewType( el, this.config, this.referenceLink ),
		null
	);
} );
