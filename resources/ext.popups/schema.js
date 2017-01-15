( function ( mw, $ ) {

	/**
	 * Creates an instance of an EventLogging schema that can be used to log
	 * Popups events.
	 *
	 * @param {mw.Map} config
	 * @param {Window} window
	 * @return {mw.eventLog.Schema}
	 */
	mw.popups.createSchema = function ( config, window ) {
		var samplingRate = config.get( 'wgPopupsSchemaSamplingRate', 0 );

		if (
			!window.navigator ||
			!$.isFunction( window.navigator.sendBeacon ) ||
			window.QUnit
		) {
			samplingRate = 0;
		}

		return new mw.eventLog.Schema( 'Popups', samplingRate );
	};

}( mediaWiki, jQuery ) );
