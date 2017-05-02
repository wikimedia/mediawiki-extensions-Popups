var $ = jQuery,
	renderer = require( '../../src/renderer' );

QUnit.module( 'ext.popups#renderer', {
	beforeEach: function () {
		var self = this;

		window.mediaWiki.RegExp = {
			escape: this.sandbox.spy( function( str ) {
				return str.replace( /([\\{}()|.?*+\-\^$\[\]])/g, '\\$1' );
			} )
		};

		window.mediaWiki.msg = function ( key ) {
			switch ( key ) {
				case 'popups-preview-no-preview':
					return 'Looks like there isn\'t a preview for this page';
				case 'popups-preview-footer-read':
					return 'Read';
			}
		};

		this.renderSpy = this.sandbox.spy();
		window.mediaWiki.template = {
			get: function () {
				return {
					render: self.renderSpy
				};
			}
		};
	},
	afterEach: function () {
		window.mediaWiki.RegExp = null;
		window.mediaWiki.msg = null;
		window.mediaWiki.template = null;
	}
} );

QUnit.test( 'createPokeyMasks', function ( assert ) {
	var $container = $( '<div>' ),
		cases = [
			[ 'clippath#mwe-popups-mask polygon', '0 8, 10 8, 18 0, 26 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-mask-flip polygon', '0 8, 274 8, 282 0, 290 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-landscape-mask polygon', '0 8, 174 8, 182 0, 190 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-landscape-mask-flip polygon', '0 0, 1000 0, 1000 242, 190 242, 182 250, 174 242, 0 242' ]
		];

	renderer.createPokeyMasks( $container.get( 0 ) );

	cases.forEach( function ( case_ ) {
		assert.equal(
			$container.find( case_[ 0 ] ).attr( 'points' ),
			case_[ 1 ]
		);
	} );
} );

QUnit.test( 'createEmptyPreview', function ( assert ) {
	var model = {
			title: 'Test',
			url: 'https://en.wikipedia.org/wiki/Test',
			languageCode: 'en',
			languageDirection: 'ltr',
			extract: 'This is a test page.',
			thumbnail: {
				source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
				width: 409,
				height: 512
			}
		},
		emptyPreview = renderer.createEmptyPreview( model );

	assert.equal(
		emptyPreview.hasThumbnail,
		false,
		'Empty preview doesn\'t have a thumbnail (even though one is provided).'
	);

	assert.equal(
		emptyPreview.isTall,
		false,
		'Empty preview is never tall (even though the supplied thumbnail is tall).'
	);

	assert.ok( this.renderSpy.calledOnce, 'Template has been rendered.' );

	assert.deepEqual(
		this.renderSpy.getCall( 0 ).args[ 0 ],
		$.extend( {}, model, {
			extractMsg: 'Looks like there isn\'t a preview for this page',
			readMsg: 'Read'
		} ),
		'Template is called with the correct data.'
	);
} );

QUnit.test( 'createThumbnailElement', function ( assert ) {
	var className = 'thumb-class',
		url = 'https://thumbnail.url',
		x = 25,
		y = 50,
		thumbnailWidth = 200,
		thumbnailHeight = 250,
		width = 500,
		height = 300,
		clipPath = 'mwe-popups-mask',
		$thumbnail = renderer.createThumbnailElement(
			className, url, x, y, thumbnailWidth, thumbnailHeight,
			width, height, clipPath );

	assert.equal(
		$thumbnail.html(),
		'<image href="https://thumbnail.url" class="thumb-class" x="25" y="50" width="200" height="250" clip-path="url(#mwe-popups-mask)"></image>',
		'Thumbnail HTML is correct.'
	);
	assert.equal(
		$thumbnail.attr( 'xmlns' ),
		'http://www.w3.org/2000/svg',
		'SVG namespace is correct.'
	);
	assert.equal( $thumbnail.attr( 'height' ), height, 'SVG height is correct.' );
	assert.equal( $thumbnail.attr( 'width' ), width, 'SVG width is correct.' );

} );

QUnit.test( 'getProcessedElements', function ( assert ) {
	var cases = [
		[
			'Isaac Newton was born in', 'Isaac Newton',
			'<b>Isaac Newton</b> was born in',
			'Title as first word'
		],
		[
			'The C* language not to be confused with C# or C', 'C*',
			'The <b>C*</b> language not to be confused with C# or C',
			'Title containing *'
		],
		[
			'I like trains', 'Train',
			'I like <b>train</b>s',
			'Make the simple plural bold'
		],
		[
			'Foo\'s pub is a pub in Bar', 'Foo\'s pub',
			'<b>Foo\'s pub</b> is a pub in Bar',
			'Correct escaping'
		],
		[
			'\"Heroes\" is a David Bowie album', '\"Heroes\"',
			'<b>\"Heroes\"</b> is a David Bowie album',
			'Quotes in title'
		],
		[
			'*Testing if Things are correctly identified', 'Things',
			'*Testing if <b>Things</b> are correctly identified',
			'Article that begins with asterisk'
		],
		[
			'Testing if repeated words are not matched when repeated', 'Repeated',
			'Testing if <b>repeated</b> words are not matched when repeated',
			'Repeated title'
		]
	];

	function test( extract, title, expected, msg ) {
		var $div = $( '<div>' ).append(
			renderer.renderExtract( extract, title )
		);
		assert.equal( $div.html(), expected, msg );
	}

	cases.forEach( function ( case_ ) {
		test( case_[ 0 ], case_[ 1 ], case_[ 2 ], case_[ 3 ] );
	} );
} );

QUnit.test( '#getClasses when no thumbnail is available', function ( assert ) {
	var cases = [
		// [ previewOptions, layoutOptions, expected, message ]
		[
			{
				hasThumbnail: false,
				isTall: false
			},
			{
				flippedX: false,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'mwe-popups-no-image-tri',
				'mwe-popups-is-not-tall'
			],
			'No flip.'
		],
		[
			{
				hasThumbnail: false,
				isTall: false
			},
			{
				flippedX: false,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_y',
				'mwe-popups-is-not-tall'
			],
			'Y flipped.'
		],
		[
			{
				hasThumbnail: false,
				isTall: false
			},
			{
				flippedX: true,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'flipped_x',
				'mwe-popups-no-image-tri',
				'mwe-popups-is-not-tall'
			],
			'X flipped.'
		],
		[
			{
				hasThumbnail: false,
				isTall: false
			},
			{
				flippedX: true,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_x_y',
				'mwe-popups-is-not-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( function ( case_ ) {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );
QUnit.test( '#getClasses when a non-tall thumbnail is available', function ( assert ) {
	var cases = [
		[
			{
				hasThumbnail: true,
				isTall: false
			},
			{
				flippedX: false,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'mwe-popups-image-tri',
				'mwe-popups-is-not-tall'
			],
			'No flip.'
		],
		[
			{
				hasThumbnail: true,
				isTall: false
			},
			{
				flippedX: false,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_y',
				'mwe-popups-is-not-tall'
			],
			'Y flipped.'
		],
		[
			{
				hasThumbnail: true,
				isTall: false
			},
			{
				flippedX: true,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'flipped_x',
				'mwe-popups-image-tri',
				'mwe-popups-is-not-tall'
			],
			'X flipped.'
		],
		[
			{
				hasThumbnail: true,
				isTall: false
			},
			{
				flippedX: true,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_x_y',
				'mwe-popups-is-not-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( function ( case_ ) {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );

QUnit.test( '#getClasses when a tall thumbnail is available', function ( assert ) {
	var cases = [
		[
			{
				hasThumbnail: true,
				isTall: true
			},
			{
				flippedX: false,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'mwe-popups-no-image-tri',
				'mwe-popups-is-tall'
			],
			'No flip.'
		],
		[
			{
				hasThumbnail: true,
				isTall: true
			},
			{
				flippedX: false,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_y',
				'mwe-popups-is-tall'
			],
			'Y flipped.'
		],
		[
			{
				hasThumbnail: true,
				isTall: true
			},
			{
				flippedX: true,
				flippedY: false
			},
			[
				'mwe-popups-fade-in-up',
				'flipped_x',
				'mwe-popups-no-image-tri',
				'mwe-popups-is-tall'
			],
			'X flipped.'
		],
		[
			{
				hasThumbnail: true,
				isTall: true
			},
			{
				flippedX: true,
				flippedY: true
			},
			[
				'mwe-popups-fade-in-down',
				'flipped_x_y',
				'mwe-popups-is-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( function ( case_ ) {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );

QUnit.test( 'getClosestYPosition', function ( assert ) {
	assert.equal( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	] ), 119, 'Correct lower Y.' );

	assert.equal( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	], true ), 99, 'Correct upper Y.' );

	assert.equal( renderer.getClosestYPosition( 135, [
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
