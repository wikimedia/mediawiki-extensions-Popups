#!/usr/bin/env node
const fs = require( 'fs' ),
	mwNodeQunit = require( '@wikimedia/mw-node-qunit' ),
	sinon = mwNodeQunit.sinon,
	QUnitModule = QUnit.module,
	svgInlineLoader = require( 'svg-inline-loader' );

require( '@babel/register' )( {
	presets: [
		[ '@babel/preset-env', {
			targets: {
				node: 6
			}
		} ]
	]
} );

require.extensions[ '.svg' ] = ( module, filename ) => {
	const svg = fs.readFileSync( filename, { encoding: 'utf8' } );
	// eslint-disable-next-line no-underscore-dangle
	module._compile( svgInlineLoader( svg ), filename );
};

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
