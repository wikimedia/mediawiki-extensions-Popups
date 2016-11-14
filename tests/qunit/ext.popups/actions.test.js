( function ( mw ) {

	QUnit.module( 'ext.popups/actions' );

	QUnit.test( '#boot', 1, function ( assert ) {
		var isUserInCondition = function () {
				return false;
			},
			sessionID = '0123456789',
			generateToken = function () {
				return '9876543210';
			};

		assert.deepEqual(
			mw.popups.actions.boot( isUserInCondition, sessionID, generateToken ),
			{
				type: 'BOOT',
				isUserInCondition: false,
				sessionToken: '0123456789',
				pageToken: '9876543210'
			}
		);
	} );

}( mediaWiki ) );
