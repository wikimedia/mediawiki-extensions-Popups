( function ( mw ) {

	function createStubUser( isAnon ) {
		return {
			isAnon: function () {
				return isAnon;
			}
		};
	}

	function createStubUserSettings( hasIsEnabled ) {
		return {
			getToken: function () {
				return '1234567890';
			},
			hasIsEnabled: function () {
				return hasIsEnabled;
			},
			getIsEnabled: function () {
				return true;
			}
		};
	}

	QUnit.module( 'ext.popups/experiment', {
		setup: function () {
			this.config = new mw.Map();
			this.user = createStubUser( /* isAnon = */ true );
			this.userSettings = createStubUserSettings( /* hasIsEnabled = */ false );
			this.isUserInCondition = mw.popups.createExperiment( this.config, this.user, this.userSettings );
		}
	} );

	QUnit.test( 'is should return false if the experiment is disabled', 1, function ( assert ) {
		this.config.set( 'wgPopupsExperiment', false );

		assert.notOk( this.isUserInCondition() );
	} );

	QUnit.test( '#isUserInCondition', 2, function ( assert ) {
		var user = createStubUser( /* isAnon = */ false ),
			isUserInCondition = mw.popups.createExperiment( this.config, user, this.userSettings );

		this.config.set( {
			wgPopupsExperiment: true,
			wgPopupsExperimentIsBetaFeatureEnabled: true
		} );

		assert.ok(
			isUserInCondition(),
			'If the user has the beta feature enabled, then they are in the condition.'
		);

		// ---

		this.config.set( 'wgPopupsExperimentIsBetaFeatureEnabled', false );

		assert.notOk(
			isUserInCondition(),
			'If the user has the beta feature disabled, then they aren\'t in the condition.'
		);
	} );

	QUnit.test( 'it should bucket the user', 2, function ( assert ) {
		var experimentConfig = {
				name: 'Popups A/B Test - May, 2016',
				enabled: true,
				buckets: {
					control: 0.5,
					A: 0.5
				}
			},
			getBucketSpy = this.sandbox.stub( mw.experiments, 'getBucket' ).returns( 'A' );

		this.config.set( {
			wgPopupsExperiment: true,
			wgPopupsExperimentConfig: experimentConfig
		} );

		assert.ok( this.isUserInCondition() );
		assert.deepEqual( getBucketSpy.firstCall.args[0], experimentConfig );
	} );

	QUnit.test( 'it should return false if the experiment isn\'t configured', 1, function ( assert ) {
		this.config.set( 'wgPopupsExperiment', true );

		assert.notOk( this.isUserInCondition() );
	} );

	QUnit.test( 'it shouldn\'t bucket the user if they have enabled or disabled Page Previews', 2, function ( assert ) {
		var userSettings = createStubUserSettings( /* hasIsEnabled = */ true ),
			getIsEnabledSpy = this.sandbox.spy( userSettings, 'getIsEnabled' ),
			isUserInCondition = mw.popups.createExperiment( this.config, this.user, userSettings );

		assert.ok( isUserInCondition() );
		assert.strictEqual( 1, getIsEnabledSpy.callCount );
	} );

}( mediaWiki ) );
