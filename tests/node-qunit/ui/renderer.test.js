import * as renderer from '../../../src/ui/renderer';
import * as pagePreview from '../../../src/ui/templates/pagePreview/pagePreview';
import * as constants from '../../../src/constants';
import { createNullModel, previewTypes } from '../../../src/preview/model';
import { createThumbnail } from '../../../src/ui/thumbnail';

const windowHeight = 400;
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
		el: $( '<div>' ).append(
			hasThumbnail ? $( '<image>' ) : '',
			$( '<a>' ).addClass( 'mwe-popups-extract' ).text( 'extract' ),
			$( '<a>' ).addClass( 'mwe-popups-settings-button' )
		)[ 0 ],
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

		mw.msg = ( key ) => `<${key}>`;
		mw.message = ( key ) => {
			return { exists: () => !key.endsWith( 'generic' ), text: () => `<${key}>` };
		};

		mw.html = {
			escape: ( str ) => str && str.replace( /'/g, '&apos;' ).replace( /</g, '&lt;' )
		};

		mw.track = () => {};

		global.navigator = {
			sendBeacon() {}
		};

		// Some tests below stub this function. Keep a copy so it can be restored.
		this.getElementById = document.getElementById;
	},
	afterEach() {
		// Restore getElementsById to its original state.
		document.getElementById = this.getElementById;
		mw.msg = null;
		mw.message = null;
		mw.html = null;
		renderer.test.reset();
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
		}, `${pagePreview.defaultExtractWidth + 10}px` ],
		[ {
			// Fall back to css stylesheet for non-narrow thumbs.
			isNarrow: false, offset: 100
		}, '' ]
	];

	cases.forEach( ( case_, i ) => {
		assert.strictEqual(
			pagePreview.getExtractWidth( case_[ 0 ] ),
			case_[ 1 ],
			`Case ${i}: the expected extract width matches.`
		);
	} );
} );

QUnit.test( 'createPointerMasks', ( assert ) => {
	const $container = $( '<div>' ),
		cases = [
			[ '#mwe-popups-mask', 'M0 8h10l8-8 8 8h974v992H0z' ],
			[ '#mwe-popups-mask-flip', 'M0 8h294l8-8 8 8h690v992H0z' ],
			[ '#mwe-popups-landscape-mask', 'M0 8h174l8-8 8 8h810v992H0z' ],
			[ '#mwe-popups-landscape-mask-flip', 'M0 0h1000v242H190l-8 8-8-8H0z' ]
		];

	renderer.createPointerMasks( $container.get( 0 ) );

	cases.forEach( ( case_, i ) => {
		assert.strictEqual(
			$container.find( `${case_[ 0 ]} path` ).attr( 'd' ),
			case_[ 1 ],
			`Case ${i}: the SVG's polygons match.`
		);
	} );
} );

QUnit.test( 'createPagePreview', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_PAGE,
		renderer.createPagePreview
	);
	const model = {
			title: 'Test',
			url: 'https://en.wikipedia.org/wiki/Test <"\'>',
			languageCode: 'en <"\'>',
			languageDirection: 'ltr <"\'>',
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
		$( preview.thumbnail.el ).html(),
		$( createThumbnail( model.thumbnail ).el ).html(),
		'Preview thumbnail is the correct one.'
	);
	assert.strictEqual(
		preview.isTall,
		true,
		'Preview is tall (because the thumbnail is tall).'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).text(),
		'This is a test page.',
		'Preview extract is correct.'
	);

	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).attr( 'href' ),
		'https://en.wikipedia.org/wiki/Test <"\'>',
		'URL is safely espaced'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).attr( 'lang' ),
		'en <"\'>',
		'Language code is safely espaced'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).attr( 'dir' ),
		'ltr <"\'>',
		'Language direction is safely espaced'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-settings-button' ).attr( 'title' ),
		'<popups-settings-icon-gear-title>',
		'Title attribute is correct.'
	);
} );

QUnit.test( 'createEmptyPreview(model)', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_GENERIC,
		renderer.createEmptyPreview
	);
	const model = {
			title: 'Test',
			url: 'https://en.wikipedia.org/wiki/Test <"\'>',
			type: previewTypes.TYPE_GENERIC
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
		$( emptyPreview.el ).find( '.mwe-popups-title' ).text().trim(),
		'<popups-preview-no-preview>',
		'Empty preview title is hidden.'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-message' ).length,
		0,
		'No preview message text.'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-read-link' ).text().trim(),
		'<popups-preview-footer-read>',
		'Empty preview link text is correct.'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-read-link' ).attr( 'href' ),
		'https://en.wikipedia.org/wiki/Test <"\'>',
		'URL is safely espaced'
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
		$( emptyPreview.el ).find( '.mwe-popups-title' ).text().trim(),
		'<popups-preview-no-preview>',
		'Empty preview title is hidden.'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-message' ).length,
		0,
		'No preview message text.'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-read-link' ).text().trim(),
		'<popups-preview-footer-read>',
		'Empty preview link text is correct.'
	);
} );

QUnit.test( 'createPreviewWithType(model with unknown type)', ( assert ) => {
	const model = {
			url: '/wiki/Unknown <"\'>',
			type: 'unknown'
		},
		emptyPreview = renderer.createPreviewWithType( model );

	assert.strictEqual(
		$( emptyPreview.el ).find( '.mwe-popups-extract' ).attr( 'href' ),
		'/wiki/Unknown <"\'>',
		'URL is safely espaced'
	);
	assert.strictEqual(
		$( emptyPreview.el ).attr( 'class' ),
		'mwe-popups mwe-popups-type-unknown',
		'Popup type is safely espaced'
	);
	assert.strictEqual(
		$( emptyPreview.el ).find( '.popups-icon' ).attr( 'class' ),
		'popups-icon popups-icon--preview-unknown',
		'Icon type is safely espaced'
	);
} );

QUnit.test( 'createDisambiguationPreview(model)', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_DISAMBIGUATION,
		renderer.createDisambiguationPreview
	);
	const model = {
			title: 'Barack (disambiguation)',
			url: 'url/Barack (disambiguation) <"\'>',
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
		$( preview.el ).find( '.mwe-popups-title' ).text().trim(),
		'Barack (disambiguation)',
		'Preview title is show.'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-message' ).text().trim(),
		'<popups-preview-disambiguation>',
		'Preview message is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-read-link' ).text().trim(),
		'<popups-preview-disambiguation-link>',
		'Preview link text is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-read-link' ).attr( 'href' ),
		'url/Barack (disambiguation) <"\'>',
		'URL is safely espaced'
	);
} );

QUnit.test( 'createReferencePreview(model)', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_REFERENCE,
		renderer.createReferencePreview
	);
	const model = {
			url: '#custom_id',
			extract: 'Custom <i>extract</i> with an <a href="/wiki/Internal">internal</a> and an <a href="//wikipedia.de" class="external">external</a> link',
			type: previewTypes.TYPE_REFERENCE,
			referenceType: 'web'
		},
		preview = renderer.createPreviewWithType( model );

	assert.strictEqual( preview.hasThumbnail, false );
	assert.strictEqual( preview.isTall, false );

	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-title' ).text().trim(),
		'<popups-refpreview-web>'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mw-parser-output' ).text().trim(),
		'Custom extract with an internal and an external link'
	);
	assert.strictEqual(
		$( preview.el ).find( 'a[target="_blank"]' ).length,
		1,
		'only external links open in new tabs'
	);
} );

QUnit.test( 'createReferencePreview collapsible/sortable handling', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_REFERENCE,
		renderer.createReferencePreview
	);
	const model = {
			url: '',
			extract: '<table class="mw-collapsible"></table>' +
				'<table class="sortable"><th class="headerSort" tabindex="1" title="Click here"></th></table>',
			type: previewTypes.TYPE_REFERENCE
		},
		preview = renderer.createPreviewWithType( model );

	assert.strictEqual( $( preview.el ).find( '.mw-collapsible, .sortable, .headerSort' ).length, 0 );
	assert.strictEqual( $( preview.el ).find( 'th' ).attr( 'tabindex' ), undefined );
	assert.strictEqual( $( preview.el ).find( 'th' ).attr( 'title' ), undefined );
	assert.strictEqual(
		$( preview.el ).find( '.mwe-collapsible-placeholder' ).text(),
		'<popups-refpreview-collapsible-placeholder>'
	);
} );

QUnit.test( 'createReferencePreview default title', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_REFERENCE,
		renderer.createReferencePreview
	);
	const model = {
			url: '',
			extract: '',
			type: previewTypes.TYPE_REFERENCE
		},
		preview = renderer.createPreviewWithType( model );

	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-title' ).text().trim(),
		'<popups-refpreview-reference>'
	);
} );

QUnit.test( 'createReferencePreview updates fade-out effect on scroll', ( assert ) => {
	renderer.registerPreviewUI(
		previewTypes.TYPE_REFERENCE,
		renderer.createReferencePreview
	);
	const model = {
			url: '',
			extract: '',
			type: previewTypes.TYPE_REFERENCE
		},
		preview = renderer.createPreviewWithType( model ),
		$extract = $( preview.el ).find( '.mwe-popups-extract' );

	$extract.children()[ 0 ].dispatchEvent( new Event( 'scroll' ) );

	assert.false( $extract.children()[ 0 ].isScrolling );
	assert.false( $extract.hasClass( 'mwe-popups-fade-out' ) );
} );

QUnit.test( 'bindBehavior - preview dwell', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.dispatchEvent( new Event( 'mouseenter' ) );

	assert.strictEqual( behavior.previewDwell.callCount, 1, 'Preview dwell is called.' );
	assert.false(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.false( behavior.click.called, 'Click is NOT called.' );
	assert.false( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview abandon', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.dispatchEvent( new Event( 'mouseleave' ) );

	assert.false( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.strictEqual( behavior.previewAbandon.callCount, 1, 'Preview abandon is called.' );
	assert.false( behavior.click.called, 'Click is NOT called.' );
	assert.false( behavior.showSettings.called, 'Show settings is NOT called.' );
} );

QUnit.test( 'bindBehavior - preview click', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.dispatchEvent( new Event( 'click' ) );

	assert.false( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.false(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.strictEqual( behavior.click.callCount, 1, 'Click is called.' );
	assert.false( behavior.showSettings.called,
		'Settings link click is NOT called.' );
} );

QUnit.test( 'bindBehavior - settings link click', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );
	preview.el.querySelector( '.mwe-popups-settings-button' ).dispatchEvent( new Event( 'click' ) );

	assert.false( behavior.previewDwell.called, 'Preview dwell is NOT called.' );
	assert.false(
		behavior.previewAbandon.called, 'Preview abandon is NOT called.' );
	assert.false( behavior.click.called, 'Click is NOT called.' );
	assert.true(
		behavior.showSettings.calledOnce, 'Settings link click is called.' );
} );

QUnit.test( 'bindBehavior - settings link URL', function ( assert ) {
	const preview = createPagePreview(),
		behavior = createBehavior( this.sandbox );

	renderer.bindBehavior( preview, behavior );

	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-settings-button' ).attr( 'href' ),
		behavior.settingsUrl,
		'Settings link URL is correct.'
	);
} );

QUnit.test( 'show', function ( assert ) {
	const preview = createPagePreview(),
		measures = {
			pageX: 252,
			pageY: 1146,
			clientY: 36,
			clientRects: [ {
				bottom: 37,
				height: 13,
				left: 201,
				right: 357,
				top: 24,
				width: 156
			} ],
			offset: { top: 1134, left: 201 },
			width: 156,
			height: 13,
			scrollTop: 0,
			windowWidth: 800,
			windowHeight: 600
		},
		behavior = createBehavior( this.sandbox ),
		token = 'some-token',
		$container = $( '<div>' );

	$( preview.el ).show = this.sandbox.stub();

	const showPreview = renderer.show(
		preview, measures, {}, behavior, token, $container.get( 0 ), 'ltr' );

	assert.notStrictEqual(
		$container.html(),
		'',
		'Container is not empty.'
	);
	assert.strictEqual(
		preview.el.style.display,
		'block',
		'Preview has been shown.'
	);

	return showPreview.then( () => {
		assert.true(
			behavior.previewShow.calledWith( token ),
			'previewShow has been called with the correct token.'
		);
	} );
} );

QUnit.test( 'hide - fade out up', ( assert ) => {
	const preview = {
			el: $( '<div>' ).addClass( 'mwe-popups-fade-in-down' )[ 0 ],
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		$container = $( '<div>' ).append( preview.el ),
		hidePreview = renderer.hide( preview );

	assert.true(
		$( preview.el ).hasClass( 'mwe-popups-fade-out-up' ),
		'Thumbnail has faded out up.'
	);
	assert.false(
		$( preview.el ).hasClass( 'mwe-popups-fade-in-down' ),
		'Fade-in class has been removed.'
	);
	assert.notStrictEqual(
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
			el: $( '<div>' ).addClass( 'mwe-popups-fade-in-up' )[ 0 ],
			hasThumbnail: false,
			thumbnail: null,
			isTall: false
		},
		$container = $( '<div>' ).append( preview.el ),
		hidePreview = renderer.hide( preview );

	assert.true(
		$( preview.el ).hasClass( 'mwe-popups-fade-out-down' ),
		'Thumbnail has faded out down.'
	);
	assert.false(
		$( preview.el ).hasClass( 'mwe-popups-fade-in-up' ),
		'Fade-in class has been removed.'
	);
	assert.notStrictEqual(
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
		measures = {
			pageX: 252,
			pageY: 1146,
			clientY: 36,
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
			height: 13,
			scrollTop: 1109,
			windowWidth: 1239,
			windowHeight: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, measures, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1154,
					left: 234
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
		measures = {
			pageX: 176,
			pageY: 1252,
			clientY: 628,
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
			height: 13,
			scrollTop: 623,
			windowWidth: 587,
			windowHeight: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, measures, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1242,
					left: 158
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
		measures = {
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
			height: 13,
			scrollTop: 689,
			windowWidth: 801,
			windowHeight: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, measures, pointerSize, dir
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

QUnit.test( '#createLayout - empty preview, mouse event, popup pointer is in the correct position', ( assert ) => {
	const isPreviewTall = false,
		measures = {
			pageX: 205,
			pageY: 1146,
			clientY: 36,
			clientRects: [ {
				bottom: 37,
				height: 13,
				left: 201,
				right: 227,
				top: 24,
				width: 26
			} ],
			offset: {
				top: 1134,
				left: 201
			},
			width: 26,
			height: 13,
			scrollTop: 1109,
			windowWidth: 1239,
			windowHeight: 827
		},
		pointerSize = 8;

	const cases = [ { dir: 'ltr' }, { dir: 'rtl' } ];
	cases.forEach( ( { dir }, i ) => {
		const layout = renderer.createLayout(
			isPreviewTall, measures, pointerSize, dir
		);

		assert.deepEqual(
			layout,
			{
				offset: {
					top: 1154,
					left: 196
				},
				flippedX: dir !== 'ltr',
				flippedY: false,
				dir
			},
			`Case ${i}: the layout is correct.`
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
				'mwe-popups-no-image-pointer',
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
				'mwe-popups-no-image-pointer',
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
				'mwe-popups-no-image-pointer',
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
				'mwe-popups-no-image-pointer',
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
				'mwe-popups-no-image-pointer',
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
				'mwe-popups-image-pointer',
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
				'mwe-popups-image-pointer',
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);

	assert.strictEqual(
		$( preview.el ).css( 'top' ),
		`${layout.offset.top}px`,
		'Top is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'top' ),
		`${layout.offset.top}px`,
		'Top is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.false(
		$( preview.el ).hasClass( 'mwe-popups-no-image-pointer' ),
		'A class has been removed.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'top' ),
		`${layout.offset.top}px`,
		'Top is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).css( 'margin-top' ),
		`${199 - 8}px`, // thumb height - pointer size
		'Extract margin top has been set when preview height is smaller than the predefined landscape image height.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'top' ),
		`${layout.offset.top}px`,
		'Top is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( '.mwe-popups-extract' ).attr( 'margin-top' ),
		undefined,
		'Extract margin top has NOT been set when preview height is bigger than the predefined landscape image height.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
		'url(#mwe-popups-mask-flip)',
		'Image clip path is correct.'
	);
} );

QUnit.test( '#hasPointerOnImage', ( assert ) => {
	const cases = [
		{
			preview: {
				hasThumbnail: false
			},
			layout: {},
			expected: false,
			reason: 'If no thumbnails no chance pointer will be on image'
		},
		{
			preview: {
				isTall: true,
				hasThumbnail: true
			},
			layout: {
				flippedX: false,
				flippedY: false
			},
			expected: false,
			reason: '(landscape) Pointer on left, image on right'
		},
		{
			preview: {
				isTall: true,
				hasThumbnail: true
			},
			layout: {
				flippedX: false,
				flippedY: true
			},
			expected: false,
			reason: '(landscape) Pointer on left, image on right'
		},
		{
			preview: {
				isTall: true,
				hasThumbnail: true
			},
			layout: {
				flippedX: true,
				flippedY: true
			},
			expected: true,
			reason: '(landscape) Pointer on bottom right, image on right'
		},
		{
			preview: {
				isTall: false,
				hasThumbnail: true
			},
			layout: {
				flippedX: false,
				flippedY: false
			},
			expected: true,
			reason: '(portrait) Pointer on top left, image on top'
		},
		{
			preview: {
				isTall: false,
				hasThumbnail: true
			},
			layout: {
				flippedX: true,
				flippedY: false
			},
			expected: true,
			reason: '(portrait) Pointer on top right, image on top'
		},
		{
			preview: {
				isTall: false,
				hasThumbnail: true
			},
			layout: {
				flippedX: false,
				flippedY: true
			},
			expected: false,
			reason: '(portrait) Pointer on bottom left, image on top'
		},
		{
			preview: {
				isTall: false,
				hasThumbnail: true
			},
			layout: {
				flippedX: true,
				flippedY: true
			},
			expected: false,
			reason: '(portrait) Pointer on bottom right, image on top'
		},

		{
			preview: {
				isTall: true,
				hasThumbnail: true
			},
			layout: {
				flippedX: true,
				flippedY: false
			},
			expected: true,
			reason: '(landscape) Pointer on top right, image on right'
		}
	];

	cases.forEach( ( testCase ) => {
		assert.strictEqual(
			renderer.hasPointerOnImage( testCase.preview, testCase.layout ),
			testCase.expected,
			testCase.reason
		);
	} );
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);

	assert.strictEqual(
		$( preview.el ).css( 'bottom' ),
		`${windowHeight - layout.offset.top}px`,
		'Bottom is correct.'
	);

	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
		undefined,
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

	this.sandbox
		.stub( document, 'getElementById' )
		.returns( document.createElement( 'div' ) );

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'bottom' ),
		`${windowHeight - layout.offset.top}px`,
		'Bottom is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
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

	renderer.layoutPreview( preview, layout, classes, 200, 8, windowHeight );

	assert.true(
		classes.every( ( c ) => $( preview.el ).hasClass( c ) ),
		'Classes have been added.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'left' ),
		`${layout.offset.left}px`,
		'Left is correct.'
	);
	assert.strictEqual(
		$( preview.el ).css( 'bottom' ),
		`${windowHeight - layout.offset.top}px`,
		'Bottom is correct.'
	);
	assert.strictEqual(
		$( preview.el ).find( 'image' ).attr( 'clip-path' ),
		undefined,
		'Image clip path is not set.'
	);
} );

QUnit.test( '#setThumbnailClipPath', function ( assert ) {
	const cases = [
		// standard thumbnail sizes
		{ isTall: false, dir: 'ltr', thumbnail: { height: 200, width: 320 }, expected: 'matrix(1 0 0 1 0 0)' },
		{ isTall: true, dir: 'ltr', thumbnail: { height: 200, width: 320 }, expected: 'matrix(1 0 0 1 0 0)' },
		{ isTall: false, dir: 'rtl', thumbnail: { height: 200, width: 320 }, expected: 'matrix(-1 0 0 1 320 0)' },
		{ isTall: true, dir: 'rtl', thumbnail: { height: 200, width: 302 }, expected: 'matrix(-1 0 0 1 203 0)' },
		// portrait-mode thumbnail, wider than max width - mask should not shift
		{ isTall: true, dir: 'ltr', thumbnail: { height: 200, width: 400 }, expected: 'matrix(1 0 0 1 0 0)' },
		// portrait-mode thumbnail, narrower than max width - mask x-offset should shift
		{ isTall: true, dir: 'ltr', thumbnail: { height: 200, width: 100 }, expected: 'matrix(1 0 0 1 -103 0)' },
		// in RTL-mode, wide/narrow thumbnails - mask should not shift
		{ isTall: true, dir: 'rtl', thumbnail: { height: 200, width: 400 }, expected: 'matrix(-1 0 0 1 203 0)' },
		{ isTall: true, dir: 'rtl', thumbnail: { height: 200, width: 100 }, expected: 'matrix(-1 0 0 1 203 0)' }
	];

	const clipPath = document.createElement( 'div' );
	this.sandbox.stub( document, 'getElementById' ).returns( clipPath );

	cases.forEach( ( { isTall, dir, thumbnail, expected } ) => {
		clipPath.removeAttribute( 'transform' );
		const preview = createPagePreview( isTall, true, thumbnail ),
			layout = {
				flippedX: true,
				flippedY: false,
				offset: {
					top: 100,
					left: 200
				},
				dir
			};

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
