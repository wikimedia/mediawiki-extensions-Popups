( function ( mw ) {

	QUnit.module( 'ext.popups/wait' );

	QUnit.test( 'it should resolve after waiting', function ( assert ) {
		var done = assert.async();

		this.sandbox.stub( window, 'setTimeout', function ( callback ) {
			callback();
		} );

		mw.popups.wait( 150 ).done( function () {
			assert.strictEqual(
				window.setTimeout.getCall( 0 ).args[ 1 ],
				150,
				'It waits for the given duration'
			);

			done();
		} );
	} );

}( mediaWiki ) );
