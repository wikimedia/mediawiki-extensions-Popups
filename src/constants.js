/**
 * @module constants
 */
var $ = jQuery,
	// If bracketedDevicePixelRatio is not available default to 1 (in tests for
	// example)
	pixelRatio = $.bracketedDevicePixelRatio && $.bracketedDevicePixelRatio() || 1;

export default {
	THUMBNAIL_SIZE: 300 * pixelRatio,
	EXTRACT_LENGTH: 525
};
