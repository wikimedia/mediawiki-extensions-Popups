import { getTitle, isValid } from '../../src/title';

/* global Map */

QUnit.module( 'title#getTitle', {
	beforeEach() {
		this.config = new Map();
		this.config.set( 'wgArticlePath', '/wiki/$1' );

		this.location = global.location = { hostname: 'en.wikipedia.org' };

		mediaWiki.RegExp = {
			escape: this.sandbox.spy( ( str ) => {
				return str.replace( /([\\{}()|.?*+\-^$[\]])/g, '\\$1' );
			} )
		};

		mediaWiki.Uri = this.sandbox.stub().throws( 'UNIMPLEMENTED' );
	},
	afterEach() {
		global.location = null;
		mediaWiki.RegExp = null;
		mediaWiki.Uri = null;
	}
} );

QUnit.test( 'it should return the title of a url with a title query param', function ( assert ) {
	const href = '/w/index.php?title=Foo';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		query: {
			title: 'Foo'
		}
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		'Foo',
		'The query title is returned.'
	);
} );

QUnit.test( 'it should return the title of a pretty url if it conforms wgArticlePath', function ( assert ) {
	const href = '/wiki/Foo';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: href,
		query: {}
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		'Foo',
		'The ASCII title is returned.'
	);
} );

QUnit.test( 'it should return the title of a pretty url properly decoded', function ( assert ) {
	const href = '/wiki/%E6%B8%AC%E8%A9%A6';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: href,
		query: {}
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		'測試',
		'The UTF-8 title is returned.'
	);
} );

QUnit.test( 'it should skip urls that mw.Uri cannot parse', function ( assert ) {
	const href = 'javascript:void(0);'; // eslint-disable-line no-script-url
	mediaWiki.Uri.withArgs( href ).throws(
		new Error( 'Cannot parse' )
	);

	assert.strictEqual(
		getTitle( href, this.config ),
		undefined,
		'No title is returned.'
	);
} );

QUnit.test( 'it should skip urls that are external', function ( assert ) {
	const href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: 'www.youtube.com',
		path: '/watch',
		query: { v: 'dQw4w9WgXcQ' }
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		undefined,
		'No title is returned.'
	);
} );

QUnit.test( 'it should skip urls not on article path without one title query param', function ( assert ) {
	// No params
	let href = '/Foo';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: '/Foo',
		query: {}
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		undefined,
		'No title is returned.'
	);

	// Multiple query params
	href = '/Foo?a=1&title=Foo';
	mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: '/Foo',
		query: { a: 1, title: 'Foo' }
	} );

	assert.strictEqual(
		getTitle( href, this.config ),
		undefined,
		'No title is returned.'
	);
} );

QUnit.module( 'title#isValid', {
	beforeEach() {
		mediaWiki.Title = {
			newFromText: this.sandbox.stub().throws( 'UNIMPLEMENTED' )
		};
	},
	afterEach() {
		mediaWiki.Title = null;
	}
} );

QUnit.test( 'it should return null if the title is empty', ( assert ) => {
	assert.strictEqual( isValid( '', [] ), null, 'Doesn\'t accept empty titles' );
} );

QUnit.test( 'it should return null if the title can\'t be parsed properly', ( assert ) => {
	mediaWiki.Title.newFromText.withArgs( 'title' ).returns( null );
	assert.strictEqual(
		isValid( 'title', [] ),
		null,
		'Doesn\'t accept unparseable titles'
	);
	assert.strictEqual(
		mediaWiki.Title.newFromText.callCount, 1,
		'mediaWiki.Title.newFromText called for parsing the title' );
} );

QUnit.test( 'it should return null if the title is not from a content namespace', ( assert ) => {
	mediaWiki.Title.newFromText.withArgs( 'title' ).returns( {
		namespace: 1
	} );
	assert.strictEqual(
		isValid( 'title', [ 5 ] ),
		null,
		'Only content namespace titles are accepted'
	);
} );

QUnit.test( 'it should return the title object if the title is from a content namespace', ( assert ) => {
	const mwTitle = {
		namespace: 3
	};
	mediaWiki.Title.newFromText.withArgs( 'title' ).returns( mwTitle );
	assert.strictEqual(
		isValid( 'title', [ 1, 3, 5 ] ),
		mwTitle,
		'A content namespace title is accepted'
	);
} );
