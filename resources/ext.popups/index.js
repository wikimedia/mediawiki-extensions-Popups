var types = require( './types.json' );
// Load Popups when touch events are not available in the browser (e.g. not a mobile device).
var isTouchDevice = 'ontouchstart' in document.documentElement;
var supportNotQueries;
try {
	supportNotQueries = document.body.matches( 'div:not(.foo,.bar)' );
	supportNotQueries = true;
} catch ( e ) {
	supportNotQueries = false;
}
if ( !isTouchDevice && supportNotQueries ) {
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
