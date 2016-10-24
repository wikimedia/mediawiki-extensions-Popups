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
		data = mw.popups.schemaPopups.getMassagedData( data, previousLogData );

		if ( data ) {
			schemaPopups.log( data );
		}
		previousLogData = data;
	} );
} )( jQuery, mediaWiki );
