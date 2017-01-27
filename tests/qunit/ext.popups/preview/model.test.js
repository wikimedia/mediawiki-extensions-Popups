( function ( mw ) {

	var createModel = mw.popups.preview.createModel;

	QUnit.module( 'ext.popups.preview#createModel' );

	QUnit.test( 'it should copy the basic properties', function ( assert ) {
		var lastModified = mw.now(),
			thumbnail = {},
			model = createModel(
				'Foo',
				'https://en.wikipedia.org/wiki/Foo',
				'en',
				'ltr',
				'Foo bar baz.',
				lastModified,
				thumbnail
			);

		assert.strictEqual( model.title, 'Foo' );
		assert.strictEqual( model.url, 'https://en.wikipedia.org/wiki/Foo' );
		assert.strictEqual( model.languageCode, 'en' );
		assert.strictEqual( model.languageDirection, 'ltr' );
		assert.strictEqual( model.lastModified, lastModified );
		assert.strictEqual( model.thumbnail, thumbnail );
	} );

	QUnit.test( 'it computes the isRecent property', function ( assert ) {
		var now = mw.now(),
			twelveHours = 12 * 60 * 60 * 1000, // ms
			model;

		function createModelWithLastModified( lastModified ) {
			return createModel(
				'Foo',
				'https://en.wikipedia.org/wiki/Foo',
				'en',
				'ltr',
				'Foo bar baz.',
				lastModified
			);
		}

		model = createModelWithLastModified( now - twelveHours );

		assert.ok( model.isRecent );

		// ---

		model = createModelWithLastModified( now - 2 * twelveHours );

		assert.notOk(
			model.isRecent,
			'The page isn\'t considered recent if it was touched more than 24 hours ago.'
		);

		// ---

		model = createModelWithLastModified( undefined );

		assert.strictEqual( model.lastModified, undefined );
		assert.strictEqual(
			model.isRecent,
			undefined,
			'It shouldn\'t compute the isRecent property if it\'s not clear when the page was touched.'
		);
	} );

	QUnit.test( 'it computes the extract property', function ( assert ) {
		var cases = [
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
				extract,
				mw.now()
			);
		}

		$.each( cases, function ( _, testCase ) {
			var model = createModelWithExtract( testCase[0] );

			assert.strictEqual( model.extract, testCase[1] );
		} );

	} );

}( mediaWiki ) );
