import bracketedPixelRatio from './bracketedPixelRatio';

const bpr = bracketedPixelRatio();

// See the following for context around this value.
//
// * https://phabricator.wikimedia.org/T161284
// * https://phabricator.wikimedia.org/T70861#3129780
export const FETCH_START_DELAY = 150; // ms.
// The delay after which a FETCH_COMPLETE action should be dispatched.
//
// If the API endpoint responds faster than 350 ms (or, say, the API
// response is served from the UA's cache), then we introduce a delay of
// 350 ms - t to make the preview delay consistent to the user. The total
// delay from start to finish is 500 ms.
export const FETCH_COMPLETE_TARGET_DELAY = 350 + FETCH_START_DELAY; // ms.
// The minimum time a preview must be open before we judge it
// has been seen.
// See https://phabricator.wikimedia.org/T184793
export const PREVIEW_SEEN_DURATION = 1000; // ms
export const ABANDON_END_DELAY = 300;

//
// Reference previews specific config
//
export const FETCH_DELAY_REFERENCE_TYPE = 150; // ms.

export default {
	BRACKETED_DEVICE_PIXEL_RATIO: bpr,
	// See https://phabricator.wikimedia.org/T272169: requesting a larger thumbnail to avoid bluriness
	THUMBNAIL_SIZE: 320 * Math.max( bpr, 1.5 ),
	EXTRACT_LENGTH: 525
};
