/**
 * @module userSettings
 */

/**
 * @interface UserSettings
 *
 * @global
 */

const IS_ENABLED_KEY = 'mwe-popups-enabled',
	PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';

/**
 * Creates an object whose methods encapsulate all interactions with the UA's
 * storage.
 *
 * @param {Object} storage The `mw.storage` singleton instance
 *
 * @return {UserSettings}
 */
export default function createUserSettings( storage ) {
	return {

		/**
		 * Gets whether the user has previously enabled Page Previews.
		 *
		 * N.B. that if the user hasn't previously enabled or disabled Page
		 * Previews, i.e. userSettings.setIsEnabled(true), then they are treated as
		 * if they have enabled them.
		 *
		 * @function
		 * @name UserSettings#getIsEnabled
		 * @return {Boolean}
		 */
		getIsEnabled() {
			return storage.get( IS_ENABLED_KEY ) !== '0';
		},

		/**
		 * Sets whether the user has enabled Page Previews.
		 *
		 * @function
		 * @name UserSettings#setIsEnabled
		 * @param {Boolean} isEnabled
		 */
		setIsEnabled( isEnabled ) {
			storage.set( IS_ENABLED_KEY, isEnabled ? '1' : '0' );
		},

		/**
		 * Gets whether the user has previously enabled **or disabled** Page
		 * Previews.
		 *
		 * @function
		 * @name UserSettings#hasIsEnabled
		 * @return {Boolean}
		 */
		hasIsEnabled() {
			const value = storage.get( IS_ENABLED_KEY );

			return Boolean( value ) !== false;
		},

		/**
		 * Gets the number of previews that the user has seen.
		 *
		 * - If the storage isn't available, then -1 is returned.
		 * - If the value in storage is not a number it will override stored value
		 *   to 0
		 *
		 * @function
		 * @name UserSettings#getPreviewCount
		 * @return {Number}
		 */
		getPreviewCount() {
			const result = storage.get( PREVIEW_COUNT_KEY );

			if ( result === false ) {
				return -1;
			} else if ( result === null ) {
				return 0;
			}
			let count = parseInt( result, 10 );

			// stored number is not a zero, override it to zero and store new value
			if ( isNaN( count ) ) {
				count = 0;
				this.setPreviewCount( count );
			}
			return count;
		},

		/**
		 * Sets the number of previews that the user has seen.
		 *
		 * @function
		 * @name UserSettings#setPreviewCount
		 * @param {Number} count
		 */
		setPreviewCount( count ) {
			storage.set( PREVIEW_COUNT_KEY, count.toString() );
		}
	};
}
