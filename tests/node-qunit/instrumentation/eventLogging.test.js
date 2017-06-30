var isEnabled = require( '../../../src/instrumentation/eventLogging' ).isEnabled,
	stubs = require( '../stubs' );

QUnit.module( 'ext.popups/instrumentation/eventLogging', {
	beforeEach: function () {
		this.config = stubs.createStubMap();

		this.config.set( 'wgPopupsSchemaSamplingRate', 1 );

		this.window = {
			navigator: {
				sendBeacon: function () {}
			}
		};

		this.experiments = {
			weightedBoolean: this.sandbox.stub()
		};

		this.user = stubs.createStubUser();

		// Helper function that DRYs up the tests below.
		this.isEnabled = function () {
			return isEnabled(
				this.user,
				this.config,
				this.experiments,
				this.window
			);
		};
	}
} );

QUnit.test( 'it should use wgPopupsSchemaSamplingRate as the sampling rate', function ( assert ) {
	this.isEnabled();

	assert.ok( this.experiments.weightedBoolean.calledOnce );
	assert.deepEqual(
		this.experiments.weightedBoolean.getCall( 0 ).args,
		[
			'ext.Popups.instrumentation.eventLogging',
			this.config.get( 'wgPopupsSchemaSamplingRate' ),
			this.user.sessionId()
		]
	);

	// ---

	this.config.delete( 'wgPopupsSchemaSamplingRate' );

	this.isEnabled();

	assert.strictEqual(
		this.experiments.weightedBoolean.getCall( 1 ).args[ 1 ],
		0,
		'The bucketing rate should be 0 by default.'
	);
} );

QUnit.test( 'it should use a 0 bucketing rate when sendBeacon isn\'t supported', function ( assert ) {
	var window = {};

	isEnabled( this.user, this.config, this.experiments, window );

	assert.deepEqual(
		this.experiments.weightedBoolean.getCall( 0 ).args[ 1 ],
		/* trueWeight = */ 0
	);

	// ---

	window.navigator = {
		sendBeacon: 'NOT A FUNCTION'
	};

	isEnabled( this.user, this.config, this.experiments, window );

	assert.deepEqual(
		this.experiments.weightedBoolean.getCall( 1 ).args[ 1 ],
		/* trueWeight = */ 0
	);
} );

QUnit.test( 'it should return the weighted boolean', function ( assert ) {
	this.experiments.weightedBoolean.returns( true );

	assert.ok( this.isEnabled() );

	// ---

	this.experiments.weightedBoolean.returns( false );

	assert.notOk( this.isEnabled() );
} );

QUnit.test( 'it should respect the debug flag', function ( assert ) {
	this.config.set( 'wgPopupsSchemaSamplingRate', 0 );
	this.config.set( 'debug', false );
	assert.notOk( this.isEnabled() );

	this.config.set( 'debug', true );
	assert.ok( this.isEnabled() );
} );
