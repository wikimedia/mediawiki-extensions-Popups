/**
 * @module statsvInstrumentation
 */

/**
 * Gets whether Graphite logging (via [the statsv HTTP endpoint][0]) is enabled
 * for duration of the browser session. The sampling rate is controlled by
 * `wgPopupsStatsvSamplingRate`.
 *
 * [0]: https://wikitech.wikimedia.org/wiki/Graphite#statsv
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 * @returns {Boolean}
 */
exports.isEnabled = function isEnabled( user, config, experiments ) {
	var samplingRate = config.get( 'wgPopupsStatsvSamplingRate', 0 ),
		bucket = experiments.getBucket( {
			name: 'ext.Popups.statsv',
			enabled: true,
			buckets: {
				control: 1 - samplingRate,
				A: samplingRate
			}
		}, user.sessionId() );

	return bucket === 'A';
};
