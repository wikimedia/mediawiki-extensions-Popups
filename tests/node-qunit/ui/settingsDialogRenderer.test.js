import createSettingsDialogRenderer from '../../../src/ui/settingsDialogRenderer';

QUnit.module( 'ext.popups/settingsDialogRenderer', {
	beforeEach() {
		function render() {
			return $( '<div>' );
		}
		function getTemplate() {
			return { render };
		}

		mw.html = { escape: ( str ) => str };
		mw.template = { get: getTemplate };
		mw.config = { get() {} };
		mw.msg = () => {};
	},
	afterEach() {
		mw.msg = null;
		mw.config = null;
		mw.template = null;
		mw.html = null;
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
		result = createSettingsDialogRenderer( mw.config )( boundActions );

	// Specifically NOT a deep equal. Only structure.
	assert.propEqual(
		result,
		expected,
		'Interface exposed has the expected methods'
	);
} );

// FIXME: Add Qunit integration tests about the rendering and the behavior of
// the settings dialog.
