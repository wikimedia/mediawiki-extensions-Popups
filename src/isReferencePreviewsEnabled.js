/**
 * @module isReferencePreviewsEnabled
 */
const canSaveToUserPreferences = require( './canSaveToUserPreferences.js' );

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Reference Previews enabled.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 *
 * @return {boolean|null} Null when there is no way the popup type can be enabled at run-time.
 */
export default function isReferencePreviewsEnabled( user, userSettings, config ) {
	// TODO: This and the final `mw.user.options` check are currently redundant. Only this here
	// should be removed when the feature flag is not needed any more.
	if ( !config.get( 'wgPopupsReferencePreviews' ) ) {
		return null;
	}

	// T265872: Unavailable when in conflict with (one of the) reference tooltips gadgets.
	if ( config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ) ||
		config.get( 'wgPopupsConflictsWithNavPopupGadget' ) ||
		// T243822: Temporarily disabled in the mobile skin
		config.get( 'skin' ) === 'minerva'
	) {
		return null;
	}

	// For anonymous users, the code loads always, but the feature can be toggled at run-time via
	// local storage.
	if ( !canSaveToUserPreferences( user ) ) {
		return userSettings.isReferencePreviewsEnabled();
	}

	// TODO: Remove when not in Beta any more
	if ( config.get( 'wgPopupsReferencePreviews' ) ) {
		return true;
	}

	// Registered users never can enable popup types at run-time.
	return mw.user.options.get( 'popups-reference-previews' ) === '1' ? true : null;
}
