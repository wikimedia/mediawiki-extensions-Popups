/*global pg: false*/

// Disable NavigationPopups
// The `pg.fn.disablePopups` function exists if NavPopups is activated. If it
// exists, its called, otherwise, we do nothing.

// Since NavPopups is initialized several times, its best to disable it
// right when we are about to render the popup, from mw.popups.render.render.
// See https://phabricator.wikimedia.org/T64952#800921

// This should be happening in NavPopups itself or by disabling the gadget
// HACK: This is a temporary fix
( function ( $, mw ) {
	mw.popups.disableNavPopup = function () {
		if ( typeof pg !== 'undefined' &&
			pg.fn.disablePopups !== undefined &&
			mw.popups.enabled
		) {
			pg.fn.disablePopups();
		}
	};
}( jQuery, mediaWiki ) );
