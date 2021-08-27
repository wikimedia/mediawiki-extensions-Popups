/**
 * @module trackExperimentsInteractions
 */

export function trackPopupClick( user ) {
	if ( user.isAnon() && window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'click'
		});
	}
}

export function trackPopupHover( user ) {
	if ( user.isAnon() && window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'mouseover'
		});
	}
}
