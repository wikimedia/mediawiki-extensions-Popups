import createSettingsDialogRenderer from '../../../src/ui/settingsDialogRenderer';

QUnit.module( 'ext.popups/settingsDialogRenderer', {
	beforeEach() {
		function render() { return $( '<div>' ); }
		function getTemplate() { return { render }; }

		mediaWiki.html = { escape: str => str };
		mediaWiki.template = { get: getTemplate };
		mediaWiki.config = { get() {} };
		mediaWiki.msg = () => {};
	},
	afterEach() {
		mediaWiki.msg = null;
		mediaWiki.config = null;
		mediaWiki.template = null;
		mediaWiki.html = null;
	}
} );

QUnit.test( '#render', ( assert ) => {
	const boundActions = {
			saveSettings() {},
			hideSettings() {}
		},
		expected = {
			appendTo() {},
			show() {},
			hide() {},
			toggleHelp() {},
			setEnabled() {}
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
