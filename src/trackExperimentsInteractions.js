/**
 * @module trackExperimentsInteractions
 */

export function trackPopupClick() {
	if ( window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'click'
		});
	}
}

export function trackPopupHover() {
	if ( window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'mouseover'
		});
	}
}
