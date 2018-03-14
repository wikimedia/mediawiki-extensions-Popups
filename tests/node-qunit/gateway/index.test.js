import createGateway from '../../../src/gateway';
import * as RestModule from '../../../src/gateway/rest';
import * as MediawikiModule from '../../../src/gateway/mediawiki';

QUnit.module( 'gateway/index.js', {
	beforeEach() {
		mediaWiki.Api = function () {};

		this.createMediaWikiApiGateway =
			this.sandbox.stub( MediawikiModule, 'default' );
		this.createRESTBaseGateway = this.sandbox.stub( RestModule, 'default' );

		this.config = new Map(); /* global Map */
	}
} );

QUnit.test( 'it uses mediawiki plain text gateway with wgPopupsGateway == "mwApiPlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'mwApiPlain' );

	createGateway( this.config );

	assert.ok( this.createMediaWikiApiGateway.called,
		'MW plain text gateway called' );
} );

QUnit.test( 'it uses rest plain text gateway with wgPopupsGateway == "restbasePlain"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbasePlain' );

	createGateway( this.config );

	assert.ok( this.createRESTBaseGateway.called,
		'REST plain text gateway called' );
} );

QUnit.test( 'it uses rest HTML gateway with wgPopupsGateway == "restbaseHTML"', function ( assert ) {
	this.config.set( 'wgPopupsGateway', 'restbaseHTML' );

	createGateway( this.config );

	assert.ok( this.createRESTBaseGateway.called, 'REST HTML gateway called' );
} );
