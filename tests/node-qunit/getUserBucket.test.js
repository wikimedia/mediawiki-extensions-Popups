import * as stubs from './stubs';
import getUserBucket from '../../src/getUserBucket';

QUnit.module( 'ext.popups#getUserBucket' );

QUnit.test( 'If no users are subject to experiment everyone is bucketed as on', ( assert ) => {
	assert.ok(
		getUserBucket( stubs.createStubExperiments( 'A' ), 0, 'a' ) === 'on' );
} );

QUnit.test( 'Define how experiment size impacts buckets', function ( assert ) {
	const tests = [
		[ 1, { off: 0, control: 0.5, on: 0.5 } ],
		[ 0.9, { off: 0.1, control: 0.45, on: 0.45 } ],
		[ 0.3, { off: 0.7, control: 0.15, on: 0.15 } ],
		[ 0.5, { off: 0.5, control: 0.25, on: 0.25 } ],
		[ 0.45, { off: 0.55, control: 0.225, on: 0.225 } ],
		[ 0.006, { off: 0.994, control: 0.003, on: 0.003 } ]
	];

	tests.forEach( ( test ) => {
		const experiments = stubs.createStubExperiments( 'A' ),
			spy = this.sandbox.spy( experiments, 'getBucket' ),
			expectedBuckets = test[ 1 ];

		getUserBucket( experiments, test[ 0 ], 'a' );

		const actualBuckets = spy.getCall( 0 ).args[ 0 ].buckets;
		// To avoid precision issues we'll need to test them all individually
		// rather than check use calledWith. Otherwise we'll get some false
		// positives.
		assert.ok(
			actualBuckets.off.toFixed( 2 ) === expectedBuckets.off.toFixed( 2 ) );
		assert.ok(
			actualBuckets.on.toFixed( 2 ) === expectedBuckets.on.toFixed( 2 ) );
		assert.ok(
			actualBuckets.control.toFixed( 2 ) ===
			expectedBuckets.control.toFixed( 2 )
		);
	} );
} );
