( function ( mw ) {

	/**
	 * @ignore
	 */
	function getToken() {
		var key = 'PopupsExperimentID',
			id = mw.storage.get( key );

		if ( !id ) {
			id = mw.user.generateRandomSessionId();

			mw.storage.set( key, id );
		}

		return id;
	}

	/**
	 * Has the user previously enabled Popups by clicking "Enable previews" in the
	 * footer menu?
	 *
	 * @return {boolean}
	 * @ignore
	 */
	function hasUserEnabledFeature() {
		var value = mw.storage.get( 'mwe-popups-enabled' );

		return Boolean( value ) && value !== '0';
	}

	/**
	 * Has the user previously disabled Popups by clicking "Disable previews" in the settings
	 * overlay?
	 *
	 * @return {boolean}
	 * @ignore
	 */
	function hasUserDisabledFeature() {
		return mw.storage.get( 'mwe-popups-enabled' ) === '0';
	}

	/**
	 * @class mw.popups.experiment
	 * @singleton
	 */
	mw.popups.experiment = {};

	/**
	 * Gets whether or not the user has Popups enabled, i.e. whether they are in the experiment
	 * condition.
	 *
	 * The user is in the experiment condition if:
	 * * they've enabled Popups by click "Enable previews" in the footer menu, or
	 * * they've enabled Popups as a beta feature, or
	 * * they aren't in the control bucket of the experiment
	 *
	 * N.B. that the user isn't entered into the experiment, i.e. they aren't assigned or a bucket,
	 * if the experiment isn't configured.
	 *
	 * @return {boolean}
	 */
	mw.popups.experiment.isUserInCondition = function isUserInCondition() {
		var config = mw.config.get( 'wgPopupsExperimentConfig' );

		// The first two tests deal with whether the user has /explicitly/ enable or disabled via its
		// settings.
		if ( hasUserEnabledFeature() ) {
			return true;
		}

		if ( hasUserDisabledFeature() ) {
			return false;
		}

		if ( mw.user.isAnon() ) {
			if ( !config ) {
				return false;
			}

			// FIXME: mw.experiments should expose the CONTROL_BUCKET constant, e.g.
			// `mw.experiments.CONTROL_BUCKET`.
			return mw.experiments.getBucket( config, getToken() ) !== 'control';
		} else {
			// Logged in users are in condition depending on the beta feature flag
			// instead of bucketing
			return mw.config.get( 'wgPopupsExperimentIsBetaFeatureEnabled', false );
		}
	};

}( mediaWiki ) );
