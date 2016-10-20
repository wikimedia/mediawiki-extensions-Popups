( function ( $, mw ) {
	var previousLogData,
		// Log the popup event as defined in the schema
		// https://meta.wikimedia.org/wiki/Schema:Popups
		schemaPopups = new mw.eventLog.Schema(
			'Popups',
			mw.popups.schemaPopups.getSamplingRate(),
			mw.popups.schemaPopups.getDefaultValues()
		);

	mw.trackSubscribe( 'ext.popups.event', function ( topic, data ) {
		var shouldLog = true;

		data = mw.popups.schemaPopups.getMassagedData( data );

		// Only one action is recorded per link interaction token...
		if ( data.linkInteractionToken &&
			data.linkInteractionToken === previousLogData.linkInteractionToken ) {
			// however, the 'disabled' action takes two clicks by nature, so allow it
			if ( data.action !== 'disabled' ) {
				shouldLog = false;
			}
		}

		if ( shouldLog ) {
			schemaPopups.log( data );
		}
		previousLogData = data;
	} );
} )( jQuery, mediaWiki );
