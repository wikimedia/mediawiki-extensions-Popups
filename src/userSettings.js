/**
 * @module userSettings
 */

/**
 * @interface UserSettings
 *
 * @global
 */

const PAGE_PREVIEWS_ENABLED_KEY = 'mwe-popups-enabled',
	REFERENCE_PREVIEWS_ENABLED_KEY = 'mwe-popups-referencePreviews-enabled',
	REFERENCE_PREVIEWS_LOGGING_SCHEMA = 'event.ReferencePreviewsPopups';

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
		 * @method
		 * @name UserSettings#isReferencePreviewsEnabled
		 * @return {boolean}
		 */
		isReferencePreviewsEnabled() {
			return storage.get( REFERENCE_PREVIEWS_ENABLED_KEY ) !== '0';
		},

		/**
		 * @method
		 * @name UserSettings#storeReferencePreviewsEnabled
		 * @param {boolean} enabled
		 */
		storeReferencePreviewsEnabled( enabled ) {
			if ( enabled ) {
				storage.remove( REFERENCE_PREVIEWS_ENABLED_KEY );
			} else {
				storage.set( REFERENCE_PREVIEWS_ENABLED_KEY, '0' );
			}

			mw.track( REFERENCE_PREVIEWS_LOGGING_SCHEMA, {
				action: enabled ? 'anonymousEnabled' : 'anonymousDisabled'
			} );
		}
	};
}
