import { createStubMap } from './stubs';
import createUserSettings from '../../src/userSettings';

QUnit.module( 'ext.popups/userSettings', {
	beforeEach() {
		this.storage = createStubMap();
		this.userSettings = createUserSettings( this.storage );
	}
} );

QUnit.test( '#isPagePreviewsEnabled should return false if Page Previews have been disabled', function ( assert ) {
	this.userSettings.storePagePreviewsEnabled( false );

	assert.notOk(
		this.userSettings.isPagePreviewsEnabled(),
		'The user has disabled Page Previews.'
	);

	// ---

	this.userSettings.storePagePreviewsEnabled( true );

	assert.ok(
		this.userSettings.isPagePreviewsEnabled(),
		'#isPagePreviewsEnabled should return true if Page Previews have been enabled'
	);
} );

QUnit.test( '#isReferencePreviewsEnabled', function ( assert ) {
	assert.strictEqual(
		this.storage.get( 'mwe-popups-referencePreviews-enabled' ),
		null,
		'Precondition: storage is empty.'
	);
	assert.ok(
		this.userSettings.isReferencePreviewsEnabled(),
		'#isReferencePreviewsEnabled should default to true.'
	);

	this.userSettings.storeReferencePreviewsEnabled( false );

	assert.strictEqual(
		this.storage.get( 'mwe-popups-referencePreviews-enabled' ),
		'0',
		'#storeReferencePreviewsEnabled changes the storage.'
	);
	assert.notOk(
		this.userSettings.isReferencePreviewsEnabled(),
		'#isReferencePreviewsEnabled is now false.'
	);
} );
