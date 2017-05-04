var mock = require( 'mock-require' ),
	processLinks = require( '../../src/processLinks' );

/* global Map */

QUnit.module( 'ext.popups/processLinks', {
	beforeEach: function () {
		this.getTitle = this.sandbox.stub().throws( 'UNIMPLEMENTED' );
		mock( '../../src/getTitle', this.getTitle );
		processLinks = mock.reRequire( '../../src/processLinks' );

		this.$container = $( '<div />' );
		this.$container.html(
			'<a href="link" title="title" class="blacklisted">Skip this link</a>'
		);

		this.config = new Map();

		window.mediaWiki.Title = {
			newFromText: this.sandbox.stub().throws( 'UNIMPLEMENTED' )
		};
	},
	afterEach: function () {
		mock.stop( '../../src/getTitle' );
		window.mediaWiki.Title = null;
	}
} );

QUnit.test( 'it should not return links without a href attribute', function ( assert ) {
	this.$container.html(
		'<a title="title" class="blacklisted">Skip this link</a>'
	);
	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		0
	);
} );

QUnit.test( 'it should not return links without a title attribute', function ( assert ) {
	this.$container.html(
		'<a href="link" class="blacklisted">Skip this link</a>'
	);

	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		0
	);
} );

QUnit.test( 'it should not return links in the blacklist', function ( assert ) {
	assert.deepEqual(
		processLinks( this.$container, [ '.blacklisted' ], this.config ).length,
		0
	);
} );

QUnit.test( 'it should not return links without valid page title', function ( assert ) {
	this.getTitle.withArgs( 'link', this.config ).returns( null );

	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		0
	);
	assert.equal( this.getTitle.callCount, 1 );
	assert.deepEqual( this.getTitle.getCall( 0 ).args, [ 'link', this.config ] );
} );

QUnit.test( 'it should not return links without valid mediawiki title', function ( assert ) {
	this.getTitle.withArgs( 'link', this.config ).returns( 'title' );
	window.mediaWiki.Title.newFromText.withArgs( 'title' ).returns( null );

	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		0
	);
	assert.equal( window.mediaWiki.Title.newFromText.callCount, 1 );
	assert.deepEqual( window.mediaWiki.Title.newFromText.getCall( 0 ).args, [ 'title' ] );
} );

QUnit.test( 'it should not return links without valid namespace', function ( assert ) {
	this.getTitle.withArgs( 'link', this.config ).returns( 'title' );
	window.mediaWiki.Title.newFromText.withArgs( 'title' ).returns( {
		namespace: 1
	} );
	// Valid namespaces for content
	this.config.set( 'wgContentNamespaces', [ 5 ] );

	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		0
	);
} );

QUnit.test( 'it should return only valid links', function ( assert ) {
	// Valid link
	this.getTitle.withArgs( 'link', this.config ).returns( 'title' );
	window.mediaWiki.Title.newFromText.withArgs( 'title' ).returns( {
		namespace: 5
	} );

	// Invalid link because of namespace
	this.$container.add( '<a href="link2" title="title">Banana</a>' );
	this.getTitle.withArgs( 'link2', this.config ).returns( 'title2' );
	window.mediaWiki.Title.newFromText.withArgs( 'title2' ).returns( {
		namespace: 3 // Not content
	} );

	// Valid namespaces for content
	this.config.set( 'wgContentNamespaces', [ 5 ] );

	assert.deepEqual(
		processLinks( this.$container, [], this.config ).length,
		1
	);
} );
