/**
 * @module counts
 */

/**
 * Gets the count bucket for the number of edits a user has made.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.schemaPopups.getEditCountBucket`.
 *
 * @param {Number} count
 * @return {String}
 */
exports.getEditCountBucket = function getEditCountBucket( count ) {
	let bucket;

	if ( count === 0 ) {
		bucket = '0';
	} else if ( count >= 1 && count <= 4 ) {
		bucket = '1-4';
	} else if ( count >= 5 && count <= 99 ) {
		bucket = '5-99';
	} else if ( count >= 100 && count <= 999 ) {
		bucket = '100-999';
	} else if ( count >= 1000 ) {
		bucket = '1000+';
	}

	return `${ bucket } edits`;
};

/**
 * Gets the count bucket for the number of previews a user has seen.
 *
 * If local storage isn't available - because the user has disabled it
 * or the browser doesn't support it - then then "unknown" is returned.
 *
 * The buckets are defined as part of
 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
 *
 * Extracted from `mw.popups.getPreviewCountBucket`.
 *
 * @param {Number} count
 * @return {String}
 */
exports.getPreviewCountBucket = function getPreviewCountBucket( count ) {
	let bucket;

	if ( count === 0 ) {
		bucket = '0';
	} else if ( count >= 1 && count <= 4 ) {
		bucket = '1-4';
	} else if ( count >= 5 && count <= 20 ) {
		bucket = '5-20';
	} else if ( count >= 21 ) {
		bucket = '21+';
	}

	return bucket !== undefined ? ( `${ bucket } previews` ) : 'unknown';
};
