import createExperiments from '../../src/experiments';

QUnit.module( 'ext.popups/experiments#weightedBoolean' );

QUnit.test( 'it should call mw.experiments#getBucket', function ( assert ) {
	const getBucketStub = this.sandbox.stub(),
		stubMWExperiments = {
			getBucket: getBucketStub
		},
		experiments = createExperiments( stubMWExperiments );

	experiments.weightedBoolean( 'foo', 0.2, 'barbaz' );

	assert.ok( getBucketStub.calledOnce );
	assert.deepEqual(
		getBucketStub.getCall( 0 ).args,
		[
			{
				enabled: true,

				name: 'foo',
				buckets: {
					'true': 0.2,
					'false': 0.8 // 1 - 0.2
				}
			},
			'barbaz'
		]
	);

	// ---

	getBucketStub.returns( 'true' );

	assert.ok(
		experiments.weightedBoolean( 'foo', 0.2, 'barbaz' ),
		'It should return true if the bucket is "true".'
	);
} );
