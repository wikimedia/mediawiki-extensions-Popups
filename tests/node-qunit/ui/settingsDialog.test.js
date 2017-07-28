import createSettingsDialogRenderer from '../../../src/ui/settingsDialog';

QUnit.module( 'ext.popups/settingsDialog', {
	beforeEach: function () {
		function render() { return $( '<div>' ); }
		function getTemplate() { return { render: render }; }

		mediaWiki.template = { get: getTemplate };
		mediaWiki.config = { get: function () {} };
		mediaWiki.msg = function () {};
	},
	afterEach: function () {
		mediaWiki.config = null;
		mediaWiki.template = null;
		mediaWiki.msg = null;
	}
} );

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
		result = createSettingsDialogRenderer()( boundActions );

	// Specifically NOT a deep equal. Only structure.
	assert.propEqual(
		result,
		expected,
		'Interface exposed has the expected methods'
	);
} );

// FIXME: Add Qunit integration tests about the rendering and the behavior of
// the settings dialog.
