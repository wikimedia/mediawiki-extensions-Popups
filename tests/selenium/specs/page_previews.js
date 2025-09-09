'use strict';

const page = require( '../pageobjects/popups.page' );

describe( 'Dwelling on a valid page link', () => {
	before( async () => {
		await page.setupPagePreviews();
	} );

	beforeEach( async () => {
		await page.openPagePopupsTest();
		await page.ready();
	} );

	it( 'I should see a page preview', async () => {
		await page.dwellPageLink();
		await expect( await page.pagePopupsSelector ).toBeDisplayed( { message: 'Page preview is shown.' } );
	} );

	it( 'I should not see a page preview on hash fragment', async () => {
		await page.dwellPageFragment();
		await expect( await page.pagePopupsSelector ).not.toBeDisplayed( { message: 'Page preview is not shown.' } );
	} );

	it( 'Abandoning link hides page preview', async () => {
		await page.dwellPageLink();
		await page.abandonLink();
		await expect( await page.pagePopupsSelector ).not.toBeDisplayed( { message: 'Page preview is kept hidden.' } );
	} );
} );
