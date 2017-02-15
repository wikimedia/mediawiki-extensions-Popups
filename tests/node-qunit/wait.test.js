var wait = require( '../../src/wait' );

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', function ( assert ) {
	var done = assert.async(),
		timeout;

	assert.expect( 1 );

	timeout = this.sandbox.stub( global, 'setTimeout', function ( callback ) {
		callback();
	} );

	wait( 150 ).done( function () {
		assert.strictEqual(
			timeout.getCall( 0 ).args[ 1 ],
			150,
			'It waits for the given duration'
		);

		done();
	} );

	timeout.restore();
} );
