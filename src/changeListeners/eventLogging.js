var $ = jQuery;

/**
 * Hashes the string using the 32-bit FNV-1a algorithm.
 *
 * @see http://isthe.com/chongo/tech/comp/fnv/#FNV-1a
 * @see http://isthe.com/chongo/tech/comp/fnv/#FNV-param
 *
 * @param {String} string
 * @return {Number} A 32-bit unsigned integer
 */
function fnv1a32( string ) {
	/* eslint-disable no-bitwise */

	var result = 2166136261, // Offset basis.
		i = 0;

	for ( i = 0; i < string.length; ++i ) {
		result ^= string.charCodeAt( i );
		result *= 16777619; // Prime.
	}

	return result >>> 0;
	/* eslint-enable no-bitwise */
}

/**
 * Creates an instance of the event logging change listener.
 *
 * When an event is enqueued it'll be logged using the schema. Since it's the
 * responsibility of Event Logging (and the UA) to deliver logged events,
 * `EVENT_LOGGED` is immediately dispatched rather than waiting for some
 * indicator of completion.
 *
 * This change listener also stores hashes of all enqueued events. If a
 * duplicate event is queued - there's a hash collision - then the
 * `PagePreviews.EventLogging.DuplicateEvent` counter is incremented via [the
 * "StatsD timers and counters" analytics event protocol][0].
 *
 * See the following for additional context:
 *
 * * https://phabricator.wikimedia.org/T161769
 * * https://phabricator.wikimedia.org/T163198
 *
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/master/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} boundActions
 * @param {mw.eventLog.Schema} schema
 * @param {ext.popups.EventTracker} track
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, schema, track ) {
	var tokenToSeenMap = {},
		hashToSeenMap = {};

	return function ( _, state ) {
		var eventLogging = state.eventLogging,
			event = eventLogging.event,
			token,
			hash,
			shouldLog = true;

		if ( !event ) {
			return;
		}

		token = event.linkInteractionToken;

		if ( tokenToSeenMap[ token ] === true ) {
			track( 'counter.PagePreviews.EventLogging.DuplicateToken', 1 );

			shouldLog = false;
		}

		tokenToSeenMap[ token ] = true;

		// Use 32-bit FNV-1a based on Ian Boyd's (incredibly detailed) analysis of
		// several algorithms designed to quickly hash a string
		// <https://softwareengineering.stackexchange.com/a/145633>.
		//
		// ...
		//
		// It's also remarkably easy to implement!!1
		hash = fnv1a32( JSON.stringify( event ) ).toString( 16 );

		// Has the event been seen before?
		if ( hashToSeenMap[ hash ] === true ) {
			track( 'counter.PagePreviews.EventLogging.DuplicateEvent', 1 );

			shouldLog = false;
		}

		hashToSeenMap[ hash ] = true;

		event = $.extend( true, {}, eventLogging.baseData, event );

		if ( shouldLog ) {
			schema.log( event );
		}

		// Dispatch the eventLogged action even if it was a duplicate so that the
		// state tree can be cleared/updated.
		boundActions.eventLogged( event );
	};
};
