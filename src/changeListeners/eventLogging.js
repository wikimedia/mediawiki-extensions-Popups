/**
 * @module changeListeners/eventLogging
 */

var $ = jQuery;

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
 * @return {ext.popups.ChangeListener}
 */
export default function eventLogging( boundActions, eventLoggingTracker ) {
	return function ( _, state ) {
		var eventLogging = state.eventLogging,
			event = eventLogging.event;

		if ( !event ) {
			return;
		}

		event = $.extend( true, {}, eventLogging.baseData, event );
		eventLoggingTracker( 'event.Popups', event );
		// Dispatch the eventLogged action so that the state tree can be
		// cleared/updated.
		boundActions.eventLogged( event );
	};
}
