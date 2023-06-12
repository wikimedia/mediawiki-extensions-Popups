/**
 * @module isPagePreviewsEnabled
 */
const canSaveToUserPreferences = require( './canSaveToUserPreferences.js' );

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
 * @return {boolean|null} Null when there is no way the popup type can be enabled at run-time.
 */
export default function isPagePreviewsEnabled( user, userSettings, config ) {
	// T160081: Unavailable when in conflict with the Navigation Popups gadgets.
	if ( config.get( 'wgPopupsConflictsWithNavPopupGadget' ) ) {
		return null;
	}

	// For anonymous users, and for IP masked usersm the code loads always,
	// but the feature can be toggled at run-time via local storage.
	if ( !canSaveToUserPreferences( user ) ) {
		return userSettings.isPagePreviewsEnabled();
	}

	// Registered users never can enable popup types at run-time.
	return mw.user.options.get( 'popups' ) === '1' ? true : null;
}
