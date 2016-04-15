( function ( $, mw ) {

	/**
	 * @class mw.popups.logger
	 * @singleton
	 */
	var logger = {};

	/**
	 * Sampling rate at which events are logged
	 * @property samplingRate
	 */
	logger.samplingRate = 10;

	/**
	 * Get action based on click event
	 *
	 * @method getAction
	 * @param {Object} event
	 * @return {string}
	 */
	logger.getAction = function ( event ) {
		if ( event.which === 2 ) { // middle click
			return 'opened in new tab';
		} else if ( event.which === 1 ) {
			if ( event.ctrlKey || event.metaKey ) {
				return 'opened in new tab';
			} else if ( event.shiftKey ) {
				return 'opened in new window';
			} else {
				return 'opened in same tab';
			}
		}
	};

	/**
	 * Logs the popup event as defined in the following schema-
	 * https://meta.wikimedia.org/wiki/Schema:Popups
	 *
	 * @method log
	 * @param {Object} event
	 * @return {jQuery.Promise}
	 */
	logger.log = function ( event ) {
		if (
			mw.eventLog === undefined ||
			Math.floor( Math.random() * logger.samplingRate ) !== 0
		) {
			return $.Deferred().resolve();
		}

		// Get duration from  time
		if ( $.isNumeric( event.time ) ) {
			event.duration = Math.floor( mw.now() - event.time );
			// FIXME: the time property should not be sent to the back-end regardless of its value.
			delete event.time;
		}

		return mw.eventLog.logEvent( 'Popups', event );
	};

	mw.popups.logger = logger;

} )( jQuery, mediaWiki );
