'use strict';

const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	Util = require( 'wdio-mediawiki/Util' ),
	TEST_PAGE_POPUPS_TITLE = 'Page popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_SELECTOR = '.mwe-popups-type-page',
	PAGE_POPUPS_LINK_SELECTOR = '.mw-body-content ul a',
	POPUPS_MODULE_NAME = 'ext.popups.main';

async function makePage( title, path ) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const content = fs.readFileSync( path, 'utf-8' );
	const bot = await Api.bot();
	await bot.edit( title, content );
}
class PopupsPage extends Page {
	async setupPagePreviews() {
		return browser.call( async () => {
			const path = `${ __dirname }/../fixtures/`;
			await makePage( `${ TEST_PAGE_POPUPS_TITLE } 2`, `${ path }test_page_2.wikitext` );
			await makePage( TEST_PAGE_POPUPS_TITLE, `${ path }test_page.wikitext` );
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

	async doNotSeePreview( selector ) {
		return browser.waitUntil( async () => !( await $( selector ).isDisplayed() ) );
	}

	async doNotSeePagePreview() {
		return this.doNotSeePreview( PAGE_POPUPS_SELECTOR );
	}

	async seePreview( selector ) {
		return await $( selector ).isDisplayed();
	}

	async seePagePreview() {
		return await this.seePreview( PAGE_POPUPS_SELECTOR );
	}

	async openPagePopupsTest() {
		return super.openTitle( TEST_PAGE_POPUPS_TITLE );
	}

}
module.exports = new PopupsPage();
