( function ( mw ) {

	QUnit.module( 'ext.popups/userSettings', {
		setup: function () {
			var stubUser = {
				generateRandomSessionId: function () {
					return '1234567890';
				}
			};

			this.storage = new mw.Map();
			this.userSettings = mw.popups.createUserSettings( this.storage, stubUser );
		}
	} );

	QUnit.test( '#getIsEnabled should return true if the storage is empty', 1, function ( assert ) {
		assert.ok( this.userSettings.getIsEnabled() );
	} );

	QUnit.test( '#getIsEnabled should return false if Link Previews have been disabled', 2, function ( assert ) {
		this.userSettings.setIsEnabled( false );

		assert.notOk( this.userSettings.getIsEnabled() );

		// ---

		this.userSettings.setIsEnabled( true );

		assert.ok(
			this.userSettings.getIsEnabled(),
			'#getIsEnabled should return true if Page Previews have been enabled'
		);
	} );

	QUnit.test( '#hasIsEnabled', 2, function ( assert ) {
		assert.notOk( this.userSettings.hasIsEnabled() );

		// ---

		this.userSettings.setIsEnabled( false );

		assert.ok(
			this.userSettings.hasIsEnabled(),
			'#hasIsEnabled should return true even if "isEnabled" has been set to falsy.'
		);
	} );

	QUnit.test( '#getToken', 2, function ( assert ) {
		var token = this.userSettings.getToken();

		assert.ok(
			token,
			'#getToken should return a token even if the storage is empty.'
		);

		assert.equal(
			this.storage.get( 'PopupsExperimentID' ),
			token,
			'#getToken persists the token in the storage transparently.'
		);
	} );

	QUnit.test( '#getToken should always return the same token', 1, function ( assert ) {
		assert.equal( this.userSettings.getToken(), this.userSettings.getToken() );
	} );

}( mediaWiki ) );
