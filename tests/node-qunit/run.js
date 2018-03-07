#!/usr/bin/env node
const fs = require( 'fs' ),
	svgInlineLoader = require( 'svg-inline-loader' );

require( 'babel-register' )( {
	presets: [
		[ 'env', {
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

require( 'mw-node-qunit' );
