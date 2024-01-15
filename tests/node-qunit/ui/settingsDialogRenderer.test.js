import createSettingsDialogRenderer, { toggleHelp } from '../../../src/ui/settingsDialogRenderer';

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

QUnit.test( '#toggleHelp', ( assert ) => {
	const dialog = document.createElement( 'div' );
	const main = document.createElement( 'main' );
	const save = document.createElement( 'button' );
	save.classList.add( 'mwe-popups-settings-help' );
	dialog.appendChild( main );
	dialog.appendChild( save );
	toggleHelp( dialog, true );
	assert.strictEqual( main.style.display, 'none' );
	assert.strictEqual( save.style.display, '' );
	toggleHelp( dialog, false );
	assert.strictEqual( main.style.display, '' );
	assert.strictEqual( save.style.display, 'none' );
} );

QUnit.test( '#render', ( assert ) => {
	const main = document.createElement( 'main' );
	const boundActions = {
			saveSettings() {},
			hideSettings() {}
		},
		expected = {
			refresh() {},
			appendTo() {},
			show() {},
			hide() {},
			toggleHelp() {},
			setEnabled() {}
		},
		dialogRenderer = createSettingsDialogRenderer( mw.config )( boundActions, {} );

	// Specifically NOT a deep equal. Only structure.
	assert.propEqual(
		dialogRenderer,
		expected,
		'Interface exposed has the expected methods'
	);

	// Sanity checks for some methods
	assert.strictEqual( main.childElementCount, 0 );
	dialogRenderer.appendTo( main );
	assert.strictEqual( main.childElementCount, 1 );

	assert.strictEqual( $( main.children[ 0 ] ).css( 'display' ), 'block' );
	dialogRenderer.hide();
	assert.strictEqual( $( main.children[ 0 ] ).css( 'display' ), 'none' );
} );

// FIXME: Add Qunit integration tests about the rendering and the behavior of
// the settings dialog.
