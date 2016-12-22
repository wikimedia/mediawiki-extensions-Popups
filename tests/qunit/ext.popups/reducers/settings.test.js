( function ( mw ) {

	QUnit.module( 'ext.popups/reducers#settings' );

	QUnit.test( '@@INIT', function ( assert ) {
		var state = mw.popups.reducers.settings( undefined, { type: '@@INIT' } );

		assert.deepEqual(
			state,
			{
				shouldShow: false,
				showHelp: false,
				shouldShowFooterLink: false
			}
		);
	} );

	QUnit.test( 'BOOT', function ( assert ) {
		var action = {
			type: 'BOOT',
			isEnabled: false,
			user: {
				isAnon: true
			}
		};

		assert.deepEqual(
			mw.popups.reducers.settings( {}, action ),
			{
				shouldShowFooterLink: true
			}
		);

		// ---

		// And when the user is logged out...
		action.user.isAnon = false;

		assert.deepEqual(
			mw.popups.reducers.settings( {}, action ),
			{
				shouldShowFooterLink: false
			},
			'If the user is logged in, then it doesn\'t signal that the footer link should be shown.'
		);
	} );

	QUnit.test( 'SETTINGS_SHOW', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.settings( {}, { type: 'SETTINGS_SHOW' } ),
			{
				shouldShow: true,
				showHelp: false
			},
			'It should mark the settings dialog as ready to be shown, with no help.'
		);
	} );

	QUnit.test( 'SETTINGS_HIDE', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.settings( {}, { type: 'SETTINGS_HIDE' } ),
			{
				shouldShow: false,
				showHelp: false
			},
			'It should mark the settings dialog as ready to be closed, and hide help.'
		);
	} );

	QUnit.test( 'SETTINGS_CHANGE', function ( assert ) {
		var action = function ( wasEnabled, enabled ) {
			return {
				type: 'SETTINGS_CHANGE',
				wasEnabled: wasEnabled,
				enabled: enabled
			};
		};

		assert.deepEqual(
			mw.popups.reducers.settings( {}, action( false, false ) ),
			{ shouldShow: false },
			'It should just hide the settings dialog when enabled state stays the same.'
		);
		assert.deepEqual(
			mw.popups.reducers.settings( {}, action( true, true ) ),
			{ shouldShow: false },
			'It should just hide the settings dialog when enabled state stays the same.'
		);

		assert.deepEqual(
			mw.popups.reducers.settings( {}, action( false, true ) ),
			{
				shouldShow: false,
				showHelp: false,
				shouldShowFooterLink: false
			},
			'It should hide the settings dialog and help when we enable.'
		);

		assert.deepEqual(
			mw.popups.reducers.settings( {}, action( true, false ) ),
			{
				shouldShow: true,
				showHelp: true,
				shouldShowFooterLink: true
			},
			'It should keep the settings showing and show the help when we disable.'
		);

	} );

}( mediaWiki ) );
