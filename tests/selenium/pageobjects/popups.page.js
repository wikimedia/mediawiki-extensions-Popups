'use strict';

/* global document */

const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	TEST_PAGE_TITLE = 'Popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_SELECTOR = '.mwe-popups-type-page',
	PAGE_POPUPS_LINK_SELECTOR = '#content ul a',
	REFERENCE_POPUPS_SELECTOR = '.mwe-popups-type-reference',
	REFERENCE_INCEPTION_LINK_SELECTOR = '.mwe-popups-type-reference .reference a',
	POPUPS_MODULE_NAME = 'ext.popups.main';

function makePage( title, path ) {
	return new Promise( ( resolve ) => {
		fs.readFile( path, 'utf-8', ( err, content ) => {
			if ( err ) {
				throw err;
			}
			resolve( content );
		} );
	} ).then( ( content ) => {
		return Api.edit( title, content );
	} );
}
class PopupsPage extends Page {
	setup() {
		browser.call( () => {
			const path = `${__dirname}/../fixtures/`;
			// FIXME: Cannot use Promise.all as wdio-mediawiki/Api will trigger a bad
			// token error.
			return makePage( `${TEST_PAGE_TITLE} 2`, `${path}/test_page_2.wikitext` ).then( () => {
				return makePage( TEST_PAGE_TITLE, `${path}test_page.wikitext` );
			} );
		} );
	}

	resourceLoaderModuleStatus( moduleName, moduleStatus, errMsg ) {
		// Word of caution: browser.waitUntil returns a Timer class NOT a Promise.
		// Webdriver IO will run waitUntil synchronously so not returning it will
		// block JavaScript execution while returning it will not.
		// http://webdriver.io/api/utility/waitUntil.html
		// https://github.com/webdriverio/webdriverio/blob/master/lib/utils/Timer.js
		browser.waitUntil( () => {
			const result = browser.execute( ( module ) => {
				return typeof mw !== 'undefined' &&
					mw.loader.getState( module.name ) === module.status;
			}, { status: moduleStatus, name: moduleName } );
			return result.value;
		}, 10000, errMsg );
	}

	ready() {
		this.resourceLoaderModuleStatus( POPUPS_MODULE_NAME, 'ready', 'Popups did not load' );
	}

	hasReferencePopupsEnabled() {
		return browser.execute( function () {
			return mw.config.get( 'wgPopupsReferencePreviews' );
		} ).value;
	}

	abandonLink() {
		browser.moveToObject( '#content h1' );
	}

	dwellLink( selector ) {
		browser.moveToObject( selector );
		browser.waitForExist( POPUPS_SELECTOR );
	}

	dwellPageLink() {
		this.dwellLink( PAGE_POPUPS_LINK_SELECTOR );
	}

	hoverPageLink() {
		browser.moveToObject( PAGE_POPUPS_LINK_SELECTOR );
	}

	dwellReferenceLink( num ) {
		this.dwellLink( `.reference:nth-of-type(${num}) a` );
	}

	dwellReferenceInceptionLink() {
		browser.moveToObject( REFERENCE_INCEPTION_LINK_SELECTOR );
		browser.pause( 1000 );
	}

	doNotSeePreview( selector ) {
		return browser.waitUntil( () => !browser.isVisible( selector ) );
	}

	doNotSeePagePreview() {
		return this.doNotSeePreview( PAGE_POPUPS_SELECTOR );
	}

	doNotSeeReferencePreview() {
		return this.doNotSeePreview( REFERENCE_POPUPS_SELECTOR );
	}

	seePreview( selector ) {
		return browser.isVisible( selector );
	}

	seePagePreview() {
		return this.seePreview( PAGE_POPUPS_SELECTOR );
	}

	seeReferencePreview() {
		return this.seePreview( REFERENCE_POPUPS_SELECTOR );
	}

	seeReferenceInceptionPreview() {
		return this.seePreview( REFERENCE_INCEPTION_LINK_SELECTOR );
	}

	seeScrollableReferencePreview() {
		return browser.execute( () => {
			const el = document.querySelector( '.mwe-popups-extract .mw-parser-output' );
			return el.scrollHeight > el.offsetHeight;
		} ).value;
	}

	seeFadeoutOnReferenceText() {
		return browser.isExisting( '.mwe-popups-fade-out' );
	}

	open() {
		super.openTitle( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
