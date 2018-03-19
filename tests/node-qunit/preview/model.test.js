import { createModel, previewTypes }
	from '../../../src/preview/model';

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

	assert.strictEqual( model.title, 'Foo' );
	assert.strictEqual( model.url, 'https://en.wikipedia.org/wiki/Foo' );
	assert.strictEqual( model.languageCode, 'en' );
	assert.strictEqual( model.languageDirection, 'ltr' );
	assert.strictEqual( model.type, previewTypes.TYPE_PAGE );
	assert.strictEqual( model.thumbnail, thumbnail );
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
