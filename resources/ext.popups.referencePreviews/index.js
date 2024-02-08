const isReferencePreviewsEnabled = require( './isReferencePreviewsEnabled.js' );
const { initReferencePreviewsInstrumentation } = require( './referencePreviews.js' )
const createReferenceGateway = require( './createReferenceGateway.js' )
const renderFn  = require( './createReferencePreview.js' );
const { TYPE_REFERENCE, FETCH_DELAY_REFERENCE_TYPE } = require( './constants.js' )
const setUserConfigFlags = require( './setUserConfigFlags.js' )

const REFERENCE_PREVIEWS_LOGGING_SCHEMA = 'event.ReferencePreviewsPopups';

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

mw.trackSubscribe( 'Popups.SettingChange', ( data ) => {
	if ( data.previewType === TYPE_REFERENCE ) {
		mw.track( REFERENCE_PREVIEWS_LOGGING_SCHEMA, data );
	}
} );

module.exports = referencePreviewsState !== null ? {
	type: TYPE_REFERENCE,
	selector: '#mw-content-text .reference a[ href*="#" ]',
	delay: FETCH_DELAY_REFERENCE_TYPE,
	gateway,
	renderFn,
	init: () => {
		initReferencePreviewsInstrumentation();
	}
} : null;
