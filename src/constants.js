/**
 * @module constants
 */
const $ = jQuery,
	// If bracketedDevicePixelRatio is not available default to 1 (in tests for
	// example)
	pixelRatio = $.bracketedDevicePixelRatio &&
		$.bracketedDevicePixelRatio() || 1,
	BUCKETS = {
		off: 'off',
		on: 'on',
		control: 'control'
	};

export { BUCKETS };

export default {
	THUMBNAIL_SIZE: 320 * pixelRatio,
	EXTRACT_LENGTH: 525
};
