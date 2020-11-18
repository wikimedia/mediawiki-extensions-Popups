'use strict';

const assert = require( 'assert' ),
	page = require( '../pageobjects/popups.page' ),
	UserLoginPage = require( 'wdio-mediawiki/LoginPage' );

describe( 'Dwelling on a valid reference link', function () {
	before( function () {
		page.setup();
		// TODO Remove or adjust when not in Beta any more
		UserLoginPage.loginAdmin();
		page.shouldUseReferencePopupsBetaFeature( true );
	} );

	beforeEach( function () {
		page.open();
		page.ready();
	} );

	it( 'I should see a reference preview', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.dwellReferenceLink( 1 );
		assert( page.seeReferencePreview(), 'Reference preview is shown.' );
		assert( !page.seeScrollableReferencePreview(), 'Reference preview is not scrollable.' );
		assert( !page.seeFadeoutOnReferenceText(), 'Reference preview has no fading effect' );
	} );

	it( 'Abandoning link hides reference preview', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.dwellReferenceLink( 1 );
		page.abandonLink();
		assert( page.doNotSeeReferencePreview(), 'Reference preview is kept hidden.' );
	} );

	it( 'References with lots of text are scrollable and fades', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.dwellReferenceLink( 2 );
		assert( page.seeScrollableReferencePreview(), 'Reference preview is scrollable' );
		assert( page.seeFadeoutOnReferenceText(), 'Reference preview has a fading effect' );
	} );

	it( 'Dwelling references links inside reference previews does not close the popup ', function () {
		if ( !page.hasReferencePopupsEnabled() ) {
			this.skip();
		}
		page.dwellReferenceLink( 3 );
		page.dwellReferenceInceptionLink();
		assert( page.seeReferenceInceptionPreview(), 'The reference preview is still showing.' );
	} );
} );
