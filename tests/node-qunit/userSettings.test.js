import { createStubMap } from './stubs';
import createUserSettings from '../../src/userSettings';

QUnit.module( 'ext.popups/userSettings', {
	beforeEach() {
		this.storage = createStubMap();
		this.userSettings = createUserSettings( this.storage );
	}
} );

QUnit.test( '#isPagePreviewsEnabled should return false if Page Previews have been disabled', function ( assert ) {
	this.userSettings.storePreviewTypeEnabled( 'page', false );

	assert.false(
		this.userSettings.isPreviewTypeEnabled( 'page' ),
		'The user has disabled Page Previews.'
	);

	// ---

	this.userSettings.storePreviewTypeEnabled( 'page', true );

	assert.true(
		this.userSettings.isPreviewTypeEnabled( 'page' ),
		'#isPagePreviewsEnabled should return true if Page Previews have been enabled'
	);
} );
