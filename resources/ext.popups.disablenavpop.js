/*global disablePopups: false */

// Disable NavigationPopups
// This should be happening in NavPopups itself or by disabling the gadget
// This is a temporary fix
( function ( $ ) {
	$( function () {
		if ( typeof disablePopups !== 'undefined' ) {
			disablePopups();
		}
	} );
} ( jQuery ) );
