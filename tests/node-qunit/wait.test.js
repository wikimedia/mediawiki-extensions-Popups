import wait from '../../src/wait';

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', function ( assert ) {
	assert.expect( 1 );

	const timeout = this.sandbox.stub( global, 'setTimeout' ).callsFake( ( callback ) => {
		callback();
	} );

	return wait( 150 ).then( () => {
		assert.strictEqual(
			timeout.getCall( 0 ).args[ 1 ],
			150,
			'It waits for the given duration'
		);
		timeout.restore();
	} ).catch( ( err ) => {
		timeout.restore();
		throw err;
	} );
} );
