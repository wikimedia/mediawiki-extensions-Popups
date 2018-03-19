/* global Map: false */

import * as stubs from './stubs';
import isEnabled from '../../src/isEnabled';
import { BUCKETS } from '../../src/constants';

function createStubUserSettings( isEnabled ) {
	return {
		hasIsEnabled() {
			return isEnabled !== undefined;
		},
		getIsEnabled() {
			return Boolean( isEnabled );
		}
	};
}

QUnit.module( 'ext.popups#isEnabled (logged out)', {
	beforeEach() {
		this.user = stubs.createStubUser( /* isAnon = */ true );
	}
} );

QUnit.test( 'is should handle logged out users', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ true ),
		config = new Map();

	const cases = [
		/*
		[
			<isAnon>, <bucket>, <expected value of isEnabled>, <test description>
		]
		*/
		[ undefined, BUCKETS.on, true, 'When the user hasn\'t enabled or disabled' +
			' the feature and the user is in the sample.' ],
		[ undefined, BUCKETS.control, false, 'When the user hasn\'t enabled or disabled' +
			' the feature and the user is not in the sample.' ],
		[ false, BUCKETS.on, false, 'When the user has disabled the feature' +
			' and the user is in the sample.' ],
		[ false, BUCKETS.control, false, 'When the user has disabled the feature' +
			' and the user is not in the sample.' ],
		[ true, BUCKETS.on, true, 'When the user has enabled the feature' +
			' and the user is in the sample.' ],
		[ true, BUCKETS.control, true, 'When the user has enabled the feature' +
			' and the user is not in the sample.' ]
	];

	let userSettings;
	for ( let i = 0; i < cases.length; i++ ) {
		const testCase = cases[ i ];
		userSettings = createStubUserSettings( testCase[ 0 ] );

		assert.equal(
			isEnabled( user, userSettings, config, testCase[ 1 ] ),
			testCase[ 2 ],
			testCase[ 3 ]
		);
	}

	// ---

	config.set( 'wgPopupsBetaFeature', true );

	assert.notOk(
		isEnabled( user, userSettings, config, BUCKETS.on ),
		'When Page Previews is enabled as a beta feature, then it\'s not' +
			' enabled for logged out users when they are in the on group.'
	);

	assert.notOk(
		isEnabled( user, userSettings, config, BUCKETS.control ),
		'When Page Previews is enabled as a beta feature, then it\'s not' +
			' enabled for logged out users when they are not in the control group.'
	);

	assert.notOk(
		isEnabled( user, userSettings, config, BUCKETS.off ),
		'When Page Previews is enabled as a beta feature, then it\'s not' +
			' enabled for logged out users when they are in the off group.'
	);
} );

QUnit.test( 'it should handle logged in users', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ false ),
		userSettings = createStubUserSettings( false ),
		config = new Map();

	config.set( 'wgPopupsShouldSendModuleToUser', true );

	assert.ok(
		isEnabled( user, userSettings, config, BUCKETS.on ),
		'If the user is logged in and the user is in the on group, then it\'s enabled.'
	);

	assert.ok(
		isEnabled( user, userSettings, config, BUCKETS.control ),
		'Bucket does not have an affect on logged in users.' +
			'If the user is logged in and they are in the control group it\'s still enabled.'
	);

	assert.ok(
		isEnabled( user, userSettings, config, BUCKETS.off ),
		'Bucket does not have an affect on logged in users.' +
			'If the user is logged in and the user is bucketed as off then it\'s still enabled.'
	);
} );

QUnit.test( 'it should handle the conflict with the Navigation Popups Gadget', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ false ),
		userSettings = createStubUserSettings( false ),
		config = new Map();

	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	assert.notOk(
		isEnabled( user, userSettings, config, BUCKETS.on ),
		'Page Previews is disabled when it conflicts with the Navigation Popups Gadget.'
	);

} );
