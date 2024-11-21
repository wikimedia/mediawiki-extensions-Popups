'use strict';

const page = require( '../pageobjects/popups.page' );

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
		await expect( await page.pagePopupsSelector ).toBeDisplayed( { message: 'Page preview is shown.' } );
	} );

	it( 'I should not see a page preview on hash fragment', async function () {
		await page.dwellPageFragment();
		await expect( await page.pagePopupsSelector ).not.toBeDisplayed( { message: 'Page preview is not shown.' } );
	} );

	it( 'Abandoning link hides page preview', async function () {
		await page.dwellPageLink();
		await page.abandonLink();
		await expect( await page.pagePopupsSelector ).not.toBeDisplayed( { message: 'Page preview is kept hidden.' } );
	} );

	it( 'Quickly hovering, abandoning and re-hovering a link shows page preview', async function () {
		await page.hoverPageLink();
		await page.abandonLink();
		await page.dwellPageLink();
		await expect( await page.pagePopupsSelector ).toBeDisplayed( { message: 'Page preview is shown.' } );
	} );
} );
