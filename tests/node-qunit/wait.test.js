const { wait } = require( '../../src/wait.js' );

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', ( assert ) => {
	const then = Date.now();
	return wait( 150 ).then( () => {
		assert.true( ( Date.now() - then ) >= 150, 'It waits for the given duration' );
	} );
} );
