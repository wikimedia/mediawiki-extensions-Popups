/*global disablePopups: false*/

// Disable NavigationPopups
// The `disablePopups` function exists if NavPopups is activated. If it
// exists, its called, otherwise, we do nothing.

// This should be happening in NavPopups itself or by disabling the gadget
// This is a temporary fix
( function ( $, mw ) {
	$( function () {
		if ( typeof disablePopups !== 'undefined' && mw.popups.enabled ) {
			disablePopups();
		}
	} );
} ( jQuery, mediaWiki ) );
