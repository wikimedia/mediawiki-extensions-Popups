var model = require( '../../../src/preview/model' ),
	createModel = model.createModel,
	TYPE_PAGE = model.TYPE_PAGE,
	TYPE_GENERIC = model.TYPE_GENERIC;

QUnit.module( 'ext.popups.preview#createModel' );

QUnit.test( 'it should copy the basic properties', function ( assert ) {
	var thumbnail = {},
		model = createModel(
			'Foo',
			'https://en.wikipedia.org/wiki/Foo',
			'en',
			'ltr',
			'Foo bar baz.',
			thumbnail
		);

	assert.strictEqual( model.title, 'Foo' );
	assert.strictEqual( model.url, 'https://en.wikipedia.org/wiki/Foo' );
	assert.strictEqual( model.languageCode, 'en' );
	assert.strictEqual( model.languageDirection, 'ltr' );
	assert.strictEqual( model.thumbnail, thumbnail );
} );

QUnit.test( 'it computes the extract property', function ( assert ) {
	var i, testCase, cases = [
			// removeEllipsis
			[ '', undefined ],
			[ 'Extract...', 'Extract' ],
			[ 'Extract.', 'Extract.' ],
			[ '...', undefined ],

			// removeParentheticals
			[ 'Foo', 'Foo' ],
			[ 'Foo (', 'Foo (' ],
			[ 'Foo (Bar)', 'Foo' ],
			[ 'Foo (Bar))', 'Foo (Bar))' ],
			[ 'Foo )(Bar)', 'Foo )(Bar)' ],
			[ '(Bar)', undefined ]
		];

	function createModelWithExtract( extract ) {
		return createModel(
			'Foo',
			'https://en.wikipedia.org/wiki/Foo',
			'en',
			'ltr',
			extract
		);
	}

	for ( i = 0; i < cases.length; i++ ) {
		testCase = cases[ i ],
			model = createModelWithExtract( testCase[ 0 ] );

		assert.strictEqual( model.extract, testCase[ 1 ] );
	}

	// ---
	// It computes the type property...

	model = createModelWithExtract( 'Foo' );

	assert.strictEqual(
		model.type,
		TYPE_PAGE,
		'A non-generic ("page") preview has an extract.'
	);

	model = createModelWithExtract( '' );

	assert.strictEqual(
		model.type,
		TYPE_GENERIC,
		'A generic preview has an undefined extract.'
	);
} );
