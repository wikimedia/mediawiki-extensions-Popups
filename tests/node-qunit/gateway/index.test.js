var mock = require( 'mock-require' ),
	createGateway;

QUnit.module( 'gateway/index.js', {
	beforeEach: function () {
		jQuery.bracketedDevicePixelRatio = function () { return 1; };
		mediaWiki.Api = function () {};

		this.createMediaWikiApiGateway = this.sandbox.stub();
		mock( '../../../src/gateway/mediawiki', this.createMediaWikiApiGateway );
		this.createRESTBaseGateway = this.sandbox.stub();
		mock( '../../../src/gateway/rest', this.createRESTBaseGateway );

		createGateway = mock.reRequire( '../../../src/gateway' );

		this.config = new Map(); /* global Map */
	},
	afterEach: function () {
		jQuery.bracketedDevicePixelRatio = undefined;
		mock.stop( '../../../src/gateway/mediawiki' );
		mock.stop( '../../../src/gateway/rest' );
	}
} );

QUnit.test( 'it uses mediawiki plain text gateway with wgPopupsGateway == "mwApiPlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'mwApiPlain' );

	createGateway( this.config );

	assert.ok( this.createMediaWikiApiGateway.called, 'MW plain text gateway called' );
} );

QUnit.test( 'it uses rest plain text gateway with wgPopupsGateway == "restbasePlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbasePlain' );

	createGateway( this.config );

	assert.ok( this.createRESTBaseGateway.called, 'REST plain text gateway called' );
} );

QUnit.test( 'it uses rest HTML gateway with wgPopupsGateway == "restbaseHTML"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbaseHTML' );

	createGateway( this.config );

	assert.ok( this.createRESTBaseGateway.called, 'REST HTML gateway called' );
} );
