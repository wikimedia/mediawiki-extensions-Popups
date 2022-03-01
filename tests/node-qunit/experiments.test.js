import createExperiments from '../../src/experiments';

QUnit.module( 'ext.popups/experiments#weightedBoolean' );

QUnit.test( 'it should call mw.experiments#getBucket', function ( assert ) {
	const getBucketStub = this.sandbox.stub(),
		stubMWExperiments = {
			getBucket: getBucketStub
		},
		experiments = createExperiments( stubMWExperiments );

	experiments.weightedBoolean( 'foo', 0.2, 'barbaz' );

	assert.strictEqual(
		getBucketStub.callCount,
		1,
		'The bucketer was invoked once.'
	);
	assert.deepEqual(
		getBucketStub.getCall( 0 ).args,
		[
			{
				enabled: true,

				name: 'foo',
				buckets: {
					true: 0.2,
					false: 0.8 // 1 - 0.2
				}
			},
			'barbaz'
		],
		'The bucketer was called with the correct arguments.'
	);

	// ---

	getBucketStub.returns( 'true' );

	assert.true(
		experiments.weightedBoolean( 'foo', 0.2, 'barbaz' ),
		'It should return true if the bucket is "true".'
	);
} );
