var $ = jQuery,
	renderer = require( '../../src/renderer' );

function createPreview() {
	return {
		el: $( '<div>' )
			.append( $( '<a>', { 'class': 'mwe-popups-extract', text: 'extract' } ) )
			.append( $( '<a>', { 'class': 'mwe-popups-settings-icon' } ) )
	};
}

function createBehavior( sandbox ) {
	return {
		settingsUrl: 'https://settings.url',
		showSettings: sandbox.spy(),
		previewDwell: sandbox.spy(),
		previewAbandon: sandbox.spy(),
		previewShow: sandbox.spy(),
		click: sandbox.spy()
	};
}

QUnit.module( 'ext.popups#renderer', {
	beforeEach: function () {
		var self = this;

		$.bracketedDevicePixelRatio = function () {
			return 1;
		};

		window.mediaWiki.RegExp = {
			escape: this.sandbox.spy( function ( str ) {
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
		$.bracketedDevicePixelRatio = null;
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

QUnit.test( 'createPreview', function ( assert ) {
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
		preview;

	window.mediaWiki.template = {
		get: function () {
			return {
				render: function () {
					return $( '<div>', { 'class': 'mwe-popups-discreet' } )
						.append( $( '<div>', { 'class': 'mwe-popups-extract' } ) );
				}
			};
		}
	};

	preview = renderer.createPreview( model );

	assert.equal( preview.hasThumbnail, true, 'Preview has thumbnail.' );
	assert.deepEqual(
		preview.thumbnail,
		renderer.createThumbnail( model.thumbnail ),
		'Preview thumbnail is the correct one.'
	);
	assert.equal(
		preview.isTall,
		true,
		'Preview is tall (because the thumbnail is tall).'
	);
	assert.equal(
		preview.el.find( '.mwe-popups-extract' ).text(),
		'This is a test page.',
		'Preview extract is correct.'
	);
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

QUnit.test( 'bindBehavior - preview dwell', function ( assert ) {
	var preview = createPreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.mouseenter();

	assert.ok( behavior.previewDwell.calledOnce, 'Preview dwell is called.' );
	assert.notOk( behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.notOk( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview abandon', function ( assert ) {
	var preview = createPreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.mouseleave();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.ok( behavior.previewAbandon.calledOnce, 'Preview abandon is called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.notOk( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview click', function ( assert ) {
	var preview = createPreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.click();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.notOk( behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.ok( behavior.click.calledOnce, 'Click is called.' );
	assert.notOk( behavior.showSettings.called, 'Settings link click is NOT called.' );
} );

QUnit.test( 'bindBehavior - settings link click', function ( assert ) {
	var preview = createPreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.find( '.mwe-popups-settings-icon' ).click();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.notOk( behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.ok( behavior.showSettings.calledOnce, 'Settings link click is called.' );
} );

QUnit.test( 'bindBehavior - settings link URL', function ( assert ) {
	var preview = createPreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );

	assert.equal(
		preview.el.find( '.mwe-popups-settings-icon' ).attr( 'href' ),
		behavior.settingsUrl,
		'Settings link URL is correct.'
	);
} );

QUnit.test( 'hide - fade out up', function ( assert ) {
	var preview = {
			el: $( '<div>', { 'class': 'mwe-popups-fade-in-down' } ),
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		done = assert.async( 1 ),
		$container = $( '<div>' ).append( preview.el ),
		promise = renderer.hide( preview );

	assert.ok(
		preview.el.hasClass( 'mwe-popups-fade-out-up' ),
		'Thumbnail has faded out up.'
	);
	assert.notOk(
		preview.el.hasClass( 'mwe-popups-fade-in-down' ),
		'Fade-in class has been removed.'
	);
	assert.notEqual(
		$container.html(),
		'',
		'Preview is still in the container.'
	);
	promise.done( function () {
		assert.equal(
			$container.html(),
			'',
			'Preview has been removed from the container.'
		);
		done();
	} );
} );

QUnit.test( 'hide - fade out down', function ( assert ) {
	var preview = {
			el: $( '<div>', { 'class': 'mwe-popups-fade-in-up' } ),
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		done = assert.async( 1 ),
		$container = $( '<div>' ).append( preview.el ),
		promise = renderer.hide( preview );

	assert.ok(
		preview.el.hasClass( 'mwe-popups-fade-out-down' ),
		'Thumbnail has faded out down.'
	);
	assert.notOk(
		preview.el.hasClass( 'mwe-popups-fade-in-up' ),
		'Fade-in class has been removed.'
	);
	assert.notEqual(
		$container.html(),
		'',
		'Preview is still in the container.'
	);
	promise.done( function () {
		assert.equal(
			$container.html(),
			'',
			'Preview has been removed from the container.'
		);
		done();
	} );
} );

QUnit.test( 'createThumbnail - tall image', function ( assert ) {
	var devicePixelRatio = $.bracketedDevicePixelRatio(),
		rawThumbnail = {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
			width: 409,
			height: 512
		},
		thumbnail = renderer.createThumbnail( rawThumbnail );

	assert.equal(
		thumbnail.isTall,
		true,
		'Thumbnail is tall.'
	);
	assert.equal(
		thumbnail.width,
		thumbnail.width / devicePixelRatio,
		'Thumbnail width is correct.'
	);
	assert.equal(
		thumbnail.height,
		thumbnail.height / devicePixelRatio,
		'Thumbnail height is correct.'
	);
} );

QUnit.test( 'createThumbnail - landscape image', function ( assert ) {
	var devicePixelRatio = $.bracketedDevicePixelRatio(),
		rawThumbnail = {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/500px-President_Barack_Obama.jpg',
			width: 500,
			height: 400
		},
		thumbnail = renderer.createThumbnail( rawThumbnail );

	assert.equal(
		thumbnail.isTall,
		false,
		'Thumbnail is not tall.'
	);
	assert.equal(
		thumbnail.width,
		thumbnail.width / devicePixelRatio,
		'Thumbnail width is correct.'
	);
	assert.equal(
		thumbnail.height,
		thumbnail.height / devicePixelRatio,
		'Thumbnail height is correct.'
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
