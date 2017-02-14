( function ( $, mw ) {
	QUnit.module( 'ext.popups/settingsDialog' );

	QUnit.test( '#render', function ( assert ) {
		var boundActions = {
				saveSettings: function () {},
				hideSettings: function () {}
			},
			expected = {
				appendTo: function () {},
				show: function () {},
				hide: function () {},
				toggleHelp: function () {},
				setEnabled: function () {}
			},
			result = mw.popups.createSettingsDialogRenderer()( boundActions );

		// Specifically NOT a deep equal. Only structure.
		assert.propEqual(
			result,
			expected
		);
	} );

	// FIXME: Add Qunit integration tests about the rendering and the behavior of
	// the settings dialog.

} )( jQuery, mediaWiki );
