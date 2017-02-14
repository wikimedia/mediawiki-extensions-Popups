var $ = jQuery;

/**
 * Creates an instance of the event logging change listener.
 *
 * When an event is enqueued to be logged it'll be logged using the schema.
 * Since it's the responsibility of EventLogging (and the UA) to deliver
 * logged events, the `EVENT_LOGGED` is immediately dispatched rather than
 * waiting for some indicator of completion.
 *
 * @param {Object} boundActions
 * @param {mw.eventLog.Schema} schema
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, schema ) {
	return function ( _, state ) {
		var eventLogging = state.eventLogging,
			event = eventLogging.event;

		if ( event ) {
			schema.log( $.extend( true, {}, eventLogging.baseData, event ) );

			boundActions.eventLogged();
		}
	};
};
