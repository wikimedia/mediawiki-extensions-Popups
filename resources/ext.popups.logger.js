( function ( $, mw ) {

	/**
	 * @class mw.popups.logger
	 * @singleton
	 */
	var logger = {};

	/**
	 * Get action based on click event
	 *
	 * @method getAction
	 * @param {Object} event
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
		if ( mw.eventLog === undefined ) {
			return $.Deferred().resolve();
		}

		// Get duration from  time
		if ( $.isNumeric( event.time ) ) {
			event.duration = Math.floor( mw.now() - event.time );
			delete event.time;
		}

		return  mw.eventLog.logEvent( 'Popups', event );
	};

	mw.popups.logger = logger;

} ) ( jQuery, mediaWiki );
