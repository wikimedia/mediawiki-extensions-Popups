/**
 * @typedef {Object} ext.popups.UserSettings
 */

var IS_ENABLED_KEY = 'mwe-popups-enabled',
	PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';

/**
 * Given the global state of the application, creates an object whose methods
 * encapsulate all interactions with the given User Agent's storage.
 *
 * @param {mw.storage} storage The `mw.storage` singleton instance
 *
 * @return {ext.popups.UserSettings}
 */
module.exports = function ( storage ) {
	return {

		/**
		 * Gets whether or not the user has previously enabled Page Previews.
		 *
		 * N.B. that if the user hasn't previously enabled or disabled Page
		 * Previews, i.e. userSettings.setIsEnabled(true), then they are treated as
		 * if they have enabled them.
		 *
		 * @return {Boolean}
		 */
		getIsEnabled: function () {
			return storage.get( IS_ENABLED_KEY ) !== '0';
		},

		/**
		 * Sets whether or not the user has enabled Page Previews.
		 *
		 * @param {Boolean} isEnabled
		 */
		setIsEnabled: function ( isEnabled ) {
			storage.set( IS_ENABLED_KEY, isEnabled ? '1' : '0' );
		},

		/**
		 * Gets whether or not the user has previously enabled **or disabled**
		 * Page Previews.
		 *
		 * @return {Boolean}
		 */
		hasIsEnabled: function () {
			var value = storage.get( IS_ENABLED_KEY );

			return Boolean( value ) !== false;
		},

		/**
		 * Gets the number of Page Previews that the user has seen.
		 *
		 * If the storage isn't available, then -1 is returned.
		 *
		 * @return {Number}
		 */
		getPreviewCount: function () {
			var result = storage.get( PREVIEW_COUNT_KEY );

			if ( result === false ) {
				return -1;
			} else if ( result === null ) {
				return 0;
			}

			return parseInt( result, 10 );
		},

		/**
		 * Sets the number of Page Previews that the user has seen.
		 *
		 * @param {Number} count
		 */
		setPreviewCount: function ( count ) {
			storage.set( PREVIEW_COUNT_KEY, count.toString() );
		}
	};
};
