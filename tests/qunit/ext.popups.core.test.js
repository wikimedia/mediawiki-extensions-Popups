( function ( $, mw ) {

	QUnit.module( 'ext.popups.core', QUnit.newMwEnvironment( {
		config: {
			wgArticlePath: '/wiki/$1'
		}
	} ) );

	QUnit.test( 'getTitle', function ( assert ) {
		var cases, i, expected, actual;

		QUnit.expect( 11 );
		cases = [
			[ '/wiki/Foo', 'Foo' ],
			[ '/wiki/Foo#Bar', 'Foo' ],
			[ '/wiki/Foo?oldid=1', undefined ],
			[ '/wiki/%E6%B8%AC%E8%A9%A6', '測試' ],
			[ '/w/index.php?title=Foo', 'Foo' ],
			[ '/w/index.php?title=Foo#Bar', 'Foo' ],
			[ '/w/Foo?title=Foo&action=edit', undefined ],
			[ '/w/index.php?title=%E6%B8%AC%E8%A9%A6', '測試' ],
			[ '/w/index.php?oldid=1', undefined ],
			[ '/Foo', undefined ],
			/*jshint  -W107 */
			[ 'javascript:void(0);', undefined ]
			/*jshint +W107 */
		];

		for ( i = 0; i < cases.length; i++ ) {
			expected = cases[ i ][ 1 ];
			actual = mw.popups.getTitle( cases[ i ][ 0 ] );
			assert.equal( actual, expected );
		}
	} );

	QUnit.test( 'removeTooltips', function ( assert ) {
		var $link = $( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '#'  // `href` is needed for testing the `focus` event
		} ).appendTo( 'body' );

		QUnit.expect( 5 );

		mw.popups.removeTooltips( $link );

		$link.trigger( 'mouseenter' );
		assert.equal( $link.attr( 'title' ), '', 'The link does not have a title on mouseenter.' );

		$link.trigger( 'mouseleave' );
		assert.equal( $link.attr( 'title' ), 'link title', 'The link has a title on mouseleave.' );

		$link.trigger( 'focus' );
		assert.equal( $link.attr( 'title' ), '', 'The link does not have a title on focus.' );

		$link.trigger( 'blur' );
		assert.equal( $link.attr( 'title' ), 'link title', 'The link has a title on blur.' );

		$link.data( 'dont-empty-title', true );
		$link.trigger( 'mouseenter' );
		assert.equal( $link.attr( 'title' ), 'link title',
			'The link title is not removed when `dont-empty-title` data attribute is `true`.' );

		$link.remove();
	} );

	QUnit.test( 'selectPopupElements', function ( assert ) {
		var $originalContent = mw.popups.$content,
			IGNORE_CLASSES = [
				'.extiw',
				'.image',
				'.new',
				'.internal',
				'.external',
				'.oo-ui-buttonedElement-button'
			],
			$cancelLink = $( '<span>', {
				class: 'cancelLink'
			} );

		QUnit.expect( 1 );

		mw.popups.$content = $( '<div>' );

		// add links that we know will be ignored
		$.each( IGNORE_CLASSES, function ( i, className ) {
			$( '<a>', {
				text: 'link with tooltip',
				title: 'link title',
				class: className.substring( 1 ),
				href: '/wiki/Popups'
			} ).appendTo( mw.popups.$content );
		} );

		// add a link that's part of a .cancelLink
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '/wiki/Popups'
		} ).appendTo( $cancelLink );
		$cancelLink.appendTo( mw.popups.$content );

		// add a link without `href`, which means the link doesn't point to a valid page
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title'
		} ).appendTo( mw.popups.$content );

		// Add a link that's not in a content namespace.
		$( '<a>', {
			text: 'link with tooltip',
			title: 'foo.jpg',
			href: '/wiki/File:foo.jpg'
		} ).appendTo( mw.popups.$content );

		// add a link that will have a hover card
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '/wiki/Popups'
		} ).appendTo( mw.popups.$content );

		// only the last link above should be selected for having a hover card
		assert.equal(
			mw.popups.selectPopupElements().length,
			1,
			'Explicitly ignored links and links that do not have a `href` attribute are not considered for having a popup.' );

		mw.popups.$content = $originalContent;
	} );

	QUnit.test( 'setupTriggers', function ( assert ) {
		var $link = $( '<a>', {
				text: 'Popups',
				title: 'Popups',
				href: '#'
			} ).appendTo( 'body' ),
			originalScrolled = mw.popups.scrolled,
			renderSpy = this.sandbox.stub( mw.popups.render, 'render', $.noop ),
			$renderedElement;

		assert.expect( 1 );

		mw.popups.setupTriggers( $link );

		mw.popups.scrolled = false;
		$link.trigger( 'mouseenter' );

		$renderedElement = renderSpy.firstCall.args[ 0 ];

		assert.strictEqual(
			// Compare the underlying element rather than (likely) differing instances of the jQuery
			// class.
			$renderedElement.get( 0 ),
			$link.get( 0 ),
			'When the "mouseenter" event fires then the underlying element is passed to the renderer.'
		);

		// Restore original state.
		mw.popups.scrolled = originalScrolled;
		$link.remove();
	} );

} )( jQuery, mediaWiki );
