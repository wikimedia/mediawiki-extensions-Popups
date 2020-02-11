// Load Popups outside the critical rendering path (T176211) provided that touch events
// are not available in the browser. If touch events are enabled page previews will not load.
mw.requestIdleCallback( function () {
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	if ( !isTouchDevice ) {
		mw.loader.using( 'ext.popups.main' );
	}
} );
