( function ( mw ) {

	/**
	 * Creates a **minimal** stub that can be used in place of an `mw.User`
	 * instance.
	 *
	 * @param {boolean} isAnon The return value of the `#isAnon`.
	 * @return {Object}
	 */
	mw.popups.tests.stubs.createStubUser = function createStubUser( isAnon ) {
		return {
			isAnon: function () {
				return isAnon;
			},
			sessionId: function () {
				return '0123456789';
			},
			generateRandomSessionId: function () {
				return '9876543210';
			}
		};
	};

}( mediaWiki ) );
