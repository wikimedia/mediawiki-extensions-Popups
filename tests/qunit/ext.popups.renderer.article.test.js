( function ( $, mw ) {

	QUnit.module( 'ext.popups.renderer.renderers.article', {
		setup: function () {
			mw.popups.render.cache[ '/wiki/Kittens' ] = {};
			this.sandbox.stub( mw.popups, 'getTitle' ).returns( 'Kittens' );
			this.pageInfo = {
				thumbnail: {
					source: 'http://commons.wikimedia.org/kittypic.svg',
					width: 100,
					height: 300
				},
				revisions: [ { timestamp: '20160403020100' } ],
				extract: 'Cute.',
				title: 'Kittens',
				pagelanguagehtmlcode: 'en',
				pagelanguagedir: 'ltr'
			};
			this.kittenResponse = {
				query: {
					pages: [
						this.pageInfo
					]
				}
			};
			this.apiStub = this.sandbox.stub( mw.popups.api, 'get' ).returns(
				$.Deferred().resolve( this.kittenResponse )
			);
		}
	} );

	QUnit.test( 'render.article.createImgThumbnail', 1, function ( assert ) {
		var $container = mw.popups.render.renderers.article.createImgThumbnail( 'foo', '/w/test "123"(bar).gif' );
		assert.equal( $container.css( 'background-image' ), 'url("/w/test \\"123\\"(bar).gif")' );
	} );

	QUnit.test( 'render.article.getProcessedElements', function ( assert ) {
		QUnit.expect( 15 );

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

		test(
			'Evil Empire is the second studio album', 'Evil Empire (album)',
			'<b>Evil Empire</b> is the second studio album',
			'Extra information in title in paranthesis'
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

	QUnit.test( 'render.article.createSurveyLink', function ( assert ) {
		var $surveyLink;

		QUnit.expect( 2 );

		$surveyLink = mw.popups.render.renderers.article.createSurveyLink( 'http://path/to/resource' );

		assert.ok( /noreferrer/.test( $surveyLink.attr( 'rel' ) ), 'Survey link doesn\'t leak referrer information or `window.opener`' );

		// ---

		assert.throws(
			function () {
				mw.popups.render.renderers.article.createSurveyLink( 'htt://path/to/resource' );
			},
			new Error( 'The survey link URL, i.e. PopupsSurveyLink, must start with https or http.' )
		);
	} );

	QUnit.test( 'render.article.createPopup', function ( assert ) {
		var $popup, $thumbLink, $extractLink, cache;

		QUnit.expect( 6 );
		$popup = mw.popups.render.renderers.article.createPopup( this.pageInfo, '/wiki/Kittens' );
		$thumbLink = $popup.find( 'a' ).eq( 0 );
		$extractLink = $popup.find( 'a' ).eq( 1 );

		assert.ok( $thumbLink.hasClass( 'mwe-popups-discreet' ) );
		assert.strictEqual( $thumbLink.attr( 'href' ), '/wiki/Kittens' );
		assert.strictEqual( $extractLink.text(), 'Cute.', 'Text extract present.' );
		cache = mw.popups.render.cache[ '/wiki/Kittens' ];
		assert.strictEqual( cache.settings.title, 'Kittens' );
		assert.strictEqual( cache.settings.tall, true,
			'height is greater than width so marked as tall.' );
		assert.strictEqual( cache.settings.thumbnail, this.pageInfo.thumbnail,
			'thumbnail information got cached' );
	} );

	QUnit.asyncTest( 'render.article.init', function ( assert ) {
		var $kittyLink = $( '<a href="/wiki/Kittens">' ),
			apiStub = this.apiStub;

		QUnit.expect( 2 );
		mw.popups.render.renderers.article.init( $kittyLink );
		mw.popups.render.renderers.article.init( $kittyLink ).done( function () {
			var cache =  mw.popups.render.cache[ '/wiki/Kittens' ];
			QUnit.start();
			assert.ok( cache.popup.length, 'The popup is stored in cache.' );
			assert.ok( apiStub.calledTwice,
					'This method in current form is dumb and if called more than once will not load from cache.' );
		} );
	} );

} )( jQuery, mediaWiki );
