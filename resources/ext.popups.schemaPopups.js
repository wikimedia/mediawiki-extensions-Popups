( function ( $, mw ) {
	/**
	 * Log the popup event as defined in the schema
	 *
	 * https://meta.wikimedia.org/wiki/Schema:Popups
	 */
	var schemaPopups = new mw.eventLog.Schema(
		'Popups',
		mw.config.get( 'wgPopupsSchemaPopupsSamplingRate', 0 )
	);

	mw.trackSubscribe( 'ext.popups.schemaPopups', function ( topic, data ) {
		schemaPopups.log( data );
	} );
} )( jQuery, mediaWiki );
