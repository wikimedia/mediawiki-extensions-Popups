/**
 * @module previewBehaviour
 */

const mw = window.mediaWiki,
	$ = jQuery;

/**
 * A collection of event handlers specific to how the user interacts with all
 * previews. The event handlers  are are agnostic to how/when they are bound
 * //but not to what they are bound//, i.e. the showSettings event handler is
 * written to be bound to either an `<a>` or `<button>` element.
 *
 * @typedef {Object} ext.popups.PreviewBehavior
 * @property {String} settingsUrl
 * @property {Function} showSettings
 * @property {Function} previewDwell
 * @property {Function} previewAbandon
 * @property {Function} click handler for the entire preview
 */

/**
 * Creates an instance of `ext.popups.PreviewBehavior`.
 *
 * If the user is logged out, then clicking the cog should show the settings
 * modal.
 *
 * If the user is logged in, then clicking the cog should send them to the
 * Special:Preferences page with the "Beta features" tab open if Page Previews
 * is enabled as a beta feature, or the "Appearance" tab otherwise.
 *
 * @param {mw.Map} config
 * @param {mw.User} user
 * @param {Object} actions The action creators bound to the Redux store
 * @return {ext.popups.PreviewBehavior}
 */
export default function createPreviewBehavior( config, user, actions ) {
	const isBetaFeature = config.get( 'wgPopupsBetaFeature' );
	let settingsUrl, showSettings = $.noop;

	if ( user.isAnon() ) {
		showSettings = ( event ) => {
			event.preventDefault();

			actions.showSettings();
		};
	} else {
		let rawTitle = 'Special:Preferences#mw-prefsection-';
		rawTitle += isBetaFeature ? 'betafeatures' : 'rendering';

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
