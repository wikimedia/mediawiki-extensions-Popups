const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid page link', () => {

	before( () => {
		page.setup();
	} );

	it( 'I should see a page preview', () => {
		page.open();
		page.dwellPageLink();
		assert( page.seePagePreview(), 'Page preview is shown.' );
	} );

	it( 'Abandoning link hides page preview', () => {
		page.open();
		page.dwellPageLink();
		page.abandonLink();
		assert( page.doNotSeePagePreview(), 'Page preview is kept hidden.' );
	} );
} );
