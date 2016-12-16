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
			userSettings = createStubUserSettings( /* hasIsEnabled = */ true ),
			isEnabled = mw.popups.isEnabled( user, userSettings );

		assert.ok( isEnabled() );
	} );

	QUnit.test( 'it should return false if the user is an anon', function ( assert ) {
		var user = mw.popups.tests.stubs.createStubUser( /* isAnon = */ true ),
			userSettings = createStubUserSettings( /* hasIsEnabled = */ true ),
			isEnabled = mw.popups.isEnabled( user, userSettings );

		assert.notOk(
			isEnabled(),
			'It should return false even if the user has enabled it via UI interactions.'
		);
	} );

	QUnit.test( 'it should return true if the user hasn\'t disabled it via UI interactions', function ( assert ) {
		var user = mw.popups.tests.stubs.createStubUser( /* isAnon = */ false ),
			userSettings = createStubUserSettings( /* hasIsEnabled = */ false ),
			isEnabled = mw.popups.isEnabled( user, userSettings );

		assert.ok( isEnabled() );
	} );

}( mediaWiki ) );
