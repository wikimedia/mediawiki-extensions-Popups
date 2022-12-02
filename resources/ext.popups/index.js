var types = require( './types.json' );
// Load Popups outside the critical rendering path (T176211) provided that touch events
// are not available in the browser. If touch events are enabled page previews will not load.
mw.requestIdleCallback( function () {
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	if ( !isTouchDevice ) {
		mw.loader.using( types.concat( [ 'ext.popups.main' ] ) ).then( function () {
			// Load custom popup types
			types.forEach( function ( moduleName ) {
				var module = require( moduleName );
				mw.popups.register( module );
			} );
			// For now this API is limited to extensions/skins as we have not had a chance to
			// consider the implications of gadgets having access to this function and dealing with
			// challenges such as selector overlap.
			delete mw.popups.register;
		} );
	}
} );
