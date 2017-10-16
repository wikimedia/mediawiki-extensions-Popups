// Load Popups outside the critical rendering path (T176211)
mw.requestIdleCallback( function () {
	mw.loader.using( 'ext.popups.main' );
} );
