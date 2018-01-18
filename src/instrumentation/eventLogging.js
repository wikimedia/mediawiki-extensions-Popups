/**
 * @module instrumentation/eventLogging
 */
import { BUCKETS } from './../constants';

/**
 * Gets whether EventLogging logging is enabled for the duration of the user's
 * session.
 * If wgPopupsEventLogging is false this will return false unless debug=true has
 * been enabled.
 * If an experiment is being run (ie. wgPopupsAnonsExperimentalGroupSize has
 * been defined) then event logging will only be enabled for those in the `on`
 * or `control` groups.
 * However, if the UA doesn't support [the Beacon API][1], then bucketing is
 * disabled.
 *
 * [1]: https://w3c.github.io/beacon/
 *
 * @param {mw.user} user The `mw.user` singleton instance
 * @param {mw.Map} config The `mw.config` singleton instance
 * @param {String} bucket that the user is in (see constants.js)
 * @param {Window} window
 * @return {Boolean}
 */
export function isEnabled( user, config, bucket, window ) {
	// if debug mode is on, always enable event logging. @see T168847
	if ( config.get( 'debug' ) === true ) {
		return true;
	}

	if ( !config.get( 'wgPopupsEventLogging' ) ) {
		return false;
	}

	if (
		!window.navigator ||
		!$.isFunction( window.navigator.sendBeacon )
	) {
		return false;
	}

	return user.isAnon() && bucket !== BUCKETS.off;
}
