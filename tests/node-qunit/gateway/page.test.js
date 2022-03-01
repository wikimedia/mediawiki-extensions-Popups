import createPagePreviewGateway from '../../../src/gateway/page';
import * as RestModule from '../../../src/gateway/rest';
import * as MediawikiModule from '../../../src/gateway/mediawiki';

QUnit.module( 'gateway/page.js', {
	beforeEach() {
		mw.Api = function () {};

		this.createMediaWikiApiGateway =
			this.sandbox.stub( MediawikiModule, 'default' );
		this.createRESTBaseGateway = this.sandbox.stub( RestModule, 'default' );

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
