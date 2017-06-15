var mock = require( 'mock-require' ),
	createGateway;

QUnit.module( 'gateway/index.js', {
	beforeEach: function () {
		jQuery.bracketedDevicePixelRatio = function () { return 1; };
		mediaWiki.Api = function () {};

		this.mwApiPlain = this.sandbox.stub();
		mock( '../../../src/gateway/plain/mediawiki', this.mwApiPlain );
		this.restbasePlain = this.sandbox.stub();
		mock( '../../../src/gateway/plain/rest', this.restbasePlain );
		this.restbaseHTML = this.sandbox.stub();
		mock( '../../../src/gateway/html/rest', this.restbaseHTML );

		createGateway = mock.reRequire( '../../../src/gateway' );

		this.config = new Map(); /* global Map */
	},
	afterEach: function () {
		jQuery.bracketedDevicePixelRatio = undefined;
		mock.stop( '../../../src/gateway/plain/mediawiki' );
		mock.stop( '../../../src/gateway/plain/rest' );
		mock.stop( '../../../src/gateway/html/rest' );
	}
} );

QUnit.test( 'it uses mediawiki plain text gateway with wgPopupsGateway == "mwApiPlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'mwApiPlain' );

	createGateway( this.config );

	assert.ok( this.mwApiPlain.called, 'MW plain text gateway called' );
} );

QUnit.test( 'it uses rest plain text gateway with wgPopupsGateway == "restbasePlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbasePlain' );

	createGateway( this.config );

	assert.ok( this.restbasePlain.called, 'REST plain text gateway called' );
} );

QUnit.test( 'it uses rest HTML gateway with wgPopupsGateway == "restbaseHTML"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbaseHTML' );

	createGateway( this.config );

	assert.ok( this.restbaseHTML.called, 'REST HTML gateway called' );
} );
