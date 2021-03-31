/**
 * @module changeListeners/syncUserSettings
 */

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
	return ( prevState, state ) => {
		syncIfChanged(
			prevState, state, 'eventLogging.previewCount',
			userSettings.storePreviewCount
		);
		syncIfChanged(
			prevState, state, 'preview.enabled',
			userSettings.storePagePreviewsEnabled
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
	return path.split( '.' ).reduce( function ( element, key ) {
		return element && element[ key ];
	}, state );
}

/**
 * Calls a sync function if the property prop on the property reducer on
 * the state trees has changed value.
 *
 * @param {Object} prevState
 * @param {Object} state
 * @param {string} path dot-separated path in the state tree
 * @param {Function} sync function to be called with the newest value if
 * changed
 * @return {void}
 */
function syncIfChanged( prevState, state, path, sync ) {
	const current = get( state, path );
	if ( prevState && ( get( prevState, path ) !== current ) ) {
		sync( current );
	}
}
