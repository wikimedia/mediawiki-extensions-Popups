( function ( mw ) {

	mw.popups.actions = {};

	/**
	 * @param {Function} isUserInCondition See `mw.popups.createExperiment`
	 */
	mw.popups.actions.boot = function ( isUserInCondition ) {
		return {
			type: 'BOOT',
			isUserInCondition: isUserInCondition()
		};
	};

}( mediaWiki ) );
