const
	fs = require( 'fs' ),
	EditPage = require( '../../../../../tests/selenium/pageobjects/edit.page' ),
	Page = require( '../../../../../tests/selenium/pageobjects/page' ),
	TEST_PAGE_TITLE = 'Popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	POPUPS_MODULE_NAME = 'ext.popups.main';

class PopupsPage extends Page {
	setup() {
		browser.call( () => {
			return new Promise( ( resolve ) => {
				fs.readFile( `${ __dirname }/../fixtures/test_page.wikitext`, 'utf-8', ( err, content ) => {
					if ( err ) {
						throw err;
					}
					resolve( content );
				} );
			} ).then( ( content ) => {
				return EditPage.apiEdit( TEST_PAGE_TITLE, content );
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

	abandonLink() {
		browser.moveToObject( '#content h1' );
	}

	dwellLink() {
		const PAUSE = 1000;
		this.ready();
		browser.pause( PAUSE );
		this.abandonLink();
		browser.pause( PAUSE );
		browser.moveToObject( '#content ul a' );
		browser.waitForExist( POPUPS_SELECTOR );
	}

	doNotSeePreview() {
		return browser.waitUntil( () => !browser.isVisible( POPUPS_SELECTOR ) );
	}

	seePreview() {
		return browser.isVisible( POPUPS_SELECTOR );
	}

	open() {
		super.open( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
