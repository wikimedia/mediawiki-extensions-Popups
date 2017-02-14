( function ( mw ) {

	QUnit.module( 'ext.popups/userSettings', {
		setup: function () {
			var stubUser = mw.popups.tests.stubs.createStubUser( /* isAnon = */ true );

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

	QUnit.test( '#getPreviewCount should return the count as a number', function ( assert ) {
		assert.expect( 3 );

		assert.strictEqual(
			this.userSettings.getPreviewCount(),
			0,
			'#getPreviewCount returns 0 when the storage is empty.'
		);

		// ---

		this.storage.set( 'ext.popups.core.previewCount', false );

		assert.strictEqual(
			this.userSettings.getPreviewCount(),
			-1,
			'#getPreviewCount returns -1 when the storage isn\'t available.'
		);

		// ---

		this.storage.set( 'ext.popups.core.previewCount', '111' );

		assert.strictEqual(
			this.userSettings.getPreviewCount(),
			111
		);
	} );

	QUnit.test( '#setPreviewCount should store the count as a string', function ( assert ) {
		assert.expect( 1 );

		this.userSettings.setPreviewCount( 222 );

		assert.strictEqual( this.storage.get( 'ext.popups.core.previewCount' ), '222' );
	} );

}( mediaWiki ) );
