#!/usr/bin/env node
const mwNodeQunit = require( '@wikimedia/mw-node-qunit' ),
	sinon = mwNodeQunit.sinon,
	QUnitModule = QUnit.module;

sinon.config = {
	injectIntoThis: true,
	injectInto: null,
	useFakeTimers: false,
	useFakeServer: false,
	properties: [ 'spy', 'stub', 'mock', 'sandbox' ]
};

mwNodeQunit.setUp();

// Override Qunit.module to set up a sinon sandbox automatically
QUnit.module = function ( name, localEnv ) {
	localEnv = localEnv || {};
	QUnitModule( name, {
		beforeEach: function () {
			const config = Object.assign( {}, sinon.config, {
				injectInto: this
			} );
			this.sandbox = sinon.createSandbox( config );

			if ( localEnv.beforeEach ) {
				localEnv.beforeEach.call( this );
			}
		},
		afterEach: function () {
			// Interop with old teardown config on mediawiki codebases

			this.sandbox.restore();
			if ( localEnv.afterEach ) {
				localEnv.afterEach.call( this );
			}
		}
	} );
};
