( function ( mw, $ ) {

	QUnit.module( 'ext.popups/processLinks', {
		setup: function () {
			this.config = new mw.Map();
			this.config.set( {
				wgArticlePath: '/wiki/$1',
				wgContentNamespaces: [0]
			} );

			this.blacklist = [
				'.extiw',
				'.image',
				'.new',
				'.internal',
				'.external',
				'.oo-ui-buttonedElement-button',
				'.cancelLink a'
			];
		}
	} );

	QUnit.test( '#processLinks', 1, function ( assert ) {
		var $container = $( '<div>' ),
			$cancelLink = $( '<span>', {
				class: 'cancelLink'
			} );

		// Add links that should be filtered.
		$.each( ['extiw', 'new', 'external'], function ( i, className ) {
			$( '<a>', {
				text: 'link with tooltip',
				title: 'link title',
				class: className,
				href: '/wiki/Popups'
			} ).appendTo( $container );
		} );

		// Add a link inside of a container.
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '/wiki/Popups'
		} ).appendTo( $cancelLink );
		$cancelLink.appendTo( $container );

		// Add a link without an href, which means the link doesn't point to a valid
		// page.
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title'
		} ).appendTo( $container );

		// Add a link that's not in a content namespace.
		$( '<a>', {
			text: 'link with tooltip',
			title: 'foo.jpg',
			href: '/wiki/File:foo.jpg'
		} ).appendTo( $container );

		// Add a link without a title.
		$( '<a>', {
			text: 'link with tooltip',
			href: '/wiki/File:foo.jpg'
		} ).appendTo( $container );

		// Add a link that should have a Page Preview.
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			href: '/wiki/Popups'
		} ).appendTo( $container );

		assert.equal(
			mw.popups.processLinks( $container, this.blacklist, this.config ).length,
			1
		);
	} );

	QUnit.test( 'it gets the title of local pages', function ( assert ) {
		var cases,
			$container = $( '<div>' ),
			$processedLinks;

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
			[ 'javascript:void(0);', undefined ],
			/*jshint +W107 */

			[ 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', undefined ]
		];

		$.each( cases, function ( _, testCase ) {
			$( '<a>', {
				href: testCase[0],
				title: 'link title'
			} ).appendTo( $container );
		} );

		$processedLinks = mw.popups.processLinks( $container, this.blacklist, this.config );

		// Now let's make some assertions!
		cases = $.grep( cases, function ( testCase ) {
			return testCase[1];
		} );

		QUnit.expect( cases.length + 1 );

		assert.strictEqual(
			$processedLinks.length,
			cases.length,
			'Links with titles that can\'t be extracted are filtered.'
		);

		$.each( cases, function ( i, testCase ) {
			assert.strictEqual(
				$processedLinks.eq( i ).data( 'page-previews-title' ),
				testCase[1]
			);
		} );
	} );

}( mediaWiki, jQuery ) );
