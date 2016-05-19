( function ( mw, $ ) {

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
		var value = $.jStorage.get( 'mwe-popups-enabled' );

		return Boolean( value ) && value !== 'false';
	}

	/**
	 * Has the user previously disabled Popups by clicking "Disable previews" in the settings
	 * overlay?
	 *
	 * @return {boolean}
	 * @ignore
	 */
	function hasUserDisabledFeature() {
		return $.jStorage.get( 'mwe-popups-enabled' ) === 'false';
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
	 * @return {jQuery.Promise}
	 */
	mw.popups.experiment.isUserInCondition = function isUserInCondition() {
		var deferred = $.Deferred(),
				config = mw.config.get( 'wgPopupsExperimentConfig' ),
				result;

		// The first two tests deal with whether the user has /explicitly/ enable or disabled via its
		// settings.
		if ( hasUserEnabledFeature() ) {
			deferred.resolve( true );
		} else if ( hasUserDisabledFeature() ) {
			deferred.resolve( false );
		} else if (

			// Users with the beta feature enabled are already in the experimental condition.
			mw.config.get( 'wgPopupsExperimentIsBetaFeatureEnabled', false )
		) {
			deferred.resolve( true );
		} else if ( !config ) {
			deferred.resolve( false );
		} else {
			mw.requestIdleCallback( function () {
				// FIXME: mw.experiments should expose the CONTROL_BUCKET constant, e.g.
				// `mw.experiments.CONTROL_BUCKET`.
				result = mw.experiments.getBucket( config, getToken() ) !== 'control';

				deferred.resolve( result );
			} );
		}

		return deferred.promise();
	};

}( mediaWiki, jQuery ) );
