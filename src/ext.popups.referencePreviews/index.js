import isReferencePreviewsEnabled from './isReferencePreviewsEnabled';
import { initReferencePreviewsInstrumentation } from './referencePreviews';
import createReferenceGateway from './createReferenceGateway';
import renderFn from './createReferencePreview';
import { TYPE_REFERENCE, FETCH_DELAY_REFERENCE_TYPE } from './constants';
import createUserSettings from '../userSettings';
import setUserConfigFlags from './setUserConfigFlags';

setUserConfigFlags( mw.config );
const userSettings = createUserSettings( mw.storage );
const referencePreviewsState = isReferencePreviewsEnabled( mw.user, userSettings, mw.config );
const gateway = createReferenceGateway();

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
