const createPagePreviewGateway = require( '../../../src/gateway/page.js' );
const RestModule = require( '../../../src/gateway/rest.js' );
const MediawikiModule = require( '../../../src/gateway/mediawiki.js' );

QUnit.module( 'gateway/page.js', {
	beforeEach() {
		mw.Api = function () {};

		this.createMediaWikiApiGateway =
			this.sandbox.stub( MediawikiModule, 'createMediaWikiApiGateway' );
		this.createRESTBaseGateway = this.sandbox.stub( RestModule, 'createRESTBaseGateway' );

		this.config = new Map();
	}
} );

QUnit.test( 'it uses mediawiki plain text gateway with wgPopupsGateway == "mwApiPlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'mwApiPlain' );

	createPagePreviewGateway( this.config );

	assert.true( this.createMediaWikiApiGateway.called,
		'MW plain text gateway called' );
} );

QUnit.test( 'it uses rest plain text gateway with wgPopupsGateway == "restbasePlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbasePlain' );

	createPagePreviewGateway( this.config );

	assert.true( this.createRESTBaseGateway.called,
		'REST plain text gateway called' );
} );

QUnit.test( 'it uses rest HTML gateway with wgPopupsGateway == "restbaseHTML"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbaseHTML' );

	createPagePreviewGateway( this.config );

	assert.true( this.createRESTBaseGateway.called, 'REST HTML gateway called' );
} );
