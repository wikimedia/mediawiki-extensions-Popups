import bracketedPixelRatio from './bracketedPixelRatio';

const bpr = bracketedPixelRatio();

export default {
	BRACKETED_DEVICE_PIXEL_RATIO: bpr,
	THUMBNAIL_SIZE: 320 * bpr,
	EXTRACT_LENGTH: 525
};
