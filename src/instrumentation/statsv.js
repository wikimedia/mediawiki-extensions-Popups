/**
 * @module instrumentation/statsv
 * @private
 */

/**
 * Gets whether Graphite logging (via [the statsv HTTP endpoint][0]) is enabled
 * for the duration of the user's session. The bucketing rate is controlled by
 * `wgPopupsStatsvSamplingRate`.
 *
 * [0]: https://wikitech.wikimedia.org/wiki/Graphite#statsv
 *
 * @param {mw.User} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Experiments} experiments
 * @return {boolean}
 */
export function isEnabled( user, config, experiments ) {
	const bucketingRate = config.get( 'wgPopupsStatsvSamplingRate', 0 );
	if ( bucketingRate === 0 || bucketingRate === 1 ) {
		// Avoid calling user.sessionId() if possible, since it sets a cookie
		return !!bucketingRate;
	}

	return experiments.weightedBoolean(
		'ext.Popups.statsv',
		bucketingRate,
		user.sessionId()
	);
}
