/**
 * @module trackExperimentsInteractions
 */

export function trackPopupClick() {
	if ( window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'click-on-popup'
		});
	}
}

export function trackLinkClick() {
	if ( window.pathfinderPopupsExtVariant ) {
		window.pathfinderTracking.trackPopupsExt({
			action: 'click-on-link'
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
