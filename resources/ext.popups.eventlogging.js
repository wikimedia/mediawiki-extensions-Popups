( function ( $, mw ) {

	/**
	 * @class mw.popups.eventLogging
	 * @singleton
	 */
	var eventLogging = {};

	/**
	 * Unix timestamp of when the popup was rendered
	 * @property time
	 */
	eventLogging.time = undefined;

	/**
	 * How long was the popup open in milliseconds
	 * @property {Number} duration
	 */
	eventLogging.duration = undefined;

	/**
	 * Was the popup clicked, middle clicked or dismissed
	 * @property {String} action
	 */
	eventLogging.action = undefined;

	/**
	 * Logs different actions such as meta and shift click on the popup
	 * Is bound to the `click` event
	 *
	 * @method logClick
	 * @param {Object} event
	 */
	eventLogging.logClick = function ( event ) {
		if ( event.which === 2 ) { // middle click
			eventLogging.action = 'opened in new tab';
		} else if ( event.which === 1 ) {
			if ( event.ctrlKey || event.metaKey ) {
				eventLogging.action = 'opened in new tab';
			} else if ( event.shiftKey ) {
				eventLogging.action = 'opened in new window';
			} else {
				eventLogging.action = 'opened in same tab';
				eventLogging.duration = mw.now() - eventLogging.time;
				eventLogging.logEvent( mw.popups.render.currentLink.attr( 'href' ) );
				event.preventDefault();
			}
		}
		return false;
	};

	/**
	 * Logs the popup event as defined in the following schema-
	 * https://meta.wikimedia.org/wiki/Schema:Popups
	 * If `href` is passed it redirects to that location after the event is logged.
	 *
	 * @method logEvent
	 * @param {String} href
	 */
	eventLogging.logEvent = function ( href ) {
		var
			deferred = $.Deferred(),
			event = {
				'duration': Math.round( eventLogging.duration ),
				'action': eventLogging.action
			};

		if ( eventLogging.sessionId !== null ) {
			event.sessionId = eventLogging.sessionId;
		}

		if ( href ) {
			deferred.always( function () {
				location.href = href;
			} );
		}

		mw.eventLog.logEvent( 'Popups', event ).then( deferred.resolve, deferred.reject );

		// reset
		eventLogging.time = undefined;
		eventLogging.duration = undefined;
		eventLogging.action = undefined;
	};

	/**
	 * Generates a unique sessionId or pulls an existing one from localStorage
	 *
	 * @method getSessionsId
	 * @return {String} sessionId
	 */
	eventLogging.getSessionId = function () {
		var sessionId = null;
		try {
			sessionId = localStorage.getItem( 'popupsSessionId' );
			if ( sessionId === null ) {
				sessionId = mw.user.getRandomSessionId();
				localStorage.setItem( 'popupsSessionId', sessionId );
			}
		} catch ( e ) {}
		return sessionId;
	};

	/**
	 * @property sessionId
	 */
	eventLogging.sessionId = eventLogging.getSessionId();

	mw.popups.eventLogging = eventLogging;

} ) ( jQuery, mediaWiki );
