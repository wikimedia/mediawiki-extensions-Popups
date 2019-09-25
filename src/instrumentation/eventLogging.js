/**
 * @module instrumentation/eventLogging
 */

/**
 * Gets whether EventLogging logging is enabled for the duration of the user's
 * session.
 * If wgPopupsEventLogging is false this will return false unless debug=true has
 * been enabled.
 * However, if the UA doesn't support [the Beacon API][1], then bucketing is
 * disabled.
 *
 * [1]: https://w3c.github.io/beacon/
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {Window} window
 * @return {boolean}
 */
export function isEnabled( user, config, window ) {
	// if debug mode is on, always enable event logging. @see T168847
	if ( config.get( 'debug' ) === true ) {
		return true;
	}

	if ( !config.get( 'wgPopupsEventLogging' ) ) {
		return false;
	}

	if (
		!window.navigator ||
		typeof window.navigator.sendBeacon !== 'function'
	) {
		return false;
	}

	return true;
}
