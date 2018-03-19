/**
 * @module instrumentation/statsv
 */

/**
 * Gets whether Graphite logging (via [the statsv HTTP endpoint][0]) is enabled
 * for the duration of the user's session. The bucketing rate is controlled by
 * `wgPopupsStatsvSamplingRate`.
 *
 * [0]: https://wikitech.wikimedia.org/wiki/Graphite#statsv
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Experiments} experiments
 * @return {Boolean}
 */
export function isEnabled( user, config, experiments ) {
	const bucketingRate = config.get( 'wgPopupsStatsvSamplingRate', 0 );

	return experiments.weightedBoolean(
		'ext.Popups.statsv',
		bucketingRate,
		user.sessionId()
	);
}
