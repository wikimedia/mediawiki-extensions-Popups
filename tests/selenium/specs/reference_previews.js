const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid reference link', () => {

	before( () => {
		page.setup();
	} );

	it( 'I should see a reference preview', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.open();
		page.dwellReferenceLink();
		assert( page.seeReferencePreview(), 'Reference preview is shown.' );
	} );

	it( 'Abandoning link hides reference preview', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.open();
		page.dwellReferenceLink();
		page.abandonLink();
		assert( page.doNotSeeReferencePreview(), 'Reference preview is kept hidden.' );
	} );
} );
