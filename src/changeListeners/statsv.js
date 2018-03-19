/**
 * Creates an instance of the statsv change listener.
 *
 * The listener will log events to StatsD via the [the "StatsD timers and
 * counters" analytics event protocol][0].
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/29c864a0/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} boundActions
 * @param {EventTracker} track
 * @return {ext.popups.ChangeListener}
 */
export default function statsv( boundActions, track ) {
	return ( _, state ) => {
		const statsv = state.statsv;

		if ( statsv.action ) {
			track( statsv.action, statsv.data );

			boundActions.statsvLogged();
		}
	};
}
