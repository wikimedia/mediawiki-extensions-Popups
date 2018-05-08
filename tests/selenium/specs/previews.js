const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid link', () => {

	before( () => {
		page.setup();
	} );

	it( 'I should see a preview', () => {
		page.open();
		page.dwellLink();
		assert( page.seePreview(), 'Preview is shown.' );
	} );

	it( 'Abandoning link hides preview', () => {
		page.open();
		page.dwellLink();
		page.abandonLink();
		assert( page.doNotSeePreview(), 'Preview is kept hidden.' );
	} );
} );
