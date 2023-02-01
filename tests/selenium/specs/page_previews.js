'use strict';

const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid page link', function () {
	before( function () {
		page.setup();
	} );

	beforeEach( function () {
		page.open();
		page.ready();
	} );

	it( 'I should see a page preview', function () {
		page.dwellPageLink();
		assert( page.seePagePreview(), 'Page preview is shown.' );
	} );

	it( 'I should not see a page preview on hash fragment', function () {
		page.dwellPageFragment();
		assert( page.doNotSeePagePreview(), 'Page preview is not shown.' );
	} );

	it( 'Abandoning link hides page preview', function () {
		page.dwellPageLink();
		page.abandonLink();
		assert( page.doNotSeePagePreview(), 'Page preview is kept hidden.' );
	} );

	it( 'Quickly hovering, abandoning and re-hovering a link shows page preview', function () {
		page.hoverPageLink();
		page.abandonLink();
		page.dwellPageLink();
		assert( page.seePagePreview(), 'Page preview is shown.' );
	} );
} );
