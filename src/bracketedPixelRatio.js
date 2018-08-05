/**
 * @module bracketedPixelRatio
 */

/**
 * Normalizes a user's device pixel ratio to either 1, 1.5, or 2.
 *
 * This is important when the server resizes images on the fly in order to
 * reduce the work it has to do for device pixel ratios that deviate from a
 * set of common ratios.
 *
 * Adapted from mediawiki/core /resources/src/jquery/jquery.hidpi.js
 *
 * @param {number} [dpr=window.devicePixelRatio]
 * @return {number} The bracketed device pixel ratio
 */
export default function ( dpr = window.devicePixelRatio ) {
	if ( !dpr ) {
		// Probably legacy browser so assume 1
		return 1;
	}

	if ( dpr > 1.5 ) {
		return 2;
	}

	if ( dpr > 1 ) {
		return 1.5;
	}

	return 1;
}
