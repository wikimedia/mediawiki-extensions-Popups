/**
 * Whether statsv logging is enabled
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {mw.experiments} experiments The `mw.experiments` singleton instance
 * @returns {bool} Whether the statsv logging is enabled for the user
 *  given the sampling rate.
 */
function isEnabled( user, config, experiments ) {
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
}

module.exports = {
	isEnabled: isEnabled
};
