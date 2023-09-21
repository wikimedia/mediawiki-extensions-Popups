'use strict';

/* global document */

const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	Util = require( 'wdio-mediawiki/Util' ),
	TEST_PAGE_POPUPS_TITLE = 'Page popups test page',
	TEST_REFERENCE_POPUPS_TITLE = 'Reference popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_SELECTOR = '.mwe-popups-type-page',
	PAGE_POPUPS_LINK_SELECTOR = '.mw-body-content ul a',
	REFERENCE_POPUPS_SELECTOR = '.mwe-popups-type-reference',
	REFERENCE_INCEPTION_LINK_SELECTOR = '.mwe-popups-type-reference .reference a',
	POPUPS_MODULE_NAME = 'ext.popups.main';

async function makePage( title, path ) {
	const content = fs.readFileSync( path, 'utf-8' );
	const bot = await Api.bot();
	await bot.edit( title, content );
}
class PopupsPage extends Page {
	async setupPagePreviews() {
		return browser.call( async () => {
			const path = `${__dirname}/../fixtures/`;
			await makePage( `${TEST_PAGE_POPUPS_TITLE} 2`, `${path}test_page_2.wikitext` );
			await makePage( TEST_PAGE_POPUPS_TITLE, `${path}test_page.wikitext` );
		} );
	}

	async setupReferencePreviews() {
		return browser.call( async () => {
			const path = `${__dirname}/../fixtures/`;
			await makePage( TEST_REFERENCE_POPUPS_TITLE, `${path}test_page.wikitext` );
		} );
	}

	async ready() {
		await Util.waitForModuleState( POPUPS_MODULE_NAME );
	}

	async shouldUseReferencePopupsBetaFeature() {
		await Util.waitForModuleState( 'mediawiki.base' );
		await browser.execute( function () {
			return mw.loader.using( 'mediawiki.api' ).then( function () {
				return new mw.Api().saveOptions( {
					// TODO: Remove the first option when all Beta code is gone
					popupsreferencepreviews: '1',
					'popups-reference-previews': '1'
				} );
			} );
		} );
	}

	async hasReferencePopupsEnabled() {
		// TODO Remove or adjust when not in Beta any more
		return browser.execute( () => mw.config.get( 'wgPopupsReferencePreviews' ) );
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

	async dwellReferenceLink( id ) {
		await this.dwellLink( `#${id} a` );
	}

	async dwellReferenceInceptionLink() {
		await $( REFERENCE_INCEPTION_LINK_SELECTOR ).moveTo();
		await browser.pause( 1000 );
	}

	async doNotSeePreview( selector ) {
		return browser.waitUntil( async () => !( await $( selector ).isDisplayed() ) );
	}

	async doNotSeePagePreview() {
		return this.doNotSeePreview( PAGE_POPUPS_SELECTOR );
	}

	async doNotSeeReferencePreview() {
		return this.doNotSeePreview( REFERENCE_POPUPS_SELECTOR );
	}

	async seePreview( selector ) {
		return await $( selector ).isDisplayed();
	}

	async seePagePreview() {
		return await this.seePreview( PAGE_POPUPS_SELECTOR );
	}

	async seeReferencePreview() {
		return await this.seePreview( REFERENCE_POPUPS_SELECTOR );
	}

	async seeReferenceInceptionPreview() {
		return await this.seePreview( REFERENCE_INCEPTION_LINK_SELECTOR );
	}

	async seeScrollableReferencePreview() {
		return browser.execute( () => {
			const el = document.querySelector( '.mwe-popups-extract .mwe-popups-scroll' );
			return el.scrollHeight > el.offsetHeight;
		} );
	}

	async seeFadeoutOnReferenceText() {
		return $( '.mwe-popups-fade-out' ).isExisting();
	}

	async openPagePopupsTest() {
		return super.openTitle( TEST_PAGE_POPUPS_TITLE );
	}

	async openReferencePopupsTest() {
		return super.openTitle( TEST_REFERENCE_POPUPS_TITLE );
	}

}
module.exports = new PopupsPage();
