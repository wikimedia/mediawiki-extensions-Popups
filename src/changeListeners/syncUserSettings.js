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
			prevState, state, 'eventLogging', 'previewCount',
			userSettings.setPreviewCount
		);
		syncIfChanged(
			prevState, state, 'preview', 'enabled',
			userSettings.setIsEnabled
		);

	};
}

/**
 * Given a state tree, reducer and property, safely return the value of the
 * property if the reducer and property exist
 * @param {Object} state tree
 * @param {String} reducer key to access on the state tree
 * @param {String} prop key to access on the reducer key of the state tree
 * @return {*}
 */
function get( state, reducer, prop ) {
	return state[ reducer ] && state[ reducer ][ prop ];
}

/**
 * Calls a sync function if the property prop on the property reducer on
 * the state trees has changed value.
 * @param {Object} prevState
 * @param {Object} state
 * @param {String} reducer key to access on the state tree
 * @param {String} prop key to access on the reducer key of the state tree
 * @param {Function} sync function to be called with the newest value if
 * changed
 */
function syncIfChanged( prevState, state, reducer, prop, sync ) {
	const current = get( state, reducer, prop );
	if ( prevState && ( get( prevState, reducer, prop ) !== current ) ) {
		sync( current );
	}
}
