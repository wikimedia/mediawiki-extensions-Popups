( function ( $, mw ) {

	QUnit.module( 'ext.popups' );
	QUnit.test( 'render.article.getProcessedHtml', function ( assert ) {
		QUnit.expect( 6 );

		function test ( extract, title, expected ) {
			assert.equal(
				mw.popups.render.article.getProcessedHtml( extract, title ),
				expected
			);
		}

		test(
			'Isaac Newton was born in', 'Isaac Newton',
			'<b>Isaac Newton</b> was born in'
		);

		test(
			'The C* language not to be confused with C# or C', 'C*',
			'The <b>C*</b> language not to be confused with C# or C'
		);

		test(
			'Person (was born in Location) is good', 'Person',
			'<b>Person</b> is good'
		);

		test(
			'Person (was born in Location (at Time)) is good', 'Person',
			'<b>Person</b> is good'
		);

		test(
			'Person (was born in Location (at Time) ) is good', 'Person',
			'<b>Person</b> is good'
		);

		test(
			'Brackets ) are funny ( when not used properly', 'Brackets',
			'<b>Brackets</b> ) are funny ( when not used properly'
		);

	} );

} ) ( jQuery, mediaWiki );
