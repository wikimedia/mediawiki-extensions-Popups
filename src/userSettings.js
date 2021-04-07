/**
 * @module userSettings
 */

/**
 * @interface UserSettings
 *
 * @global
 */

const PAGE_PREVIEWS_ENABLED_KEY = 'mwe-popups-enabled',
	PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';

/**
 * Creates an object whose methods encapsulate all interactions with the UA's
 * storage.
 *
 * @param {mw.storage} storage The `mw.storage` singleton instance
 *
 * @return {UserSettings}
 */
export default function createUserSettings( storage ) {
	return {
		/**
		 * Gets whether the user has previously enabled Page Previews.
		 *
		 * N.B. that if the user hasn't previously enabled or disabled Page
		 * Previews, i.e. userSettings.storePagePreviewsEnabled(true), then they are treated as
		 * if they have enabled them.
		 *
		 * @method
		 * @name UserSettings#isPagePreviewsEnabled
		 * @return {boolean}
		 */
		isPagePreviewsEnabled() {
			return storage.get( PAGE_PREVIEWS_ENABLED_KEY ) !== '0';
		},

		/**
		 * Permanently persists (typically in localStorage) whether the user has enabled Page
		 * Previews.
		 *
		 * @method
		 * @name UserSettings#storePagePreviewsEnabled
		 * @param {boolean} enabled
		 */
		storePagePreviewsEnabled( enabled ) {
			if ( enabled ) {
				storage.remove( PAGE_PREVIEWS_ENABLED_KEY );
			} else {
				storage.set( PAGE_PREVIEWS_ENABLED_KEY, '0' );
			}
		},

		/**
		 * Gets the number of previews that the user has seen.
		 *
		 * - If the storage isn't available, then -1 is returned.
		 * - If the value in storage is not a number it will override stored value
		 *   to 0
		 *
		 * @method
		 * @name UserSettings#getPreviewCount
		 * @return {number}
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
				this.storePreviewCount( count );
			}
			return count;
		},

		/**
		 * Sets the number of previews that the user has seen.
		 *
		 * @method
		 * @name UserSettings#storePreviewCount
		 * @param {number} count
		 */
		storePreviewCount( count ) {
			storage.set( PREVIEW_COUNT_KEY, count.toString() );
		}
	};
}
