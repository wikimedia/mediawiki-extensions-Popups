import { createThumbnail, createThumbnailElement } from '../../../src/ui/thumbnail';

let $ = jQuery;

QUnit.module( 'ext.popups#thumbnail', {
	beforeEach() {
		$.bracketedDevicePixelRatio = () => 1;
	},
	afterEach() {
		$.bracketedDevicePixelRatio = null;
	}
} );

QUnit.test( 'createThumbnail - tall image', ( assert ) => {
	let devicePixelRatio = $.bracketedDevicePixelRatio(),
		rawThumbnail = {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/409px-President_Barack_Obama.jpg',
			width: 409,
			height: 512
		},
		thumbnail = createThumbnail( rawThumbnail );

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

QUnit.test( 'createThumbnail - tall image element', ( assert ) => {
	let thumbnail,
		cases = [
			{
				width: 200,
				height: 300,
				expectedX: 203 - 200,
				expectedY: ( 300 - 250 ) / -2,
				expectedSVGWidth: 203,
				expectedSVGHeight: 250,
				message: 'Width smaller than the predefined width (203).'
			},
			{
				width: 250,
				height: 300,
				expectedX: ( 250 - 203 ) / -2,
				expectedY: ( 300 - 250 ) / -2,
				expectedSVGWidth: 203,
				expectedSVGHeight: 250,
				message: 'Width bigger than the predefined width (203).'
			}
		];

	cases.forEach( ( case_ ) => {
		thumbnail = createThumbnail( {
			source: 'https://image.url',
			width: case_.width,
			height: case_.height
		} );

		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'x' ),
			case_.expectedX,
			'Image element x coordinate is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'y' ),
			case_.expectedY,
			'Image element y coordinate is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'width' ),
			case_.width,
			'Image element width is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'height' ),
			case_.height,
			'Image element height is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.attr( 'width' ),
			case_.expectedSVGWidth,
			'Image SVG width is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.attr( 'height' ),
			case_.expectedSVGHeight,
			'Image SVG height is correct. ' + case_.message
		);
	} );
} );

QUnit.test( 'createThumbnail - landscape image', ( assert ) => {
	let devicePixelRatio = $.bracketedDevicePixelRatio(),
		rawThumbnail = {
			source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/500px-President_Barack_Obama.jpg',
			width: 500,
			height: 400
		},
		thumbnail = createThumbnail( rawThumbnail );

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

QUnit.test( 'createThumbnail - landscape image element', ( assert ) => {
	let thumbnail,
		cases = [
			{
				width: 400,
				height: 150,
				expectedX: 0,
				expectedY: 0,
				expectedSVGWidth: 320 + 3,
				expectedSVGHeight: 150,
				message: 'Height smaller than the predefined height (200).'
			},
			{
				width: 400,
				height: 250,
				expectedX: 0,
				expectedY: ( 250 - 200 ) / -2,
				expectedSVGWidth: 320 + 3,
				expectedSVGHeight: 200,
				message: 'Height bigger than the predefined height (200).'
			}
		];

	cases.forEach( ( case_ ) => {
		thumbnail = createThumbnail( {
			source: 'https://image.url',
			width: case_.width,
			height: case_.height
		} );

		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'x' ),
			case_.expectedX,
			'Image x coordinate is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'y' ),
			case_.expectedY,
			'Image y coordinate is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'width' ),
			case_.width,
			'Image element width is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.find( 'image' ).attr( 'height' ),
			case_.height,
			'Image element height is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.attr( 'width' ),
			case_.expectedSVGWidth,
			'Image SVG width is correct. ' + case_.message
		);
		assert.equal(
			thumbnail.el.attr( 'height' ),
			case_.expectedSVGHeight,
			'Image SVG height is correct. ' + case_.message
		);
	} );
} );

QUnit.test( 'createThumbnail - no raw thumbnail', ( assert ) => {
	let thumbnail = createThumbnail( null );

	assert.equal( thumbnail, null, 'No thumbnail.' );
} );

QUnit.test( 'createThumbnail - small wide image', ( assert ) => {
	let rawThumbnail = {
			source: 'https://landscape-image.jpg',
			width: 299,
			height: 298
		},
		thumbnail = createThumbnail( rawThumbnail );

	assert.equal( thumbnail, null, 'No thumbnail.' );
} );

QUnit.test( 'createThumbnail - small tall image', ( assert ) => {
	let rawThumbnail = {
			source: 'https://tall-image.jpg',
			width: 248,
			height: 249
		},
		thumbnail = createThumbnail( rawThumbnail );

	assert.equal( thumbnail, null, 'No thumbnail.' );
} );

QUnit.test( 'createThumbnail - insecure URL', ( assert ) => {
	let cases = [
			'https://tall-ima\\ge.jpg',
			'https://tall-ima\'ge.jpg',
			'https://tall-ima"ge.jpg'
		],
		thumbnail;

	cases.forEach( ( case_ ) => {
		thumbnail = createThumbnail( {
			source: case_,
			width: 500,
			height: 400
		} );

		assert.equal( thumbnail, null, 'No thumbnail.' );
	} );
} );

QUnit.test( 'createThumbnailElement', ( assert ) => {
	let className = 'thumb-class',
		url = 'https://thumbnail.url',
		x = 25,
		y = 50,
		thumbnailWidth = 200,
		thumbnailHeight = 250,
		width = 500,
		height = 300,
		clipPath = 'mwe-popups-mask',
		$thumbnail = createThumbnailElement(
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
