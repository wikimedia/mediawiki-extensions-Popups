( function ( mw ) {

	function createStubUserSettings( hasIsEnabled ) {
		return {
			hasIsEnabled: function () {
				return hasIsEnabled;
			},
			getIsEnabled: function () {
				return true;
			}
		};
	}

	QUnit.module( 'ext.popups#isEnabled' );

	QUnit.test( 'it should return true when the user has enabled it via UI interactions', function ( assert ) {
		var user = mw.popups.tests.stubs.createStubUser( /* isAnon = */ false ),
			userSettings = createStubUserSettings( /* hasIsEnabled = */ true );

		assert.ok( mw.popups.isEnabled( user, userSettings ) );
	} );

	QUnit.test( 'it should return false if the user is an anon', function ( assert ) {
		var user = mw.popups.tests.stubs.createStubUser( /* isAnon = */ true ),
			userSettings = createStubUserSettings( /* hasIsEnabled = */ true );

		assert.notOk(
			mw.popups.isEnabled( user, userSettings ),
			'It should return false even if the user has enabled it via UI interactions.'
		);
	} );

	QUnit.test( 'it should return true if the user hasn\'t disabled it via UI interactions', function ( assert ) {
		var user = mw.popups.tests.stubs.createStubUser( /* isAnon = */ false ),
			userSettings = createStubUserSettings( /* hasIsEnabled = */ false );

		assert.ok( mw.popups.isEnabled( user, userSettings ) );
	} );

}( mediaWiki ) );
