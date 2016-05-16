( function ( $, mw ) {
	var schemaPopups,
		defaults;

	/**
	 * Return the sampling rate for the Schema:Popups
	 *
	 * The sampling rate is always 0 if the browser doesn't support
	 * `navigator.sendBeacon`.
	 *
	 * @return {number}
	 */
	function getSamplingRate() {
		return $.isFunction( navigator.sendBeacon ) ?
			mw.config.get( 'wgPopupsSchemaPopupsSamplingRate', 0 ) : 0;
	}

	/**
	 * Return edit count bucket based on the number of edits
	 *
	 * @return {string}
	 */
	function getEditCountBucket( editCount ) {
		var bucket;

		if ( editCount === 0 ) {
			bucket = '0';
		} else if ( editCount >= 1 && editCount <= 4 ) {
			bucket = '1-4';
		} else if ( editCount >= 5 && editCount <= 99 ) {
			bucket = '5-99';
		} else if ( editCount >= 100 && editCount <= 999 ) {
			bucket = '100-999';
		} else if ( editCount >= 1000 ) {
			bucket = '1000+';
		}

		return bucket + ' edits';
	}

	// Data that will be logged with each EL request
	defaults = {
		pageTitleSource: mw.config.get( 'wgPageName' ),
		namespaceIdSource: mw.config.get( 'wgNamespaceNumber' ),
		pageIdSource: mw.config.get( 'wgArticleId' ),
		isAnon: mw.user.isAnon()
	};

	// Include edit count bucket if the user is logged in.
	if ( !mw.user.isAnon() ) {
		defaults.editCountBucket = getEditCountBucket( mw.config.get( 'wgUserEditCount' ) );
	}

	// Log the popup event as defined in the schema
	// https://meta.wikimedia.org/wiki/Schema:Popups
	schemaPopups = new mw.eventLog.Schema(
		'Popups',
		getSamplingRate(),
		defaults
	);

	mw.trackSubscribe( 'ext.popups.schemaPopups', function ( topic, data ) {
		schemaPopups.log( data );
	} );

} )( jQuery, mediaWiki );
