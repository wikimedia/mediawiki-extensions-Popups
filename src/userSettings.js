import { previewTypes } from './preview/model';
import { TYPE_REFERENCE } from './ext.popups.referencePreviews/constants.js';

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
		migrateOldPreferences() {
			const isDisabled = !!storage.get( PAGE_PREVIEWS_ENABLED_KEY );
			if ( isDisabled ) {
				storage.remove( PAGE_PREVIEWS_ENABLED_KEY );
				this.storePreviewTypeEnabled( previewTypes.TYPE_PAGE, false );
			}
			const isRefsDisabled = !!storage.get( REFERENCE_PREVIEWS_ENABLED_KEY );
			if ( isRefsDisabled ) {
				storage.remove( REFERENCE_PREVIEWS_ENABLED_KEY );
				this.storePreviewTypeEnabled( TYPE_REFERENCE, false );
			}
		},
		/**
		 * Check whether the preview type is enabled.
		 *
		 * @method
		 * @param {string} previewType
		 *
		 * @return {boolean}
		 */
		isPreviewTypeEnabled( previewType ) {
			const storageKey = `mwe-popups-${ previewType }-enabled`;
			const value = storage.get( storageKey );
			return value === null;
		},

		/**
		 * Permanently persists (typically in localStorage) whether the user has enabled
		 * the preview type.
		 *
		 * @method
		 * @name UserSettings#storePreviewTypeEnabled
		 * @param {string} previewType
		 * @param {boolean} enabled
		 */
		storePreviewTypeEnabled( previewType, enabled ) {
			if ( previewType === TYPE_REFERENCE ) {
				mw.track( REFERENCE_PREVIEWS_LOGGING_SCHEMA, {
					action: enabled ? 'anonymousEnabled' : 'anonymousDisabled'
				} );
			}
			const storageKey = `mwe-popups-${ previewType }-enabled`;
			if ( enabled ) {
				storage.remove( storageKey );
			} else {
				storage.set( storageKey, '0' );
			}
		}
	};
}
