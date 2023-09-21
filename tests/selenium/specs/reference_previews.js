'use strict';

const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' ),
	UserLoginPage = require( 'wdio-mediawiki/LoginPage' );

describe( 'Dwelling on a valid reference link', function () {
	before( async function () {
		await page.setupReferencePreviews();
		// TODO Remove or adjust when not in Beta any more
		await UserLoginPage.loginAdmin();
		await page.shouldUseReferencePopupsBetaFeature();
	} );

	beforeEach( async function () {
		await page.openReferencePopupsTest();
		await page.ready();
	} );

	it( 'I should see a reference preview', async function () {
		if ( !( await page.hasReferencePopupsEnabled() ) ) {
			this.skip();
		}
		await page.dwellReferenceLink( 'cite_ref-1' );
		assert( await page.seeReferencePreview(), 'Reference preview is shown.' );
		assert( !( await page.seeScrollableReferencePreview() ), 'Reference preview is not scrollable.' );
		assert( !( await page.seeFadeoutOnReferenceText() ), 'Reference preview has no fading effect' );
	} );

	it( 'Abandoning link hides reference preview', async function () {
		if ( !( await page.hasReferencePopupsEnabled() ) ) {
			this.skip();
		}
		await page.dwellReferenceLink( 'cite_ref-1' );
		await page.abandonLink();
		assert( await page.doNotSeeReferencePreview(), 'Reference preview is kept hidden.' );
	} );

	// Skipped due to T341763
	it.skip( 'References with lots of text are scrollable and fades', async function () {
		if ( !( await page.hasReferencePopupsEnabled() ) ) {
			this.skip();
		}
		await page.dwellReferenceLink( 'cite_ref-2' );
		assert( await page.seeScrollableReferencePreview(), 'Reference preview is scrollable' );
		assert( await page.seeFadeoutOnReferenceText(), 'Reference preview has a fading effect' );
	} );

	it.skip( 'Dwelling references links inside reference previews does not close the popup ', async function () {
		if ( !( await page.hasReferencePopupsEnabled() ) ) {
			this.skip();
		}
		await page.dwellReferenceLink( 'cite_ref-3' );
		await page.dwellReferenceInceptionLink();
		assert( await page.seeReferenceInceptionPreview(), 'The reference preview is still showing.' );
	} );
} );
