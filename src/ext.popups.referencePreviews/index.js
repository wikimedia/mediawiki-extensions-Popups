import isReferencePreviewsEnabled from './isReferencePreviewsEnabled';
import { initReferencePreviewsInstrumentation } from './referencePreviews';
import createReferenceGateway from './createReferenceGateway';
import renderFn from './createReferencePreview';
import { TYPE_REFERENCE, FETCH_DELAY_REFERENCE_TYPE } from './constants';
import setUserConfigFlags from './setUserConfigFlags';

setUserConfigFlags( mw.config );
const referencePreviewsState = isReferencePreviewsEnabled(
	mw.user, mw.popups.isEnabled,
	mw.config
);
const gateway = createReferenceGateway();

// For tracking baseline stats in the Cite extension https://phabricator.wikimedia.org/T353798
// FIXME: This might be obsolete when the code moves to the Cite extension and the tracking there
//  can check that state differently.
mw.config.set( 'wgPopupsReferencePreviewsVisible', !!referencePreviewsState );

window.refPreviews = referencePreviewsState !== null ? {
	type: TYPE_REFERENCE,
	selector: '#mw-content-text .reference a[ href*="#" ]',
	delay: FETCH_DELAY_REFERENCE_TYPE,
	gateway,
	renderFn,
	init: () => {
		initReferencePreviewsInstrumentation();
	}
} : null;
