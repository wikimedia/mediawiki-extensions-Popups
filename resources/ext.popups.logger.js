( function ( $, mw ) {

	/**
	 * @class mw.popups.logger
	 * @singleton
	 */
	var logger = {};

	/**
	 * Unix timestamp of when the popup was rendered
	 * @property time
	 */
	logger.time = undefined;

	/**
	 * How long was the popup open in milliseconds
	 * @property {Number} duration
	 */
	logger.duration = undefined;

	/**
	 * Was the popup clicked, middle clicked or dismissed
	 * @property {String} action
	 */
	logger.action = undefined;

	/**
	 * Logs different actions such as meta and shift click on the popup
	 * Is bound to the `click` event
	 *
	 * @method logClick
	 * @param {Object} event
	 */
	logger.logClick = function ( event ) {
		if ( event.which === 2 ) { // middle click
			logger.action = 'opened in new tab';
		} else if ( event.which === 1 ) {
			if ( event.ctrlKey || event.metaKey ) {
				logger.action = 'opened in new tab';
			} else if ( event.shiftKey ) {
				logger.action = 'opened in new window';
			} else {
				logger.action = 'opened in same tab';
				logger.duration = mw.now() - logger.time;
				logger.log( mw.popups.render.currentLink.attr( 'href' ) );
				event.preventDefault();
			}
		}
	};

	/**
	 * Logs the popup event as defined in the following schema-
	 * https://meta.wikimedia.org/wiki/Schema:Popups
	 * If `href` is passed it redirects to that location after the event is logged.
	 *
	 * @method log
	 * @param {String} href
	 * @return {Boolean} logged Whether or not the event was logged
	 */
	logger.log = function ( href ) {
		if ( mw.eventLog === undefined ) {
			return false;
		}

		var
			deferred = $.Deferred(),
			event = {
				'duration': Math.round( logger.duration ),
				'action': logger.action
			};

		if ( logger.sessionId !== null ) {
			event.sessionId = logger.sessionId;
		}

		if ( href ) {
			deferred.always( function () {
				location.href = href;
			} );
		}

		mw.eventLog.logEvent( 'Popups', event ).then( deferred.resolve, deferred.reject );

		// reset
		logger.time = undefined;
		logger.duration = undefined;
		logger.action = undefined;

		return true;
	};

	/**
	 * Generates a unique sessionId or pulls an existing one from localStorage
	 *
	 * @method getSessionsId
	 * @return {String} sessionId
	 */
	logger.getSessionId = function () {
		var sessionId = null;
		try {
			sessionId = localStorage.getItem( 'popupsSessionId' );
			if ( sessionId === null ) {
				sessionId = mw.user.generateRandomSessionId();
				localStorage.setItem( 'popupsSessionId', sessionId );
			}
		} catch ( e ) {}
		return sessionId;
	};

	/**
	 * @property sessionId
	 */
	logger.sessionId = logger.getSessionId();

	mw.popups.logger = logger;

} ) ( jQuery, mediaWiki );
