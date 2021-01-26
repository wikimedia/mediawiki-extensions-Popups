import bracketedPixelRatio from './bracketedPixelRatio';

const bpr = bracketedPixelRatio();

export default {
	BRACKETED_DEVICE_PIXEL_RATIO: bpr,
	// See https://phabricator.wikimedia.org/T272169: requesting a larger thumbnail to avoid bluriness
	THUMBNAIL_SIZE: 320 * Math.max( bpr, 1.5 ),
	EXTRACT_LENGTH: 525
};
