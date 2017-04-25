var stubs = require( './stubs' ),
	statsv = require( '../../src/statsvInstrumentation' );

QUnit.module( 'ext.popups/statsvInstrumentation', {
	beforeEach: function () {
		this.user = stubs.createStubUser();
		this.config = stubs.createStubMap();
	}
} );

QUnit.test( 'isEnabled', function ( assert ) {
	var experiments = stubs.createStubExperiments( true );

	assert.expect( 2 );

	assert.ok(
		statsv.isEnabled( this.user, this.config, experiments ),
		'Logging is enabled when the user is in the sample.'
	);

	experiments = stubs.createStubExperiments( false );

	assert.notOk(
		statsv.isEnabled( this.user, this.config, experiments ),
		'Logging is disabled when the user is not in the sample.'
	);
} );
