import wait from '../../src/wait';

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', function ( assert ) {
	var timeout;

	assert.expect( 1 );

	timeout = this.sandbox.stub( global, 'setTimeout', function ( callback ) {
		callback();
	} );

	return wait( 150 ).done( function () {
		assert.strictEqual(
			timeout.getCall( 0 ).args[ 1 ],
			150,
			'It waits for the given duration'
		);
	} ).always( function () {
		timeout.restore();
	} );
} );
