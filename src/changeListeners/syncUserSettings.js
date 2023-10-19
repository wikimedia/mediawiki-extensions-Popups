/**
 * @module changeListeners/syncUserSettings
 */

import { previewTypes } from '../preview/model';

/**
 * Creates an instance of the user settings sync change listener.
 *
 * This change listener syncs certain parts of the state tree to user
 * settings when they change.
 *
 * Used for:
 *
 * * Enabled state: If the previews are enabled or disabled.
 * * Preview count: When the user dwells on a link for long enough that
 *   a preview is shown, then their preview count will be incremented (see
 *   `reducers/eventLogging.js`, and is persisted to local storage.
 *
 * @param {ext.popups.UserSettings} userSettings
 * @return {ext.popups.ChangeListener}
 */
export default function syncUserSettings( userSettings ) {
	return ( oldState, newState ) => {
		syncIfChanged(
			oldState, newState, 'preview.enabled.' + previewTypes.TYPE_PAGE,
			userSettings.storePagePreviewsEnabled
		);
		syncIfChanged(
			oldState, newState, 'preview.enabled.' + previewTypes.TYPE_REFERENCE,
			userSettings.storeReferencePreviewsEnabled
		);
	};
}

/**
 * Given a state tree, reducer and property, safely return the value of the
 * property if the reducer and property exist
 *
 * @param {Object} state tree
 * @param {string} path dot-separated path in the state tree
 * @return {*}
 */
function get( state, path ) {
	return path.split( '.' ).reduce(
		( element, key ) => element && element[ key ],
		state
	);
}

/**
 * Calls a sync function if the property prop on the property reducer on
 * the state trees has changed value.
 *
 * @param {Object} oldState
 * @param {Object} newState
 * @param {string} path dot-separated path in the state tree
 * @param {Function} sync function to be called with the newest value if
 * changed
 * @return {void}
 */
function syncIfChanged( oldState, newState, path, sync ) {
	const current = get( newState, path );
	if ( oldState && ( get( oldState, path ) !== current ) ) {
		sync( current );
	}
}
