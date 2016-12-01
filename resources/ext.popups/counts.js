( function ( mw ) {

	mw.popups.counts = {};

	/**
	 * Return count bucket for the number of edits a user has made.
	 *
	 * The buckets are defined as part of
	 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
	 *
	 * Extracted from `mw.popups.schemaPopups.getEditCountBucket`.
	 *
	 * @param {Number} count
	 * @return {String}
	 */
	mw.popups.counts.getEditCountBucket = function ( count ) {
		var bucket;

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

		return bucket + ' edits';
	};

}( mediaWiki ) );
