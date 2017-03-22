var mw = window.mediaWiki,
	$ = jQuery;

/**
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
module.exports = function ( config, user, actions ) {
	var isBetaFeature = config.get( 'wgPopupsBetaFeature' ),
		rawTitle,
		settingsUrl,
		showSettings = $.noop;

	if ( user.isAnon() ) {
		showSettings = function ( event ) {
			event.preventDefault();

			actions.showSettings();
		};
	} else {
		rawTitle = 'Special:Preferences#mw-prefsection-';
		rawTitle += isBetaFeature ? 'betafeatures' : 'rendering';

		settingsUrl = mw.Title.newFromText( rawTitle )
			.getUrl();
	}

	return {
		settingsUrl: settingsUrl,
		showSettings: showSettings,
		previewDwell: actions.previewDwell,
		previewAbandon: actions.abandon,
		previewShow: actions.previewShow,
		click: actions.linkClick
	};
};
