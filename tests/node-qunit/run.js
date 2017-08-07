#!/usr/bin/env node

require( 'babel-register' )( {
	presets: [
		[ 'env', {
			targets: {
				node: 6
			}
		} ]
	]
} );
require( 'mw-node-qunit' );
