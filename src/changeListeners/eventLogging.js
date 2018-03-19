/**
 * @module changeListeners/eventLogging
 */

const $ = jQuery;

/**
 * Creates an instance of the event logging change listener.
 *
 * When an event is enqueued it'll be logged using the schema. Since it's the
 * responsibility of Event Logging (and the UA) to deliver logged events,
 * `EVENT_LOGGED` is immediately dispatched rather than waiting for some
 * indicator of completion.
 *
 * @param {Object} boundActions
 * @param {EventTracker} eventLoggingTracker
 * @param {Function} getCurrentTimestamp
 * @return {ext.popups.ChangeListener}
 */
export default function eventLogging(
	boundActions, eventLoggingTracker, getCurrentTimestamp
) {
	return ( _, state ) => {
		const eventLogging = state.eventLogging;
		let event = eventLogging.event;

		if ( !event ) {
			return;
		}

		// Per https://meta.wikimedia.org/wiki/Schema:Popups, the timestamp
		// property should be the time at which the event is logged and not the
		// time at which the interaction started.
		//
		// Rightly or wrongly, it's left as an exercise for the analyst to
		// calculate the time at which the interaction started as part of their
		// analyses, e.g. https://phabricator.wikimedia.org/T186016#4002923.
		event = $.extend( true, {}, eventLogging.baseData, event, {
			timestamp: getCurrentTimestamp()
		} );

		eventLoggingTracker( 'event.Popups', event );
		// Dispatch the eventLogged action so that the state tree can be
		// cleared/updated.
		boundActions.eventLogged( event );
	};
}
