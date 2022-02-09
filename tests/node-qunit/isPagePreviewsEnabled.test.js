import * as stubs from './stubs';
import isPagePreviewsEnabled from '../../src/isPagePreviewsEnabled';

function createStubUserSettings( expectEnabled ) {
	return {
		isPagePreviewsEnabled() {
			return expectEnabled !== false;
		}
	};
}

QUnit.module( 'ext.popups#isPagePreviewsEnabled', {
	beforeEach() {
		mw.user = { options: { get: () => '1' } };
	},
	afterEach() {
		mw.user = null;
	}
} );

QUnit.test( 'it should handle logged out users', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ true ),
		config = new Map();

	const cases = [
		/*
		[
			<isAnon>, <expected value of isPagePreviewsEnabled>, <test description>
		]
		*/
		[ undefined, true, 'When the user hasn\'t enabled or disabled' +
			' the feature.' ],
		[ false, false, 'When the user has disabled the feature' ],
		[ true, true, 'When the user has enabled the feature' ]
	];

	let userSettings;
	for ( let i = 0; i < cases.length; i++ ) {
		const testCase = cases[ i ];
		userSettings = createStubUserSettings( testCase[ 0 ] );

		assert.strictEqual(
			isPagePreviewsEnabled( user, userSettings, config ),
			testCase[ 1 ],
			testCase[ 2 ]
		);
	}
} );

QUnit.test( 'it should handle logged in users', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ false ),
		config = new Map();

	assert.true(
		isPagePreviewsEnabled( user, {}, config ),
		'If the user is logged in and the user is in the on group, then it\'s enabled.'
	);
} );

QUnit.test( 'it should handle the conflict with the Navigation Popups Gadget', ( assert ) => {
	const user = stubs.createStubUser( /* isAnon = */ false ),
		config = new Map();

	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	assert.strictEqual(
		isPagePreviewsEnabled( user, {}, config ),
		null,
		'Page Previews is disabled when it conflicts with the Navigation Popups Gadget.'
	);

} );
