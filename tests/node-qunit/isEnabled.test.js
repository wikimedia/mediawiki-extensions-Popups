/* global Map: false */

var stubs = require( './stubs' ),
	isEnabled = require( '../../src/isEnabled' );

function createStubUserSettings( isEnabled ) {
	return {
		hasIsEnabled: function () {
			return isEnabled !== undefined;
		},
		getIsEnabled: function () {
			return Boolean( isEnabled );
		}
	};
}

QUnit.module( 'ext.popups#isEnabled (logged out)', {
	setup: function () {
		this.user = stubs.createStubUser( /* isAnon = */ true );
	}
} );

QUnit.test( 'is should handle logged out users', function ( assert ) {
	var user = stubs.createStubUser( /* isAnon = */ true ),
		cases,
		i, testCase,
		userSettings,
		config = new Map();

	cases = [
		[ undefined, true, 'When the user hasn\'t enabled or disabled the feature' ],
		[ false, false, 'When the user has disabled the feature' ],
		[ true, true, 'When the user has enabled the feature' ]
	];

	for ( i = 0; i < cases.length; i++ ) {
		testCase = cases[ i ];
		userSettings = createStubUserSettings( testCase[ 0 ] );

		assert.equal(
			isEnabled( user, userSettings, config ),
			testCase[ 1 ],
			testCase[ 2 ]
		);
	}

	// ---

	config.set( 'wgPopupsBetaFeature', true );

	assert.notOk(
		isEnabled( user, userSettings, config ),
		'When Page Previews is enabled as a beta feature, then it\'s not enabled for logged out users.'
	);
} );

QUnit.test( 'it should handle logged in users', function ( assert ) {
	var user = stubs.createStubUser( /* isAnon = */ false ),
		userSettings = createStubUserSettings( false ),
		config = new Map();

	config.set( 'wgPopupsShouldSendModuleToUser', true );

	assert.ok(
		isEnabled( user, userSettings, config ),
		'If the user is logged in and Page Previews has booted, then it\'s enabled.'
	);
} );
