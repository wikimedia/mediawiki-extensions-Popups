'use strict';

const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	Util = require( 'wdio-mediawiki/Util' ),
	TEST_PAGE_POPUPS_TITLE = 'Page popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_LINK_SELECTOR = '.mw-body-content ul a',
	POPUPS_MODULE_NAME = 'ext.popups.main';

async function pageExists( title ) {
	const bot = await Api.bot();
	const response = await bot.read( title );
	return response.query.pages[ '-1' ] === undefined;
}

async function makePage( title, path ) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const content = fs.readFileSync( path, 'utf-8' );
	const bot = await Api.bot();
	await bot.edit( title, content );
}

class PopupsPage extends Page {
	get pagePopupsSelector() {
		return $( '.mwe-popups-type-page' );
	}

	async setupPagePreviews() {
		return browser.call( async () => {
			const path = `${ __dirname }/../fixtures/`;
			const exists = await pageExists( TEST_PAGE_POPUPS_TITLE );
			// Only make the pages if they do not exist.
			// This allows us to setup the pages in beta cluster differently,
			// allowing us to workaround issues like T400694.
			if ( !exists ) {
				await makePage( `${ TEST_PAGE_POPUPS_TITLE } 2`, `${ path }test_page_2.wikitext` );
				await makePage( TEST_PAGE_POPUPS_TITLE, `${ path }test_page.wikitext` );
			}
		} );
	}

	async ready() {
		await Util.waitForModuleState( POPUPS_MODULE_NAME );
	}

	async abandonLink() {
		return $( '#content h1' ).moveTo();
	}

	async dwellLink( selector, doesNotTriggerPreview ) {
		await $( selector ).moveTo();
		if ( !doesNotTriggerPreview ) {
			await $( POPUPS_SELECTOR ).waitForExist();
		} else {
			// eslint-disable-next-line wdio/no-pause
			await browser.pause( 1000 );
		}
	}

	async dwellPageLink() {
		await this.dwellLink( PAGE_POPUPS_LINK_SELECTOR );
	}

	async dwellPageFragment() {
		await this.dwellLink( '[href="#section"]', true );
	}

	async hoverPageLink() {
		await $( PAGE_POPUPS_LINK_SELECTOR ).moveTo();
	}

	async openPagePopupsTest() {
		return super.openTitle( TEST_PAGE_POPUPS_TITLE );
	}

}
module.exports = new PopupsPage();
