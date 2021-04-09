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
	return ( oldState, newState ) => {
		const statsvObj = newState.statsv;

		if ( statsvObj.action ) {
			track( statsvObj.action, statsvObj.data );

			boundActions.statsvLogged();
		}
	};
}
