const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	TEST_PAGE_TITLE = 'Popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_SELECTOR = '.mwe-popups-type-page',
	REFERENCE_POPUPS_SELECTOR = '.mwe-popups-type-reference',
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
			const path = `${ __dirname }/../fixtures/`;
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
			return browser.execute( ( module ) => {
				return mediaWiki &&
					mediaWiki.loader &&
					mediaWiki.loader.getState( module.name ) === module.status;
			}, { status: moduleStatus, name: moduleName } );
		}, 10000, errMsg );
	}

	ready() {
		this.resourceLoaderModuleStatus( POPUPS_MODULE_NAME, 'ready', 'Popups did not load' );
	}

	hasReferencePopupsEnabled() {
		this.open();
		return browser.execute( function () {
			return mediaWiki.config.get( 'wgPopupsReferencePreviews' );
		} ).value;
	}

	abandonLink() {
		browser.moveToObject( '#content h1' );
	}

	dwellLink( selector ) {
		const PAUSE = 1000;
		this.ready();
		browser.pause( PAUSE );
		this.abandonLink();
		browser.pause( PAUSE );
		browser.moveToObject( selector );
		browser.waitForExist( POPUPS_SELECTOR );
	}

	dwellPageLink() {
		this.dwellLink( '#content ul a' );
	}

	dwellReferenceLink() {
		this.dwellLink( '.reference a' );
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

	open() {
		super.openTitle( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
