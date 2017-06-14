/**
 * @module schema
 */

/**
 * Gets whether EventLogging logging is enabled for the duration of the user's
 * session. The bucketing rate is controlled by `wgPopupsSchemaSamplingRate`.
 * However, if the UA doesn't support [the Beacon API][1], then bucketing is
 * disabled.
 *
 * [1]: https://w3c.github.io/beacon/
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Experiments} experiments
 * @param {Window} window
 * @return {Boolean}
 */
exports.isEnabled = function isEnabled( user, config, experiments, window ) {
	var samplingRate = config.get( 'wgPopupsSchemaSamplingRate', 0 );

	if (
		!window.navigator ||
		!$.isFunction( window.navigator.sendBeacon )
	) {
		samplingRate = 0;
	}

	return experiments.weightedBoolean(
		'ext.Popups.instrumentation.eventLogging',
		samplingRate,
		user.sessionId()
	);
};
