let isTracking = false;

export const LOGGING_SCHEMA = 'event.ReferencePreviewsPopups';

/**
 * Run once the preview is initialized.
 */
export function initReferencePreviewsInstrumentation() {
	if ( mw.config.get( 'wgPopupsReferencePreviews' ) &&
		navigator.sendBeacon &&
		mw.config.get( 'wgIsArticle' ) &&
		!isTracking
	) {
		isTracking = true;
		mw.track( LOGGING_SCHEMA, { action: 'pageview' } );
	}
}

export function isTrackingEnabled() {
	return isTracking;
}
