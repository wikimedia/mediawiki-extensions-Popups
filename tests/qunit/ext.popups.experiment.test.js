( function ( mw, $ ) {

	QUnit.module( 'ext.popups.experiment', QUnit.newMwEnvironment( {
		config: {
			wgPopupsExperimentConfig: {
				name: 'Popups A/B Test - May, 2016',
				enabled: true,
				buckets: {
					control: 0.5,
					A: 0.5
				}
			}
		},
		teardown: function () {
			mw.storage.remove( 'PopupsExperimentID' );
		}
	} ) );

	QUnit.test( '#isUserInCondition: user has beta feature enabled', function ( assert ) {
		var done = assert.async();

		mw.config.set( 'wgPopupsExperimentConfig', null );
		mw.config.set( 'wgPopupsExperimentIsBetaFeatureEnabled', true );

		mw.popups.experiment.isUserInCondition().then( function ( result ) {
			assert.strictEqual(
				result,
				true,
				'If the user has the beta feature enabled, then they aren\'t in the condition.'
			);

			done();
		} );
	} );

	QUnit.test( '#isUserInCondition', function ( assert ) {
		var getBucketSpy = this.sandbox.stub( mw.experiments, 'getBucket' ).returns( 'A' ),
			config = mw.config.get( 'wgPopupsExperimentConfig' ),
			done = assert.async();

		mw.popups.experiment.isUserInCondition().then( function ( result ) {
			var fistCallArgs = getBucketSpy.firstCall.args;

			assert.deepEqual(
				fistCallArgs[ 0 ],
				config,
				'The Popups experiment config is used when bucketing the user.'
			);

			assert.strictEqual(
				result,
				true,
				'If the user isn\'t in the control bucket, then they are in the condition.'
			);

			done();
		} );
	} );

	QUnit.test( '#isUserInCondition: token is persisted', function ( assert ) {
		var token = '1234567890',
			setSpy = this.sandbox.spy( mw.storage, 'set' ),
			done = assert.async();

		this.sandbox.stub( mw.user, 'generateRandomSessionId' ).returns( token );

		mw.popups.experiment.isUserInCondition().then( function () {
			assert.deepEqual(
				setSpy.firstCall.args[ 1 ],
				token,
				'The token is persisted transparently.'
			);

			done();
		} );
	} );

	QUnit.test( '#isUserInCondition: experiment isn\'t configured', function ( assert ) {
		var done = assert.async();

		mw.config.set( 'wgPopupsExperimentConfig', null );

		mw.popups.experiment.isUserInCondition().then( function ( result ) {
			assert.strictEqual(
				result,
				false,
				'If the experiment isn\'t configured, then the user isn\'t in the condition.'
			);

			done();
		} );
	} );

	QUnit.test( '#isUserInCondition: user has enabled the feature', function ( assert ) {
		var done = assert.async();

		$.jStorage.set( 'mwe-popups-enabled', 'true' );

		mw.popups.experiment.isUserInCondition().then( function ( result ) {
			assert.strictEqual(
				result,
				true,
				'If the experiment has enabled the feature, then the user is in the condition.'
			);

			$.jStorage.deleteKey( 'mwe-popups-enabled' );

			done();
		} );
	} );

}( mediaWiki, jQuery ) );
