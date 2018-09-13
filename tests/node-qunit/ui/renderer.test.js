import * as renderer from '../../../src/ui/renderer';
import * as constants from '../../../src/constants';
import { createNullModel, previewTypes } from '../../../src/preview/model';
import { createThumbnail } from '../../../src/ui/thumbnail';

const $ = jQuery,
	MSG_NO_PREVIEW = 'There was an issue displaying this preview',
	MSG_GO_TO_PAGE = 'Go to this page',
	MSG_DISAMBIGUATION = 'This title relates to more than one page',
	MSG_DISAMBIGUATION_LINK = 'View similar pages';

/**
 * A utility function that creates a bare bones preview
 *
 * @param {boolean} [isTall]
 * @param {boolean} [hasThumbnail]
 * @param {ext.popups.Thumbnail} [thumbnail]
 * @return {ext.popups.Preview}
 */
function createPagePreview( isTall, hasThumbnail, thumbnail ) {
	return {
		el: $( '<div>' )
			.append( hasThumbnail ? $( '<image>' ) : '' )
			.append( $( '<a>', { 'class': 'mwe-popups-extract', text: 'extract' } ) )
			.append( $( '<a>', { 'class': 'mwe-popups-settings-icon' } ) ),
		isTall,
		hasThumbnail,
		thumbnail
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
	beforeEach() {
		this.sandbox.stub( constants.default, 'BRACKETED_DEVICE_PIXEL_RATIO' ).value( 1 );

		mediaWiki.msg = ( key ) => {
			switch ( key ) {
				case 'popups-preview-no-preview':
					return MSG_NO_PREVIEW;
				case 'popups-preview-footer-read':
					return MSG_GO_TO_PAGE;
				case 'popups-preview-disambiguation':
					return MSG_DISAMBIGUATION;
				case 'popups-preview-disambiguation-link':
					return MSG_DISAMBIGUATION_LINK;
			}
		};

		mediaWiki.html = { escape: ( str ) => str };

		// Some tests below stub this function. Keep a copy so it can be restored.
		this.getElementById = document.getElementById;
	},
	afterEach() {
		// Restore getElementsById to its original state.
		document.getElementById = this.getElementById;
		mediaWiki.msg = null;
		mediaWiki.html = null;
	}
} );

QUnit.test( 'getExtractWidth', ( assert ) => {
	const cases = [
		[
			null,
			''
		],
		[ {
			isNarrow: true, offset: 10
		}, `${renderer.defaultExtractWidth + 10}px` ],
		[ {
			// Fall back to css stylesheet for non-narrow thumbs.
			isNarrow: false, offset: 100
		}, '' ]
	];

	cases.forEach( ( case_, i ) => {
		assert.strictEqual(
			renderer.getExtractWidth( case_[ 0 ] ),
			case_[ 1 ],
			`Case ${i}: the expected extract width matches.`
		);
	} );
} );

QUnit.test( 'createPointerMasks', ( assert ) => {
	const $container = $( '<div>' ),
		cases = [
			[ 'clippath#mwe-popups-mask polygon', '0 8, 10 8, 18 0, 26 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-mask-flip polygon', '0 8, 274 8, 282 0, 290 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-landscape-mask polygon', '0 8, 174 8, 182 0, 190 8, 1000 8, 1000 1000, 0 1000' ],
			[ 'clippath#mwe-popups-landscape-mask-flip polygon', '0 0, 1000 0, 1000 242, 190 242, 182 250, 174 242, 0 242' ]
		];

	renderer.createPointerMasks( $container.get( 0 ) );

	cases.forEach( ( case_, i ) => {
		assert.strictEqual(
			$container.find( case_[ 0 ] ).attr( 'points' ),
			case_[ 1 ],
			`Case ${i}: the SVG's polygons match.`
		);
	} );
} );

QUnit.test( 'createPagePreview', ( assert ) => {
	const model = {
			title: 'Test',
			url: 'https://en.wikipedia.org/wiki/Test',
			languageCode: 'en',
			languageDirection: 'ltr',
			extract: 'This is a test page.',
			type: previewTypes.TYPE_PAGE,
			thumbnail: {
				source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
				width: 409,
				height: 512
			}
		},
		preview = renderer.createPreviewWithType( model );

	assert.strictEqual( preview.hasThumbnail, true, 'Preview has thumbnail.' );
	assert.deepEqual(
		preview.thumbnail.el.html(),
		createThumbnail( model.thumbnail ).el.html(),
		'Preview thumbnail is the correct one.'
	);
	assert.strictEqual(
		preview.isTall,
		true,
		'Preview is tall (because the thumbnail is tall).'
	);
	assert.strictEqual(
		preview.el.find( '.mwe-popups-extract' ).text(),
		'This is a test page.',
		'Preview extract is correct.'
	);
} );

QUnit.test( 'createEmptyPreview(model)', ( assert ) => {
	const model = {
			title: 'Test',
			url: 'https://en.wikipedia.org/wiki/Test',
			languageCode: 'en',
			languageDirection: 'ltr',
			extract: 'This is a test page.',
			type: previewTypes.TYPE_GENERIC,
			thumbnail: {
				source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
				width: 409,
				height: 512
			}
		},
		emptyPreview = renderer.createPreviewWithType( model );

	assert.strictEqual(
		emptyPreview.hasThumbnail,
		false,
		'Empty preview doesn\'t have a thumbnail (even though one is provided).'
	);

	assert.strictEqual(
		emptyPreview.isTall,
		false,
		'Empty preview is never tall (even though the supplied thumbnail is tall).'
	);

	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-title' ).text().trim(),
		'',
		'Empty preview title is hidden.'
	);
	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-extract' ).text().trim(),
		MSG_NO_PREVIEW,
		'Empty preview extract is correct.'
	);
	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-read-link' ).text().trim(),
		MSG_GO_TO_PAGE,
		'Empty preview link text is correct.'
	);
} );

QUnit.test( 'createEmptyPreview(null model)', ( assert ) => {
	const model = createNullModel( 'Test', '/wiki/Test' ),
		emptyPreview = renderer.createPreviewWithType( model );

	assert.strictEqual(
		emptyPreview.hasThumbnail,
		false,
		'Null preview doesn\'t have a thumbnail.'
	);

	assert.strictEqual(
		emptyPreview.isTall,
		false,
		'Null preview is never tall.'
	);

	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-title' ).text().trim(),
		'',
		'Empty preview title is hidden.'
	);
	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-extract' ).text().trim(),
		MSG_NO_PREVIEW,
		'Empty preview extract is correct.'
	);
	assert.strictEqual(
		emptyPreview.el.find( '.mwe-popups-read-link' ).text().trim(),
		MSG_GO_TO_PAGE,
		'Empty preview link text is correct.'
	);
} );

QUnit.test( 'createDisambiguationPreview(model)', ( assert ) => {
	const model = {
			title: 'Barack (disambiguation)',
			url: 'url/Barack (disambiguation)',
			languageCode: 'en',
			languageDirection: 'ltr',
			extract: 'Barack Hussein Obama II born August 4, 1961) ...',
			type: previewTypes.TYPE_DISAMBIGUATION
		},
		preview = renderer.createPreviewWithType( model );

	assert.strictEqual(
		preview.hasThumbnail,
		false,
		'Disambiguation preview doesn\'t have a thumbnail.'
	);

	assert.strictEqual(
		preview.isTall,
		false,
		'Disambiguation preview is never tall.'
	);

	assert.strictEqual(
		preview.el.find( '.mwe-popups-title' ).text().trim(),
		'Barack (disambiguation)',
		'Preview title is show.'
	);
	assert.strictEqual(
		preview.el.find( '.mwe-popups-extract' ).text().trim(),
		MSG_DISAMBIGUATION,
		'Preview extract is correct.'
	);
	assert.strictEqual(
		preview.el.find( '.mwe-popups-read-link' ).text().trim(),
		MSG_DISAMBIGUATION_LINK,
		'Preview link text is correct.'
	);
} );

QUnit.test( 'bindBehavior - preview dwell', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.mouseenter();

	assert.strictEqual( behavior.previewDwell.callCount, 1, 'Preview dwell is called.' );
	assert.notOk(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.notOk( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview abandon', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.mouseleave();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.strictEqual( behavior.previewAbandon.callCount, 1, 'Preview abandon is called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.notOk( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview click', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.click();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.notOk(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.strictEqual( behavior.click.callCount, 1, 'Click is called.' );
	assert.notOk( behavior.showSettings.called,
		'Settings link click is NOT called.' );
} );

QUnit.test( 'bindBehavior - settings link click', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.find( '.mwe-popups-settings-icon' ).click();

	assert.notOk( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.notOk(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.notOk( behavior.click.called, 'Click is NOT called.' );
	assert.ok(
		behavior.showSettings.calledOnce, 'Settings link click is called.' );
} );

QUnit.test( 'bindBehavior - settings link URL', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );

	assert.strictEqual(
		preview.el.find( '.mwe-popups-settings-icon' ).attr( 'href' ),
		behavior.settingsUrl,
		'Settings link URL is correct.'
	);
} );

QUnit.test( 'show', function ( assert ) {
	const preview = createPagePreview(),
		event = {
			pageX: 252,
			pageY: 1146,
			clientY: 36
		},
		link = {
			get() {
				return {
					getClientRects() {
						return [ {
							bottom: 37,
							height: 13,
							left: 201,
							right: 357,
							top: 24,
							width: 156
						} ];
					}
				};
			},
			offset() {
				return {
					top: 1134,
					left: 201
				};
			},
			width() {
				return 156;
			},
			height() {
				return 13;
			}
		},
		behavior = createBehavior( this.sandbox ),
		token = 'some-token',
		$container = $( '<div>' );

	preview.el.show = this.sandbox.stub();

	const showPreview = renderer.show(
		preview, event, link, behavior, token, $container.get( 0 ), 'ltr' );

	assert.notEqual(
		$container.html(),
		'',
		'Container is not empty.'
	);
	assert.ok(
		preview.el.show.calledOnce,
		'Preview has been shown.'
	);

	return showPreview.then( () => {
		assert.ok(
			behavior.previewShow.calledWith( token ),
			'previewShow has been called with the correct token.'
		);
	} );
} );

QUnit.test( 'hide - fade out up', ( assert ) => {
	const preview = {
			el: $( '<div>', { 'class': 'mwe-popups-fade-in-down' } ),
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		$container = $( '<div>' ).append( preview.el ),
		hidePreview = renderer.hide( preview );

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
	return hidePreview.then( () => {
		assert.strictEqual(
			$container.html(),
			'',
			'Preview has been removed from the container.'
		);
	} );
} );

QUnit.test( 'hide - fade out down', ( assert ) => {
	const preview = {
			el: $( '<div>', { 'class': 'mwe-popups-fade-in-up' } ),
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		$container = $( '<div>' ).append( preview.el ),
		hidePreview = renderer.hide( preview );

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
	return hidePreview.then( () => {
		assert.strictEqual(
			$container.html(),
			'',
			'Preview has been removed from the container.'
		);
	} );
} );

QUnit.test( '#createLayout - portrait preview, mouse event, link is on the top left of the page', ( assert ) => {
	const isPreviewTall = false,
		eventData = {
			pageX: 252,
			pageY: 1146,
			clientY: 36
		},
		linkData = {
			clientRects: [ {
				bottom: 37,
				height: 13,
				left: 201,
				right: 357,
				top: 24,
				width: 156
			} ],
			offset: {
				top: 1134,
				left: 201
			},
			width: 156,
			height: 13
		},
		windowData = {
			scrollTop: 1109,
			width: 1239,
			height: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, eventData, linkData, windowData, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1154,
					left: 232
				},
				flippedX: dir !== 'ltr',
				flippedY: false,
				dir
			},
			`Case ${i}: the layout is correct.`
		);
	} );
} );

QUnit.test( '#createLayout - tall preview, mouse event, link is on the bottom center of the page', ( assert ) => {
	const isPreviewTall = true,
		eventData = {
			pageX: 176,
			pageY: 1252,
			clientY: 628
		},
		linkData = {
			clientRects: [ {
				bottom: 640,
				height: 13,
				left: 177,
				right: 209,
				top: 627,
				width: 32
			} ],
			offset: {
				top: 1250,
				left: 177
			},
			width: 32,
			height: 13
		},
		windowData = {
			scrollTop: 623,
			width: 587,
			height: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, eventData, linkData, windowData, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1242,
					left: 156
				},
				flippedX: dir !== 'ltr',
				flippedY: true,
				dir
			},
			`Case ${i}: the layout is correct. Y is flipped.`
		);
	} );
} );

QUnit.test( '#createLayout - empty preview, keyboard event, link is on the center right of the page', ( assert ) => {
	const isPreviewTall = false,
		eventData = {},
		linkData = {
			clientRects: [ {
				bottom: 442,
				height: 13,
				left: 654,
				right: 692,
				top: 430,
				width: 38
			} ],
			offset: {
				top: 1118,
				left: 654
			},
			width: 38,
			height: 13
		},
		windowData = {
			scrollTop: 689,
			width: 801,
			height: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, eventData, linkData, windowData, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1110,
					left: 372
				},
				flippedX: dir === 'ltr',
				flippedY: true,
				dir
			},
			`Case ${i}: the layout is correct. Both X and Y are flipped.`
		);
	} );
} );

QUnit.test( '#getClasses when no thumbnail is available', ( assert ) => {
	const cases = [
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
				'mwe-popups-no-image-pointer',
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
				'flipped-y',
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
				'flipped-x',
				'mwe-popups-no-image-pointer',
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
				'flipped-x-y',
				'mwe-popups-is-not-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( ( case_ ) => {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );
QUnit.test( '#getClasses when a non-tall thumbnail is available', ( assert ) => {
	const cases = [
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
				'mwe-popups-image-pointer',
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
				'flipped-y',
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
				'flipped-x',
				'mwe-popups-image-pointer',
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
				'flipped-x-y',
				'mwe-popups-is-not-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( ( case_ ) => {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );

QUnit.test( '#getClasses when a tall thumbnail is available', ( assert ) => {
	const cases = [
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
				'mwe-popups-no-image-pointer',
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
				'flipped-y',
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
				'flipped-x',
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
				'flipped-x-y',
				'mwe-popups-is-tall'
			],
			'X and Y flipped.'
		]
	];

	cases.forEach( ( case_ ) => {
		assert.deepEqual(
			renderer.getClasses( case_[ 0 ], case_[ 1 ] ),
			case_[ 2 ],
			case_[ 3 ]
		);
	} );
} );

QUnit.test( '#layoutPreview - no thumbnail', ( assert ) => {
	const preview = createPagePreview( false, false, null ),
		layout = {
			flippedX: false,
			flippedY: false,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top }px`,
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
} );

QUnit.test( '#layoutPreview - tall preview, flipped X, has thumbnail', function ( assert ) {
	const preview = createPagePreview( true, true, { height: 200 } ),
		layout = {
			flippedX: true,
			flippedY: false,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	this.sandbox
		.stub( document, 'getElementById' )
		.returns( document.createElement( 'div' ) );

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top }px`,
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.notOk(
		preview.el.hasClass( 'mwe-popups-no-image-pointer' ),
		'A class has been removed.'
	);
	assert.strictEqual(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'url(#mwe-popups-landscape-mask)',
		'Image clip path is correct.'
	);
} );

QUnit.test( '#layoutPreview - portrait preview, flipped X, has thumbnail, small height', function ( assert ) {
	const preview = createPagePreview( false, true, { height: 199 } ),
		layout = {
			flippedX: true,
			flippedY: false,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	this.sandbox
		.stub( document, 'getElementById' )
		.returns( document.createElement( 'div' ) );

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top }px`,
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.strictEqual(
		preview.el.find( '.mwe-popups-extract' ).css( 'margin-top' ),
		`${ 199 - 8 }px`, // thumb height - pointer size
		'Extract margin top has been set when preview height is smaller than the predefined landscape image height.'
	);
	assert.strictEqual(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'url(#mwe-popups-mask-flip)',
		'Image clip path is correct.'
	);
} );

QUnit.test( '#layoutPreview - portrait preview, flipped X, has thumbnail, big height', function ( assert ) {
	const preview = createPagePreview( false, true, { height: 201 } ),
		layout = {
			flippedX: true,
			flippedY: false,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	this.sandbox
		.stub( document, 'getElementById' )
		.returns( document.createElement( 'div' ) );

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top }px`,
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.strictEqual(
		preview.el.find( '.mwe-popups-extract' ).attr( 'margin-top' ),
		undefined,
		'Extract margin top has NOT been set when preview height is bigger than the predefined landscape image height.'
	);
	assert.strictEqual(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'url(#mwe-popups-mask-flip)',
		'Image clip path is correct.'
	);
} );

QUnit.test( '#layoutPreview - tall preview, has thumbnail, flipped Y', ( assert ) => {
	const preview = createPagePreview( true, true, { height: 200 } ),
		layout = {
			flippedX: false,
			flippedY: true,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	preview.el.outerHeight = () => 20;

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top - 20 }px`, // - outer height
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.notOk(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'Image clip path is not set.'
	);
} );

QUnit.test( '#layoutPreview - tall preview, has thumbnail, flipped X and Y', function ( assert ) {
	const preview = createPagePreview( true, true, { height: 200 } ),
		layout = {
			flippedX: true,
			flippedY: true,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	preview.el.outerHeight = () => 20;

	this.sandbox
		.stub( document, 'getElementById' )
		.returns( document.createElement( 'div' ) );

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top - 20 }px`, // - outer height
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.strictEqual(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'url(#mwe-popups-landscape-mask-flip)',
		'Image clip path is not set.'
	);
} );

QUnit.test( '#layoutPreview - portrait preview, has thumbnail, flipped X and Y', ( assert ) => {
	const preview = createPagePreview( false, true, { height: 200 } ),
		layout = {
			flippedX: true,
			flippedY: true,
			offset: {
				top: 100,
				left: 200
			},
			dir: 'ltr'
		},
		classes = [ 'some-class', 'another-class' ];

	preview.el.outerHeight = () => 20;

	renderer.layoutPreview( preview, layout, classes, 200, 8 );

	assert.ok(
		classes.every( function ( c ) {
			return preview.el.hasClass( c );
		} ),
		'Classes have been added.'
	);
	assert.strictEqual(
		preview.el.css( 'top' ),
		`${ layout.offset.top - 20 }px`, // - outer height
		'Top is correct.'
	);
	assert.strictEqual(
		preview.el.css( 'left' ),
		`${ layout.offset.left }px`,
		'Left is correct.'
	);
	assert.notOk(
		preview.el.find( 'image' ).attr( 'clip-path' ),
		'Image clip path is not set.'
	);
} );

QUnit.test( '#setThumbnailClipPath', function ( assert ) {
	const cases = [
		{ isTall: false, dir: 'ltr', expected: 'matrix(1 0 0 1 0 0)' },
		{ isTall: true, dir: 'ltr', expected: 'matrix(1 0 0 1 0 0)' },
		{ isTall: false, dir: 'rtl', expected: 'matrix(-1 0 0 1 320 0)' },
		{ isTall: true, dir: 'rtl', expected: 'matrix(-1 0 0 1 203 0)' }
	];

	const clipPath = document.createElement( 'div' );
	this.sandbox.stub( document, 'getElementById' ).returns( clipPath );

	cases.forEach( ( { isTall, dir, expected } ) => {
		clipPath.removeAttribute( 'transform' );
		const preview = createPagePreview( isTall, true, { height: 200 } ),
			layout = {
				flippedX: true,
				flippedY: false,
				offset: {
					top: 100,
					left: 200
				},
				dir
			};

		// preview.el.outerHeight = () => 20;

		renderer.setThumbnailClipPath( preview, layout );

		assert.strictEqual(
			clipPath.getAttribute( 'transform' ),
			expected,
			`Transform is correct for: { isTall: ${isTall}, dir: ${dir} }.`
		);
	} );
} );

QUnit.test( '#getThumbnailClipPathID', ( assert ) => {
	const cases = [
		{ flippedY: false, flippedX: false, isTall: false, expected: 'mwe-popups-mask' },
		{ flippedY: true, flippedX: false, isTall: false, expected: undefined },
		{ flippedY: false, flippedX: true, isTall: false, expected: 'mwe-popups-mask-flip' },
		{ flippedY: true, flippedX: true, isTall: false, expected: undefined },
		{ flippedY: false, flippedX: false, isTall: true, expected: undefined },
		{ flippedY: true, flippedX: false, isTall: true, expected: undefined },
		{ flippedY: false, flippedX: true, isTall: true, expected: 'mwe-popups-landscape-mask' },
		{ flippedY: true, flippedX: true, isTall: true, expected: 'mwe-popups-landscape-mask-flip' }
	];
	cases.forEach( ( { flippedY, flippedX, isTall, expected } ) => {
		assert.strictEqual(
			renderer.getThumbnailClipPathID( isTall, flippedY, flippedX ),
			expected,
			`Correct element ID is returned for: { flippedY: ${flippedY}, flippedX: ${flippedX}, isTall: ${isTall} }.`
		);
	} );
} );

QUnit.test( 'getClosestYPosition', ( assert ) => {
	assert.strictEqual( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	] ), 119, 'Correct lower Y.' );

	assert.strictEqual( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	], true ), 99, 'Correct upper Y.' );

	assert.strictEqual( renderer.getClosestYPosition( 135, [
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
