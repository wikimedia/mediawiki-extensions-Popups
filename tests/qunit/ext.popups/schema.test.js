( function ( mw ) {

	QUnit.module( 'ext.popups/schema', {
		setup: function () {
			this.config = new mw.Map();
			this.config.set( 'wgPopupsSchemaPopupsSamplingRate', 1 );

			this.window = {
				navigator: {
					sendBeacon: function () {}
				}
			};

			// Stub out the mw.eventLog.Schema constructor function.
			this.sandbox.stub( mw.eventLog, 'Schema', function () {} );
		}
	} );

	QUnit.test( 'it should use $wgPopupsSchemaPopupsSamplingRate as the sampling rate', function ( assert ) {
		assert.expect( 2 );

		mw.popups.createSchema( this.config, this.window );

		assert.ok( mw.eventLog.Schema.calledWith( 'Popups', 1 ) );

		// ---

		mw.popups.createSchema( new mw.Map(), this.window );

		assert.ok(
			mw.eventLog.Schema.calledWith( 'Popups', 0 ),
			'If $wgPopupsSchemaPopupsSamplingRate isn\'t set, then the sampling rate should be 0.'
		);
	} );

	QUnit.test( 'it should use a 0 sampling rate when sendBeacon isn\'t supported', function ( assert ) {
		var expectedArgs = [ 'Popups', 0 ];

		assert.expect( 2 );

		mw.popups.createSchema( this.config, { } );

		assert.deepEqual( mw.eventLog.Schema.getCall( 0 ).args, expectedArgs );

		// ---

		mw.popups.createSchema( this.config, {
			navigator: {
				sendBeacon: 'NOT A FUNCTION'
			}
		} );

		assert.deepEqual( mw.eventLog.Schema.getCall( 1 ).args, expectedArgs );
	} );

	QUnit.test( 'it should use a 0 sampling rate in a unit testing environment', function ( assert ) {
		assert.expect( 1 );

		this.window.QUnit = {};

		mw.popups.createSchema( this.config, this.window );

		assert.ok( mw.eventLog.Schema.calledWith( 'Popups', 0 ) );
	} );

}( mediaWiki ) );
