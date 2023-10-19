import settings from '../../../src/reducers/settings';
import actionTypes from '../../../src/actionTypes';

QUnit.module( 'reducers/settings' );

QUnit.test( '@@INIT', ( assert ) => {
	const state = settings( undefined, { type: '@@INIT' } );

	assert.deepEqual(
		state,
		{
			shouldShow: false,
			showHelp: false,
			shouldShowFooterLink: false
		},
		'The initial state doesn\'t show, doesn\'t show help, and doesn\'t show a footer link.'
	);
} );

QUnit.test( 'BOOT with a single disabled popup type', ( assert ) => {
	const action = {
		type: actionTypes.BOOT,
		initiallyEnabled: { page: false },
		user: { isAnon: true }
	};
	assert.deepEqual(
		settings( {}, action ),
		{ shouldShowFooterLink: true },
		'The boot state shows a footer link.'
	);

	action.user.isAnon = false;
	assert.deepEqual(
		settings( {}, action ),
		{ shouldShowFooterLink: false },
		'If the user is logged in, then it doesn\'t signal that the footer link should be shown.'
	);
} );

QUnit.test( 'BOOT with multiple popup types', ( assert ) => {
	const action = {
		type: actionTypes.BOOT,
		initiallyEnabled: { page: true, reference: null },
		user: { isAnon: true }
	};
	assert.deepEqual(
		settings( {}, action ),
		{ shouldShowFooterLink: false },
		'Footer link ignores unavailable popup types.'
	);

	action.initiallyEnabled.reference = true;
	assert.deepEqual(
		settings( {}, action ),
		{ shouldShowFooterLink: false },
		'Footer link is pointless when there is nothing to enable.'
	);

	action.initiallyEnabled.reference = false;
	assert.deepEqual(
		settings( {}, action ),
		{ shouldShowFooterLink: true },
		'Footer link appears when at least one popup type is disabled.'
	);
} );

QUnit.test( 'SETTINGS_SHOW', ( assert ) => {
	assert.deepEqual(
		settings( {}, { type: actionTypes.SETTINGS_SHOW } ),
		{
			shouldShow: true,
			showHelp: false
		},
		'It should mark the settings dialog as ready to be shown, with no help.'
	);
} );

QUnit.test( 'SETTINGS_HIDE', ( assert ) => {
	assert.deepEqual(
		settings( {}, { type: actionTypes.SETTINGS_HIDE } ),
		{
			shouldShow: false,
			showHelp: false
		},
		'It should mark the settings dialog as ready to be closed, and hide help.'
	);
} );

QUnit.test( 'SETTINGS_CHANGE with page previews only', ( assert ) => {
	const action = ( oldValue, newValue ) => {
		return {
			type: actionTypes.SETTINGS_CHANGE,
			oldValue: { page: oldValue },
			newValue: { page: newValue }
		};
	};

	assert.deepEqual(
		settings( {}, action( false, false ) ),
		{ shouldShow: false },
		'It should just hide the settings dialog when enabled state stays the same.'
	);
	assert.deepEqual(
		settings( {}, action( true, true ) ),
		{ shouldShow: false },
		'It should just hide the settings dialog when enabled state stays the same.'
	);

	assert.deepEqual(
		settings( {}, action( false, true ) ),
		{
			shouldShow: false,
			showHelp: false,
			shouldShowFooterLink: false
		},
		'It should hide the settings dialog and help when we enable.'
	);

	assert.deepEqual(
		settings( {}, action( true, false ) ),
		{
			shouldShow: true,
			showHelp: true,
			shouldShowFooterLink: true
		},
		'It should keep the settings showing and show the help when we disable.'
	);
} );

QUnit.test( 'SETTINGS_CHANGE with two preview types', ( assert ) => {
	[
		[
			'All are disabled but nothing changed',
			false, false, false, false,
			{ shouldShow: false }
		],
		[
			'All are enabled but nothing changed',
			true, true, true, true,
			{ shouldShow: false }
		],
		[
			'One is enabled but nothing changed',
			false, false, true, true,
			{ shouldShow: false }
		],
		[
			'Only one got disabled',
			true, true, true, false,
			{ shouldShow: true, showHelp: true, shouldShowFooterLink: true }
		],
		[
			'One got disabled, the other enabled',
			false, true, true, false,
			{ shouldShow: true, showHelp: true, shouldShowFooterLink: true }
		],
		[
			'Both got disabled',
			true, false, true, false,
			{ shouldShow: true, showHelp: true, shouldShowFooterLink: true }
		],
		[
			'Only one got enabled',
			false, false, false, true,
			{ shouldShow: false, showHelp: false, shouldShowFooterLink: true }
		],
		[
			'Both got enabled',
			false, true, false, true,
			{ shouldShow: false, showHelp: false, shouldShowFooterLink: false }
		]
	].forEach( ( [
		message,
		pageBefore,
		pageAfter,
		referenceBefore,
		referenceAfter,
		expected
	] ) => {
		assert.deepEqual(
			settings( {}, {
				type: actionTypes.SETTINGS_CHANGE,
				oldValue: { page: pageBefore, reference: referenceBefore },
				newValue: { page: pageAfter, reference: referenceAfter }
			} ),
			expected,
			message
		);
	} );
} );
