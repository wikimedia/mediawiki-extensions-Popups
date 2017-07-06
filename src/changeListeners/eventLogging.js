/**
 * @module changeListeners/eventLogging
 */

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
 * Check if event is an interaction event
 *
 * @param {Object} event Event
 * @returns {boolean}
 */
function isInteractionEvent( event ) {
	return event.linkInteractionToken !== undefined;
}

/**
 * Check if token was already used
 *
 * @param {Object} seenMap Map of known tokens
 * @param {String} token Token
 * @returns {boolean}
 */
function isDuplicateToken( seenMap, token ) {
	// Tokens without link interaction token are not tracked
	if ( token === undefined ) {
		return false;
	}
	// Has the event been seen before?
	if ( seenMap[ token ] === true ) {
		return true;
	}
	seenMap[ token ] = true;
	return false;
}

/**
 * Check if event is known
 *
 * @param {Object} seenMap Hash map of known events
 * @param {Object} event event
 * @returns {boolean}
 */
function isDuplicateEvent( seenMap, event ) {
	// Use 32-bit FNV-1a based on Ian Boyd's (incredibly detailed) analysis of
	// several algorithms designed to quickly hash a string
	// <https://softwareengineering.stackexchange.com/a/145633>.
	//
	// ...
	//
	// It's also remarkably easy to implement!
	var hash = fnv1a32( JSON.stringify( event ) ).toString( 32 );

	// Has the event been seen before?
	if ( seenMap[ hash ] === true ) {
		return true;
	}

	seenMap[ hash ] = true;
	return false;
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
 * [0]: https://github.com/wikimedia/mediawiki-extensions-WikimediaEvents/blob/29c864a0/modules/ext.wikimediaEvents.statsd.js
 *
 * @param {Object} boundActions
 * @param {EventTracker} eventLoggingTracker
 * @param {EventTracker} statsvTracker
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, eventLoggingTracker, statsvTracker ) {
	var tokenToSeenMap = {},
		hashToSeenMap = {};

	return function ( _, state ) {
		var eventLogging = state.eventLogging,
			event = eventLogging.event,
			shouldLog = true;

		if ( !event ) {
			return;
		}

		// We log duplicates only for interaction events
		if ( isInteractionEvent( event ) ) {
			if ( isDuplicateToken( tokenToSeenMap, event.linkInteractionToken ) ) {
				shouldLog = false;
				statsvTracker( 'counter.PagePreviews.EventLogging.DuplicateToken', 1 );
			}
			if ( isDuplicateEvent( hashToSeenMap, event ) ) {
				statsvTracker( 'counter.PagePreviews.EventLogging.DuplicateEvent', 1 );
			}
		}

		event = $.extend( true, {}, eventLogging.baseData, event );
		if ( shouldLog ) {
			eventLoggingTracker( 'event.Popups', event );
		}
		// Dispatch the eventLogged action even if it was a duplicate so that the
		// state tree can be cleared/updated.
		boundActions.eventLogged( event );
	};
};
