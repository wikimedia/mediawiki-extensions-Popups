var mw = mediaWiki,
	createSchema = require( '../../src/schema' ),
	createStubMap = require( './stubs' ).createStubMap;

QUnit.module( 'ext.popups/schema', {
	beforeEach: function () {
		this.config = createStubMap();

		this.config.set( 'wgPopupsSchemaSamplingRate', 1 );

		this.window = {
			navigator: {
				sendBeacon: function () {}
			}
		};

		// Stub out the mw.eventLog.Schema constructor function.
		mw.eventLog = { Schema: this.sandbox.stub() };
	}
} );

QUnit.test( 'it should use $wgPopupsSchemaSamplingRate as the sampling rate', function ( assert ) {
	assert.expect( 2 );

	createSchema( this.config, this.window );

	assert.ok( mw.eventLog.Schema.calledWith( 'Popups', 1 ) );

	// ---

	createSchema( createStubMap(), this.window );

	assert.ok(
		mw.eventLog.Schema.calledWith( 'Popups', 0 ),
		'If $wgPopupsSchemaSamplingRate isn\'t set, then the sampling rate should be 0.'
	);
} );

QUnit.test( 'it should use a 0 sampling rate when sendBeacon isn\'t supported', function ( assert ) {
	var expectedArgs = [ 'Popups', 0 ];

	assert.expect( 2 );

	createSchema( this.config, { } );

	assert.deepEqual( mw.eventLog.Schema.getCall( 0 ).args, expectedArgs );

	// ---

	createSchema( this.config, {
		navigator: {
			sendBeacon: 'NOT A FUNCTION'
		}
	} );

	assert.deepEqual( mw.eventLog.Schema.getCall( 1 ).args, expectedArgs );
} );

QUnit.test( 'it should use a 0 sampling rate in a unit testing environment', function ( assert ) {
	assert.expect( 1 );

	this.window.QUnit = {};

	createSchema( this.config, this.window );

	assert.ok( mw.eventLog.Schema.calledWith( 'Popups', 0 ) );
} );
