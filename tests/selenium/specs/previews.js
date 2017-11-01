'use strict';

const assert = require( 'assert' );
const page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid link', function () {

	before( function () {
		page.setup();
	} );

	it( 'I should see a preview', function () {
		page.open();
		page.dwellLink();
		assert( page.seePreview() );
	} );

	it( 'Abandoning link hides preview', function () {
		page.open();
		page.dwellLink();
		page.abandonLink();
		assert( page.doNotSeePreview() );
	} );
} );
