/**
 * @module schema
 */

var mw = window.mediaWiki,
	$ = jQuery;

/**
 * Creates an instance of the [EventLogging Schema class][0] with a sampling
 * rate of `wgPopupsSchemaSamplingRate` if the UA supports [the Beacon API][1]
 * or `0` if it doesn't.
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-EventLogging/blob/master/modules/ext.eventLogging.Schema.js
 * [1]: https://w3c.github.io/beacon/
 *
 * @param {mw.Map} config
 * @param {Window} window
 * @return {mw.eventLog.Schema}
 */
module.exports = function ( config, window ) {
	var samplingRate = config.get( 'wgPopupsSchemaSamplingRate', 0 );

	if (
		!window.navigator ||
		!$.isFunction( window.navigator.sendBeacon )
	) {
		samplingRate = 0;
	}

	return new mw.eventLog.Schema( 'Popups', samplingRate );
};
