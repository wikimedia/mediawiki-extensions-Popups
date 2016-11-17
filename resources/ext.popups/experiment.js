( function ( mw ) {

	/**
	 * Given the global state of the application, creates a function that gets
	 * whether or not the user should have Page Previews enabled, i.e. whether
	 * they are in the experiment condition.
	 *
	 * The user is in the experiment condition if:
	 * * They've enabled by Page Previews by clicking "Enable previews" in the
	 *   footer menu.
	 * * They've enabled Page Previews as a beta feature.
	 * * They aren't in the control bucket of the experiment.
	 *
	 * @param {mw.Map} config
	 * @param {mw.user} user The `mw.user` singleton instance
	 * @param {Object} userSettings An object returned by
	 *  `ext.popups.createUserSettings`, from which the user's token will be
	 *  retrieved
	 *
	 * @return {Function}
	 */
	mw.popups.createExperiment = function ( config, user, userSettings ) {
		return function () {
			var experimentConfig = config.get( 'wgPopupsExperimentConfig' );

			if ( userSettings.hasIsEnabled() ) {
				return userSettings.getIsEnabled();
			}

			if ( config.get( 'wgPopupsExperiment', false ) === false ) {
				return false;
			}

			if ( user.isAnon() ) {
				if ( !experimentConfig ) {
					return false;
				}

				// FIXME: mw.experiments should expose the CONTROL_BUCKET constant, e.g.
				// `mw.experiments.CONTROL_BUCKET`.
				return mw.experiments.getBucket( experimentConfig, userSettings.getToken() ) !== 'control';
			} else {
				// Logged in users are in condition depending on the beta feature flag
				// instead of bucketing
				return config.get( 'wgPopupsExperimentIsBetaFeatureEnabled', false );
			}
		};
	};

}( mediaWiki ) );
