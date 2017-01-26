( function ( mw ) {
	mw.popups.changeListeners = {
		footerLink: require( './footerLink' ),
		eventLogging: require( './eventLogging' ),
		linkTitle: require( './linkTitle' ),
		render: require( './render' ),
		settings: require( './settings' ),
		syncUserSettings: require( './syncUserSettings' )
	};
}( mediaWiki ) );
