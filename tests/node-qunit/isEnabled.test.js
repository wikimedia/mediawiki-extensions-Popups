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
	beforeEach: function () {
		this.user = stubs.createStubUser( /* isAnon = */ true );
	}
} );

QUnit.test( 'is should handle logged out users', function ( assert ) {
	var user = stubs.createStubUser( /* isAnon = */ true ),
		cases,
		i, testCase,
		userSettings,
		experiments,
		config = new Map();

	cases = [
		[ undefined, true, true, 'When the user hasn\'t enabled or disabled' +
			' the feature and the user is in the sample.' ],
		[ undefined, false, false, 'When the user hasn\'t enabled or disabled' +
			' the feature and the user is not in the sample.' ],
		[ false, true, false, 'When the user has disabled the feature' +
			' and the user is in the sample.' ],
		[ false, false, false, 'When the user has disabled the feature' +
			' and the user is not in the sample.' ],
		[ true, true, true, 'When the user has enabled the feature' +
			' and the user is in the sample.' ],
		[ true, false, true, 'When the user has enabled the feature' +
			' and the user is not in the sample.' ]
	];

	for ( i = 0; i < cases.length; i++ ) {
		testCase = cases[ i ];
		userSettings = createStubUserSettings( testCase[ 0 ] );
		experiments = stubs.createStubExperiments( testCase[ 1 ] );

		assert.equal(
			isEnabled( user, userSettings, config, experiments ),
			testCase[ 2 ],
			testCase[ 3 ]
		);
	}

	// ---

	config.set( 'wgPopupsBetaFeature', true );
	experiments = stubs.createStubExperiments( true );

	assert.notOk(
		isEnabled( user, userSettings, config, experiments ),
		'When Page Previews is enabled as a beta feature, then it\'s not' +
			' enabled for logged out users when they are in the sample.'
	);

	experiments = stubs.createStubExperiments( false );

	assert.notOk(
		isEnabled( user, userSettings, config, experiments ),
		'When Page Previews is enabled as a beta feature, then it\'s not' +
			' enabled for logged out users when they are not in the sample.'
	);
} );

QUnit.test( 'it should handle logged in users', function ( assert ) {
	var user = stubs.createStubUser( /* isAnon = */ false ),
		userSettings = createStubUserSettings( false ),
		experiments = stubs.createStubExperiments( true ),
		config = new Map();

	config.set( 'wgPopupsShouldSendModuleToUser', true );

	assert.ok(
		isEnabled( user, userSettings, config, experiments ),
		'If the user is logged in and Page Previews has booted, then it\'s enabled.'
	);

	experiments = stubs.createStubExperiments( false );
	assert.ok(
		isEnabled( user, userSettings, config, experiments ),
		'Anon sampling does not have an affect on logged in users.' +
			'If the user is logged in and Page Previews has booted, then it\'s enabled.'
	);
} );

QUnit.test( 'it should handle the conflict with the Navigation Popups Gadget', function ( assert ) {
	var user = stubs.createStubUser( /* isAnon = */ false ),
		userSettings = createStubUserSettings( false ),
		experiments = stubs.createStubExperiments( true ),
		config = new Map();

	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	assert.notOk(
		isEnabled( user, userSettings, config, experiments ),
		'Page Previews is disabled when it conflicts with the Navigation Popups Gadget.'
	);

} );
