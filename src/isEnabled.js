/**
 * Given the global state of the application, creates a function that gets
 * whether or not the user should have Page Previews enabled.
 *
 * Page Preview is disabled when the Navigation Popups gadget is enabled.
 *
 * If Page Previews is configured as a beta feature (see
 * `$wgPopupsBetaFeature`), the user must be logged in and have enabled the
 * beta feature in order to see previews. Logged out users won't be able
 * to see the feature.
 *
 * If Page Previews is configured as a preference, then the user must either
 * be logged in and have enabled the preference or be logged out and have not
 * disabled previews via the settings modal. Logged out users who have not
 * disabled or enabled the previews via the settings modal are sampled at
 * the sampling rate defined by `wgPopupsAnonsEnabledSamplingRate`.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {Object} userSettings An object returned by `userSettings.js`
 * @param {mw.Map} config
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 *
 * @return {Boolean}
 */
module.exports = function ( user, userSettings, config, experiments ) {
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
		return isUserSampled( user, config, experiments );
	}

	return userSettings.getIsEnabled();
};

/**
 * Is the user sampled based on a sampling rate?
 *
 * The sampling rate is taken from `wgPopupsAnonsEnabledSamplingRate` and
 * defaults to 0.9.
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 *
 * @return {Boolean}
 */
function isUserSampled( user, config, experiments ) {
	var samplingRate = config.get( 'wgPopupsAnonsEnabledSamplingRate', 0.9 ),
		bucket = experiments.getBucket( {
			name: 'ext.Popups.visibility',
			enabled: true,
			buckets: {
				control: 1 - samplingRate,
				A: samplingRate
			}
		}, user.sessionId() );

	return bucket === 'A';
}
