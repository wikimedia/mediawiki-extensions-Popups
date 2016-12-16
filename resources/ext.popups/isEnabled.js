( function ( mw ) {

	/**
	 * Given the global state of the application, creates a function that gets
	 * whether or not the user should have Page Previews enabled.
	 *
	 * The user has previews enabled if:
	 * * The beta feature is available (see `$wgPopupsBetaFeature`) and they've
	 *   enabled the beta feature.
	 * * They *haven't disabled* it via the settings modal.
	 *
	 * The first case covers the enabled by default case: if
	 * `$wgPopupsBetaFeature` is `false` and the user hasn't disabled previews via
	 * their preferences, then previews are enabled.
	 *
	 * @param {mw.user} user The `mw.user` singleton instance
	 * @param {Object} userSettings An object returned by
	 *  `mw.popups.createUserSettings`
	 *
	 * @return {Boolean}
	 */
	mw.popups.isEnabled = function ( user, userSettings ) {
		if ( user.isAnon() ) {
			return false;
		}

		return !userSettings.hasIsEnabled() ||
			( userSettings.hasIsEnabled() && userSettings.getIsEnabled() );
	};

}( mediaWiki ) );
