import { previewTypes } from './preview/model';

/**
 * @module userSettings
 * @private
 */

const PAGE_PREVIEWS_ENABLED_KEY = 'mwe-popups-enabled',
	REFERENCE_PREVIEWS_ENABLED_KEY = 'mwe-popups-referencePreviews-enabled',
	PAGE_PREVIEWS_CHANGE_SETTING_EVENT = 'Popups.SettingChange';

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
			const TYPE_REFERENCE = 'reference';
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
			const storageKey = `mwe-popups-${ previewType }-enabled`;
			if ( enabled ) {
				storage.remove( storageKey );
			} else {
				storage.set( storageKey, '0' );
			}
			/**
			 * @stable for use in MediaWiki extensions.
			 */
			mw.track( PAGE_PREVIEWS_CHANGE_SETTING_EVENT, {
				previewType,
				action: enabled ? 'anonymousEnabled' : 'anonymousDisabled'
			} );
		}
	};
}
