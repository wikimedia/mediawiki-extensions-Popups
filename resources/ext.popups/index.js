const types = require( './types.json' );
// Load Popups when touch events are not available in the browser (e.g. not a mobile device).
const isTouchDevice = 'ontouchstart' in document.documentElement;
let supportNotQueries;
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
			const module = require( moduleName );
			// Check the module exists. A module can export undefined or null if
			// it does not want to be registered (for example where registration may
			// depend on something that can only be checked at runtime.
			// For example the Math module shouldn't register itself if there are no Math
			// equations on the page.
			if ( module ) {
				mw.popups.register( module );
			}
		} );
		// For now this API is limited to extensions/skins as we have not had a chance to
		// consider the implications of gadgets having access to this function and dealing with
		// challenges such as selector overlap.
		delete mw.popups.register;
	} );
}
