var getTitle = require( '../../src/getTitle' );

/* global Map */

QUnit.module( 'getTitle', {
	beforeEach: function() {
		this.config = new Map();
		this.config.set( 'wgArticlePath', '/wiki/$1' );

		this.location = global.location = { hostname: 'en.wikipedia.org' };

		window.mediaWiki.RegExp = {
			escape: this.sandbox.spy( function( str ) {
				return str.replace( /([\\{}()|.?*+\-\^$\[\]])/g, '\\$1' );
			} )
		};

		window.mediaWiki.Uri = this.sandbox.stub().throws( 'UNIMPLEMENTED' );
	},
	afterEach: function() {
		global.location = null;
		window.mediaWiki.RegExp = null;
		window.mediaWiki.Uri = null;
	}
} );

QUnit.test( 'it should return the title of a url with a title query param', function ( assert ) {
	var href = '/w/index.php?title=Foo';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		query: {
			title: 'Foo'
		}
	} );

	assert.equal( getTitle( href, this.config ), 'Foo' );
} );

QUnit.test( 'it should return the title of a pretty url if it conforms wgArticlePath', function ( assert ) {
	var href = '/wiki/Foo';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: href,
		query: {}
	} );

	assert.equal( getTitle( href, this.config ), 'Foo' );
} );

QUnit.test( 'it should return the title of a pretty url properly decoded', function ( assert ) {
	var href = '/wiki/%E6%B8%AC%E8%A9%A6';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: href,
		query: {}
	} );

	assert.equal( getTitle( href, this.config ), '測試' );
} );

QUnit.test( 'it should skip urls that mw.Uri cannot parse', function ( assert ) {
	var href = 'javascript:void(0);'; // eslint-disable-line no-script-url
	window.mediaWiki.Uri.withArgs( href ).throws(
		new Error( 'Cannot parse' )
	);

	assert.equal( getTitle( href, this.config ), undefined );
} );

QUnit.test( 'it should skip urls that are external', function ( assert ) {
	var href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: 'www.youtube.com',
		path: '/watch',
		query: { v: 'dQw4w9WgXcQ' }
	} );

	assert.equal( getTitle( href, this.config ), undefined );
} );

QUnit.test( 'it should skip urls not on article path without one title query param', function ( assert ) {
	// No params
	var href = '/Foo';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: '/Foo',
		query: {}
	} );

	assert.equal( getTitle( href, this.config ), undefined );

	// Multiple query params
	href = '/Foo?a=1&title=Foo';
	window.mediaWiki.Uri.withArgs( href ).returns( {
		host: this.location.hostname,
		path: '/Foo',
		query: { a: 1, title: 'Foo' }
	} );

	assert.equal( getTitle( href, this.config ), undefined );
} );
