( function ( $, mw ) {

	QUnit.module( 'ext.popups.renderer.renderers.article', QUnit.newMwEnvironment() );

	QUnit.test( 'render.article.getProcessedElements', function ( assert ) {
		QUnit.expect( 14 );

		function test( extract, title, expected, msg ) {
			var $div = $( '<div>' ).append(
				mw.popups.render.renderers.article.getProcessedElements( extract, title )
			);
			assert.equal( $div.html(), expected, msg );
		}

		test(
			'Isaac Newton was born in', 'Isaac Newton',
			'<b>Isaac Newton</b> was born in',
			'Title as first word'
		);

		test(
			'The C* language not to be confused with C# or C', 'C*',
			'The <b>C*</b> language not to be confused with C# or C',
			'Title containing *'
		);

		test(
			'Person (was born in Location) is good', 'Person',
			'<b>Person</b> is good',
			'Extract with text in parentheses'
		);

		test(
			'Person, (was born in Location) is good', 'Person',
			'<b>Person</b>, is good',
			'Comma after title'
		);

		test(
			'Person (was born in Location (at Time)) is good', 'Person',
			'<b>Person</b> is good',
			'Extract with nested parentheses'
		);

		test(
			'Person (was born in Location (at Time) ) is good', 'Person',
			'<b>Person</b> is good',
			'Extract with nested parentheses and random spaces'
		);

		test(
			'I like trains', 'Train',
			'I like <b>train</b>s',
			'Make the simple plural bold'
		);

		test(
			'Brackets ) are funny ( when not used properly', 'Brackets',
			'<b>Brackets</b> ) are funny ( when not used properly',
			'Extract with unbalanced parentheses'
		);

		test(
			'Vappu (born August 7), also known as Lexy', 'Vappu',
			'<b>Vappu</b>, also known as Lexy',
			'Spaces around bracketed text should be removed'
		);

		test(
			'Epic XSS <script>alert("XSS")</script> is epic', 'Epic XSS',
			'<b>Epic XSS</b> &lt;script&gt;alert&lt;/script&gt; is epic',
			'XSS Attack'
		);

		test(
			'Foo\'s pub is a pub in Bar', 'Foo\'s pub',
			'<b>Foo\'s pub</b> is a pub in Bar',
			'Correct escaping'
		);

		test(
			'\"Heroes\" is a David Bowie album', '\"Heroes\"',
			'<b>\"Heroes\"</b> is a David Bowie album',
			'Quotes in title'
		);

		test(
			'*Testing if Things are correctly identified', 'Things',
			'*Testing if <b>Things</b> are correctly identified',
			'Article that begins with asterisk'
		);

		test(
			'Testing if repeated words are not matched when repeated', 'Repeated',
			'Testing if <b>repeated</b> words are not matched when repeated',
			'Repeated title'
		);

	} );
	QUnit.test( 'render.article.getClosestYPosition', function ( assert ) {
		QUnit.expect( 3 );
		assert.equal( mw.popups.render.getClosestYPosition( 100, [
			{
				top: 99,
				bottom: 119
			},
			{
				top: 120,
				bottom: 140
			}
		] ), 119, 'Correct lower Y.' );

		assert.equal( mw.popups.render.getClosestYPosition( 100, [
			{
				top: 99,
				bottom: 119
			},
			{
				top: 120,
				bottom: 140
			}
		], true ), 99, 'Correct upper Y.' );

		assert.equal( mw.popups.render.getClosestYPosition( 135, [
			{
				top: 99,
				bottom: 119
			},
			{
				top: 120,
				bottom: 140
			}
		], true ), 120, 'Correct upper Y 2.' );
	} );

} )( jQuery, mediaWiki );
