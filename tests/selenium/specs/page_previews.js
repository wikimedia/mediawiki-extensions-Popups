'use strict';

const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid page link', function () {
	before( async function () {
		await page.setupPagePreviews();
	} );

	beforeEach( async function () {
		await page.openPagePopupsTest();
		await page.ready();
	} );

	it( 'I should see a page preview', async function () {
		await page.dwellPageLink();
		await assert( await page.seePagePreview(), 'Page preview is shown.' );
	} );

	it( 'I should not see a page preview on hash fragment', async function () {
		await page.dwellPageFragment();
		assert( await page.doNotSeePagePreview(), 'Page preview is not shown.' );
	} );

	it( 'Abandoning link hides page preview', async function () {
		await page.dwellPageLink();
		await page.abandonLink();
		assert( await page.doNotSeePagePreview(), 'Page preview is kept hidden.' );
	} );

	it( 'Quickly hovering, abandoning and re-hovering a link shows page preview', async function () {
		await page.hoverPageLink();
		await page.abandonLink();
		await page.dwellPageLink();
		assert( await page.seePagePreview(), 'Page preview is shown.' );
	} );
} );
