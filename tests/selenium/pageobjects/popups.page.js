'use strict';
const Page = require( '../../../../../tests/selenium/pageobjects/page' );
const TEST_PAGE_TITLE = 'Popups test page';

const POPUPS_SELECTOR = '.mwe-popups';
const POPUPS_MODULE_NAME = 'ext.popups';

const fs = require('fs');
const EditPage = require( '../../../../../tests/selenium/pageobjects/edit.page' );


class PopupsPage extends Page {
	setup() {
		browser.call( function () {
			return new Promise( function ( resolve ) {
				fs.readFile(`${__dirname}/../fixtures/test_page.wikitext`, 'utf-8', function (err, content) {
					if ( err ) {
						throw err;
					}
					resolve( content );
				} );
			} ).then( function ( content ) {
				return EditPage.apiEdit( TEST_PAGE_TITLE, content );
			} );
		} );
	}

	resourceLoaderModuleStatus( moduleName, moduleStatus, errMsg ) {
		return browser.waitUntil( function () {
			return browser.execute( function ( module ) {
				return mw && mw.loader && mw.loader.getState( module.name ) === module.status;
			}, { status: moduleStatus, name: moduleName } );
		}, 10000, errMsg );
	}

	isReady() {
		return this.resourceLoaderModuleStatus( POPUPS_MODULE_NAME, 'ready', 'Page previews did not load' );
	}

	abandonLink() {
		browser.moveToObject( '#content h1' );
	}

	dwellLink() {
		this.isReady();
		browser.moveToObject( '#content h1' );
		browser.moveToObject( '#content ul a' );
		browser.waitForExist( POPUPS_SELECTOR );
	}

	doNotSeePreview() {
		return browser.waitUntil( function () {
			return !browser.isVisible( POPUPS_SELECTOR );
		} );
	}

	seePreview() {
		return browser.isVisible( POPUPS_SELECTOR );
	}

	open() {
		super.open( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
