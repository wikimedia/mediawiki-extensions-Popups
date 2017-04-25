var processLinks = require( '../../src/processLinks' ),
	stubs = require( './stubs' );

/**
	* processLinks QUnit tests remain integration tests given their dependency
	* on the MediaWiki library. This test cases rely heavily on stubs brought
	* from Mediawiki, see comments on stubs.js for where the code for the global
	* stubs came from. This type of tests should be the exception, and not the
	* norm.
	*/
QUnit.module( 'ext.popups/processLinks @integration', {
	beforeEach: function () {
		this.config = new Map(); /* global Map */
		this.config.set( 'wgArticlePath', '/wiki/$1' );
		this.config.set( 'wgContentNamespaces', [ 0 ] );

		this.blacklist = [
			'.extiw',
			'.image',
			'.new',
			'.internal',
			'.external',
			'.oo-ui-buttonedElement-button',
			'.cancelLink a'
		];

		window.mediaWiki.RegExp = stubs.mwRegExp;
		window.mediaWiki.Uri = stubs.mwUri;
		window.mediaWiki.Title = stubs.mwTitleNewFromText;
		// Stub global location access with the data used in mwUri stub
		global.location = { hostname: 'en.wikipedia.org' };
	},
	afterEach: function () {
		window.mediaWiki.RegExp = null;
		window.mediaWiki.Uri = null;
		window.mediaWiki.Title = null;
		global.location = null;
	}
} );

QUnit.test( 'it should only return eligible links', function ( assert ) {
	var $container = $( '<div>' ),
		$cancelLink = $( '<span>', {
			'class': 'cancelLink'
		} );

	assert.expect( 1 );

	// Add links that should be filtered.
	$.each( [ 'extiw', 'new', 'external' ], function ( i, className ) {
		$( '<a>', {
			text: 'link with tooltip',
			title: 'link title',
			'class': className,
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
		processLinks( $container, this.blacklist, this.config ).length,
		1,
		'#processLinks should have only returned the eligible link'
	);
} );

QUnit.test( 'it should get the title of local pages', function ( assert ) {
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
		// eslint-disable-next-line no-script-url
		[ 'javascript:void(0);', undefined ],

		[ 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', undefined ]
	];

	$.each( cases, function ( _, testCase ) {
		$( '<a>', {
			href: testCase[ 0 ],
			title: 'link title'
		} ).appendTo( $container );
	} );

	$processedLinks = processLinks( $container, this.blacklist, this.config );

	// Now let's make some assertions!
	cases = $.grep( cases, function ( testCase ) {
		return testCase[ 1 ];
	} );

	assert.expect( cases.length + 1 );

	assert.strictEqual(
		$processedLinks.length,
		cases.length,
		'Links with titles that can\'t be extracted are filtered.'
	);

	$.each( cases, function ( i, testCase ) {
		assert.strictEqual(
			$processedLinks.eq( i ).data( 'page-previews-title' ),
			testCase[ 1 ]
		);
	} );
} );
