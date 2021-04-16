import * as stubs from './stubs';
import isReferencePreviewsEnabled from '../../src/isReferencePreviewsEnabled';

QUnit.module( 'ext.popups#isReferencePreviewsEnabled', {
	beforeEach() {
		mw.user = { options: { get: () => '1' } };
	},
	afterEach() {
		mw.user = null;
	}
} );

QUnit.test( 'it should display reference previews when conditions are fulfilled', ( assert ) => {
	const user = stubs.createStubUser( false ),
		config = new Map();

	config.set( 'wgPopupsReferencePreviews', true );
	config.set( 'wgPopupsConflictsWithRefTooltipsGadget', false );

	assert.ok(
		isReferencePreviewsEnabled( user, {}, config ),
		'If the user is logged in and the user is in the on group, then it\'s enabled.'
	);
} );

QUnit.test( 'it should handle the conflict with the Reference Tooltips Gadget', ( assert ) => {
	const user = stubs.createStubUser( false ),
		config = new Map();

	config.set( 'wgPopupsReferencePreviews', true );
	config.set( 'wgPopupsConflictsWithRefTooltipsGadget', true );

	assert.notOk(
		isReferencePreviewsEnabled( user, {}, config ),
		'Reference Previews is disabled.'
	);
} );

QUnit.test( 'it should not be enabled when the global is disabling it', ( assert ) => {
	const user = stubs.createStubUser( false ),
		config = new Map();

	config.set( 'wgPopupsReferencePreviews', false );
	config.set( 'wgPopupsConflictsWithRefTooltipsGadget', false );

	assert.notOk(
		isReferencePreviewsEnabled( user, {}, config ),
		'Reference Previews is disabled.'
	);
} );

QUnit.test( 'it should not be enabled when minerva skin used', ( assert ) => {
	const user = stubs.createStubUser( false ),
		config = new Map();

	config.set( 'wgPopupsReferencePreviews', true );
	config.set( 'wgPopupsConflictsWithRefTooltipsGadget', false );
	config.set( 'skin', 'minerva' );

	assert.notOk(
		isReferencePreviewsEnabled( user, {}, config ),
		'Reference Previews is disabled.'
	);
} );
