/**
 * Creates an instance of the statsv change listener.
 *
 * The listener will log events to StatsD via the [the "StatsD timers and
 * counters" analytics event protocol][0].
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/master/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} boundActions
 * @param {ext.popups.EventTracker} track
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, track ) {
	return function ( _, state ) {
		var statsv = state.statsv;

		if ( statsv.action ) {
			track( statsv.action, statsv.data );

			boundActions.statsvLogged();
		}
	};
};
