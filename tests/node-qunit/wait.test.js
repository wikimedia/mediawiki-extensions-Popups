import wait from '../../src/wait';

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', function ( assert ) {
	const then = Date.now();
	return wait( 150 ).then( () => {
		assert.strictEqual(
			( Date.now() - then ) > 150,
			true,
			'It waits for the given duration'
		);
	} );
} );
