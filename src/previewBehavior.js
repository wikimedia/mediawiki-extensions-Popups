/**
 * @module previewBehaviour
 */
const canSaveToUserPreferences = require( './canSaveToUserPreferences.js' );

/**
 * A collection of event handlers specific to how the user interacts with all
 * previews. The event handlers  are are agnostic to how/when they are bound
 * //but not to what they are bound//, i.e. the showSettings event handler is
 * written to be bound to either an `<a>` or `<button>` element.
 *
 * @typedef {Object} ext.popups.PreviewBehavior
 * @property {string} settingsUrl
 * @property {Function} showSettings
 * @property {Function} previewDwell
 * @property {Function} previewAbandon
 * @property {Function} previewShow
 * @property {Function} click handler for the entire preview
 */

/**
 * Creates an instance of `ext.popups.PreviewBehavior`.
 *
 * If the user is logged out, then clicking the cog should show the settings
 * modal.
 *
 * If the user is logged in, then clicking the cog should send them to the
 * the "Appearance" tab otherwise.
 *
 * @param {mw.User} user
 * @param {Object} actions The action creators bound to the Redux store
 * @return {ext.popups.PreviewBehavior}
 */
export default function createPreviewBehavior( user, actions ) {
	let settingsUrl, showSettings = () => {};

	if ( !canSaveToUserPreferences( user ) ) {
		showSettings = ( event ) => {
			event.preventDefault();

			actions.showSettings();
		};
	} else {
		const rawTitle = 'Special:Preferences#mw-prefsection-rendering';

		settingsUrl = mw.Title.newFromText( rawTitle )
			.getUrl();
	}

	return {
		settingsUrl,
		showSettings,
		previewDwell: actions.previewDwell,
		previewAbandon: actions.abandon,
		previewShow: actions.previewShow,
		click: actions.linkClick
	};
}
