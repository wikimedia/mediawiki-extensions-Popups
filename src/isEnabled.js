/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * If Page Previews is configured as a beta feature (see
 * `$wgPopupsBetaFeature`), the user must be logged in and have enabled the
 * beta feature in order to see previews.
 *
 * If Page Previews is configured as a preference, then the user must either
 * be logged in and have enabled the preference or be logged out and have not
 * disabled previews via the settings modal.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by
 *  `mw.popups.createUserSettings`
 * @param {mw.Map} config
 *
 * @return {Boolean}
 */
module.exports = function ( user, userSettings, config ) {
	if ( !user.isAnon() ) {
		return config.get( 'wgPopupsShouldSendModuleToUser' );
	}

	if ( config.get( 'wgPopupsBetaFeature' ) ) {
		return false;
	}

	return !userSettings.hasIsEnabled() ||
		( userSettings.hasIsEnabled() && userSettings.getIsEnabled() );
};
