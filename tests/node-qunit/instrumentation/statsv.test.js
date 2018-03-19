import * as stubs from './../stubs';
import { isEnabled } from '../../../src/instrumentation/statsv';

QUnit.module( 'ext.popups/instrumentation/statsv' );

QUnit.test( '#isEnabled', function ( assert ) {
	const user = stubs.createStubUser(),
		config = stubs.createStubMap(),
		weightedBooleanStub = this.sandbox.stub(),
		experiments = {
			weightedBoolean: weightedBooleanStub
		};

	config.set( 'wgPopupsStatsvSamplingRate', 0.3141 );

	isEnabled( user, config, experiments );

	assert.ok( weightedBooleanStub.calledOnce );
	assert.deepEqual(
		weightedBooleanStub.getCall( 0 ).args,
		[
			'ext.Popups.statsv',
			config.get( 'wgPopupsStatsvSamplingRate' ),
			user.sessionId()
		]
	);

	// ---

	config.delete( 'wgPopupsStatsvSamplingRate' );

	isEnabled( user, config, experiments );

	assert.deepEqual(
		weightedBooleanStub.getCall( 1 ).args[ 1 ],
		0,
		'The bucketing rate should be 0 by default.'
	);
} );
