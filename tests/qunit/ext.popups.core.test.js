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

	// FIXME: This test should be split to cover each function separately and a browser test should
	// be created to test user interactions with focus and mouseenter - planned for the Hovercards rewrite
	QUnit.test( 'removeTooltip and restoreTooltip', function ( assert ) {
		var $link = $( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '#'  // `href` is needed for testing the `focus` event
		} ).appendTo( 'body' );

		QUnit.expect( 5 );

		mw.popups.removeTooltip( $link );
		assert.equal( $link.attr( 'title' ), '', 'The title should be removed by `removeTooltip`.' );

		mw.popups.restoreTooltip( $link );
		assert.equal( $link.attr( 'title' ), 'link title', 'The title should be restored by `restoreTooltip`.' );

		mw.popups.removeTooltip( $link );
		assert.equal( $link.attr( 'title' ), '', 'Multiple calls should still remove title attribute' );

		mw.popups.restoreTooltip( $link );
		assert.equal( $link.attr( 'title' ), 'link title', 'Multiple calls should still restore title attribute.' );

		$link.data( 'dont-empty-title', true );
		mw.popups.removeTooltip( $link );
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

		mw.popups.setupTriggers( $link, 'mouseenter focus' );

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

	QUnit.test( 'getAction', function ( assert ) {
		var i, expected, actual,
			// 0 - main button, 1 - middle button
			cases = [
				[ { button: 0 }, 'opened in same tab' ],
				[ { button: 0, ctrlKey: true }, 'opened in new tab' ],
				[ { button: 0, metaKey: true }, 'opened in new tab' ],
				[ { button: 0, ctrlKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, metaKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, ctrlKey: true, metaKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, shiftKey: true }, 'opened in new window' ],
				[ { button: 1 }, 'opened in new tab' ],
				[ { button: 1, shiftKey: true }, 'opened in new tab' ]
			];

		QUnit.expect( cases.length );

		for ( i = 0; i < cases.length; i++ ) {
			expected = cases[ i ][ 1 ];
			actual = mw.popups.getAction( new MouseEvent( 'CustomEvent', cases[ i ][ 0 ] ) );
			assert.equal( actual, expected );
		}
	} );

	QUnit.test( 'getRandomToken', function ( assert ) {
		var token;

		QUnit.expect( 3 );

		token = mw.popups.getRandomToken();
		assert.ok(
			token.length > mw.user.generateRandomSessionId().length,
			'Random token is long enough.'
		);

		assert.ok(
			typeof token === 'string',
			'Random token is a string.'
		);

		assert.notEqual(
			mw.popups.getRandomToken(),
			token,
			'Newly generated random token is not equal to the one generated earlier.'
		);
	} );

	QUnit.test( 'getPreviewCountBucket', function ( assert ) {
		var i, previewCount, bucket,
			cases = [
				[ '0', '0 previews' ],
				[ '1', '1-4 previews' ],
				[ '2', '1-4 previews' ],
				[ '4', '1-4 previews' ],
				[ '5', '5-20 previews' ],
				[ '10', '5-20 previews' ],
				[ '20', '5-20 previews' ],
				[ '21', '21+ previews' ],
				[ '100', '21+ previews' ],
				[ '1000', '21+ previews' ]
			],
			storageKey = 'ext.popups.core.previewCount',
			mwStorageStub = this.sandbox.stub( mw.storage, 'get' )
				.withArgs( storageKey );

		QUnit.expect( cases.length + 1 );

		mwStorageStub.returns( false );
		assert.equal(
			mw.popups.getPreviewCountBucket(),
			'unknown',
			'Preview count bucket is `unkown` when localStorage is unsupported.'
		);

		for ( i = 0; i < cases.length; i++ ) {
			previewCount = cases[ i ][ 0 ];
			mwStorageStub.returns( previewCount );
			bucket = mw.popups.getPreviewCountBucket();
			assert.equal(
				bucket,
				cases[ i ][ 1 ],
				'Preview count bucket is "' + bucket + '" when preview count is ' +
				previewCount + '.'
			);
		}
	} );

	QUnit.test( 'incrementPreviewCount', function ( assert ) {
		var storageKey = 'ext.popups.core.previewCount',
			mwStorageGetStub = this.sandbox.stub( mw.storage, 'get' )
				.withArgs( storageKey ),
			mwStorageSetStub = this.sandbox.stub( mw.storage, 'set' );

		QUnit.expect( 3 );

		mwStorageGetStub.returns( null );
		mw.popups.incrementPreviewCount();
		assert.equal(
			mwStorageSetStub.firstCall.args[ 1 ],
			1,
			'Incrementing the preview count to 1 when no value has' +
			' been saved in localStorage yet.'
		);

		mwStorageGetStub.returns( '1' );
		mw.popups.incrementPreviewCount();
		assert.equal(
			mwStorageSetStub.secondCall.args[ 1 ],
			2,
			'Incrementing the preview count to 2 when the value in localStorage' +
			' is already "1".'
		);

		mwStorageGetStub.returns( '5' );
		mw.popups.incrementPreviewCount();
		assert.equal(
			mwStorageSetStub.thirdCall.args[ 1 ],
			6,
			'Incrementing the preview count to 6 when the value in localStorage' +
			' is already "5".'
		);
	} );

	QUnit.test( 'saveEnabledState', function ( assert ) {
		var storageKey = 'mwe-popups-enabled',
			deviceStorageStub = this.sandbox.stub( mw.storage, 'set' )
				.withArgs( storageKey );

		QUnit.expect( 2 );

		mw.popups.saveEnabledState( true );
		assert.equal(
			deviceStorageStub.firstCall.args[ 1 ],
			'1',
			'Popups enabled state has been saved as "true".'
		);

		mw.popups.saveEnabledState( false );
		assert.equal(
			deviceStorageStub.secondCall.args[ 1 ],
			'0',
			'Popups enabled state has been saved as "false".'
		);
	} );

	QUnit.test( 'getEnabledState', function ( assert ) {
		var storageKey = 'mwe-popups-enabled',
			mwConfigStub = this.sandbox.stub( mw.config, 'get' )
				.withArgs( 'wgPopupsExperiment' ),
			deviceStorageStub = this.sandbox.stub( mw.storage, 'get' )
				.withArgs( storageKey ),
			experimentStub = this.sandbox.stub( mw.popups,
				'isUserInCondition' );

		QUnit.expect( 7 );

		mwConfigStub.returns( null );
		deviceStorageStub.returns( null );
		assert.equal(
			mw.popups.getEnabledState(),
			true,
			'Popups are enabled when the experiment is not running, nor has' +
			' Popups been disabled via the settings.'
		);

		mwConfigStub.returns( null );
		deviceStorageStub.returns( '1' );
		assert.equal(
			mw.popups.getEnabledState(),
			true,
			'Popups are enabled when the experiment is not running and when' +
			' Popups has been enabled via the settings.'
		);

		mwConfigStub.returns( null );
		deviceStorageStub.returns( '0' );
		assert.equal(
			mw.popups.getEnabledState(),
			false,
			'Popups are disabled when the experiment is not running and when' +
			' Popups has been disabled via the settings.'
		);

		mwConfigStub.returns( false );
		deviceStorageStub.returns( '1' );
		assert.equal(
			mw.popups.getEnabledState(),
			true,
			'Popups are enabled when the experiment is disabled and when' +
			' Popups has been enabled via the settings.'
		);

		mwConfigStub.returns( false );
		deviceStorageStub.returns( '0' );
		assert.equal(
			mw.popups.getEnabledState(),
			false,
			'Popups are disabled when the experiment is disabled and when' +
			' Popups has been disabled via the settings.'
		);

		mwConfigStub.returns( true );
		experimentStub.returns( true );
		assert.equal(
			mw.popups.getEnabledState(),
			true,
			'Popups are disabled when the experiment is running and ' +
			' the user is bucketed.'
		);

		mwConfigStub.returns( true );
		experimentStub.returns( false );
		assert.equal(
			mw.popups.getEnabledState(),
			false,
			'Popups are disabled when the experiment is running and ' +
			' the user is not bucketed.'
		);
	} );
} )( jQuery, mediaWiki );
