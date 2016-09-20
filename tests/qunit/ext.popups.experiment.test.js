( function ( mw ) {

	QUnit.module( 'ext.popups.experiment', QUnit.newMwEnvironment( {
		config: {
			wgPopupsExperimentConfig: {
				name: 'Popups A/B Test - May, 2016',
				enabled: true,
				buckets: {
					control: 0.5,
					A: 0.5
				}
			},
			wgPopupsExperimentIsBetaFeatureEnabled: null
		},
		setup: function () {
			// As anon user by default
			this.sandbox.stub( mw.user, 'isAnon', function () { return true; } );
			mw.storage.remove( 'mwe-popups-enabled' );
		},
		teardown: function () {
			mw.storage.remove( 'PopupsExperimentID' );
		}
	} ) );

	QUnit.test( '#isUserInCondition: user has beta feature enabled', 1, function ( assert ) {
		// Be logged in for the beta feature test
		mw.user.isAnon.restore();
		this.sandbox.stub( mw.user, 'isAnon', function () { return false; } );

		mw.config.set( 'wgPopupsExperimentConfig', null );
		mw.config.set( 'wgPopupsExperimentIsBetaFeatureEnabled', true );

		assert.strictEqual(
			mw.popups.experiment.isUserInCondition(),
			true,
			'If the user has the beta feature enabled, then they aren\'t in the condition.'
		);
	} );

	QUnit.test( '#isUserInCondition', 2, function ( assert ) {
		var getBucketSpy = this.sandbox.stub( mw.experiments, 'getBucket' ).returns( 'A' ),
			config = mw.config.get( 'wgPopupsExperimentConfig' ),
			result,
			firstCallArgs;

		result = mw.popups.experiment.isUserInCondition();

		firstCallArgs = getBucketSpy.firstCall.args;

		assert.deepEqual(
			firstCallArgs[ 0 ],
			config,
			'The Popups experiment config is used when bucketing the user.'
		);

		assert.strictEqual(
			result,
			true,
			'If the user isn\'t in the control bucket, then they are in the condition.'
		);
	} );

	QUnit.test( '#isUserInCondition: token is persisted', 1, function ( assert ) {
		var token = '1234567890',
			setSpy = this.sandbox.spy( mw.storage, 'set' );

		this.sandbox.stub( mw.user, 'generateRandomSessionId' ).returns( token );

		mw.popups.experiment.isUserInCondition();

		assert.deepEqual(
			setSpy.firstCall.args[ 1 ],
			token,
			'The token is persisted transparently.'
		);
	} );

	QUnit.test( '#isUserInCondition: experiment isn\'t configured', 1, function ( assert ) {
		mw.config.set( 'wgPopupsExperimentConfig', null );

		assert.strictEqual(
			mw.popups.experiment.isUserInCondition(),
			false,
			'If the experiment isn\'t configured, then the user isn\'t in the condition.'
		);
	} );

	QUnit.test( '#isUserInCondition: user has enabled the feature', 1, function ( assert ) {
		mw.storage.set( 'mwe-popups-enabled', '1' );

		assert.strictEqual(
			mw.popups.experiment.isUserInCondition(),
			true,
			'If the experiment has enabled the feature, then the user is in the condition.'
		);
	} );

	QUnit.test( '#isUserInCondition: user has disabled the feature', 1, function ( assert ) {
		// This should be read as follows: the user has enabled the beta feature but has since
		// disabled the feature via its settings.
		mw.config.set( 'wgPopupsExperimentIsBetaFeatureEnabled', true );
		mw.storage.set( 'mwe-popups-enabled', '0' );

		assert.strictEqual(
			mw.popups.experiment.isUserInCondition(),
			false,
			'If the experiment has enabled the feature, then the user is in the condition.'
		);
	} );

}( mediaWiki ) );
