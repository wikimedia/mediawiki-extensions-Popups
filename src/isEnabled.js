/**
 * @module isEnabled
 */
import { BUCKETS } from './constants';

/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * Page Previews is disabled when the Navigation Popups gadget is enabled.
 *
 * If Page Previews is configured as a beta feature (see
 * `$wgPopupsBetaFeature`), the user must be logged in and have enabled the
 * beta feature in order to see previews. Logged out users won't be able
 * to see the feature.
 *
 * If Page Previews is configured as a user preference, then the user must
 * either be logged in and have enabled the preference or be logged out and have
 * not disabled previews via the settings modal. Logged out users who have not
 * disabled or enabled the previews via the settings modal will be subject to
 * wgPopupsAnonsExperimentalGroupSize if defined.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 * @param {String} bucket the user belongs to (off, on or control)
 *
 * @return {Boolean}
 */
export default function isEnabled( user, userSettings, config, bucket ) {
	if ( config.get( 'wgPopupsConflictsWithNavPopupGadget' ) ) {
		return false;
	}

	if ( !user.isAnon() ) {
		return config.get( 'wgPopupsShouldSendModuleToUser' );
	}

	if ( config.get( 'wgPopupsBetaFeature' ) ) {
		return false;
	}

	if ( !userSettings.hasIsEnabled() ) {
		return bucket === BUCKETS.on;
	}

	return userSettings.getIsEnabled();
}
