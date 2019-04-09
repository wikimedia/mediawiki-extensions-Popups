/**
 * @module isEnabled
 */

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * Page Previews is disabled when the Navigation Popups gadget is enabled.
 *
 * If Page Previews is configured as a user preference, then the user must
 * either be logged in and have enabled the preference or be logged out and have
 * not disabled previews via the settings modal.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 *
 * @return {boolean}
 */
export default function isEnabled( user, userSettings, config ) {
	if ( config.get( 'wgPopupsConflictsWithNavPopupGadget' ) ) {
		return false;
	}

	if ( !user.isAnon() ) {
		// For logged-in users, enablement is equal to the
		// loading of this very code.
		return true;
	} else {
		// For anonymous users, the code loads always, but the feature
		// can be toggled at run-time via local storage.
		if ( !userSettings.hasIsEnabled() ) {
			// Default when no setting is stored.
			return true;
		} else {
			return userSettings.getIsEnabled();
		}
	}
}
