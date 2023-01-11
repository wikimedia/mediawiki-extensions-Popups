'use strict';

/* global document */

const
	fs = require( 'fs' ),
	Api = require( 'wdio-mediawiki/Api' ),
	Page = require( 'wdio-mediawiki/Page' ),
	Util = require( 'wdio-mediawiki/Util' ),
	TEST_PAGE_TITLE = 'Popups test page',
	POPUPS_SELECTOR = '.mwe-popups',
	PAGE_POPUPS_SELECTOR = '.mwe-popups-type-page',
	PAGE_POPUPS_LINK_SELECTOR = '.mw-body-content ul a',
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
	} ).then( async ( content ) => {
		const bot = await Api.bot();
		await bot.edit( title, content );
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

	ready() {
		Util.waitForModuleState( POPUPS_MODULE_NAME );
	}

	shouldUseReferencePopupsBetaFeature( shouldUse ) {
		Util.waitForModuleState( 'mediawiki.base' );
		return browser.execute( function ( use ) {
			return mw.loader.using( 'mediawiki.api' ).then( function () {
				return new mw.Api().saveOptions( {
					// TODO: Remove the first option when all Beta code is gone
					popupsreferencepreviews: use ? '1' : '0',
					'popups-reference-previews': use ? '1' : '0'
				} );
			} );
		}, shouldUse );
	}

	hasReferencePopupsEnabled() {
		// TODO Remove or adjust when not in Beta any more
		return browser.execute( () => mw.config.get( 'wgPopupsReferencePreviews' ) );
	}

	abandonLink() {
		$( '#content h1' ).moveTo();
	}

	dwellLink( selector, doesNotTriggerPreview ) {
		$( selector ).moveTo();
		if ( !doesNotTriggerPreview ) {
			$( POPUPS_SELECTOR ).waitForExist();
		} else {
			browser.pause( 1000 );
		}
	}

	dwellPageLink() {
		this.dwellLink( PAGE_POPUPS_LINK_SELECTOR );
	}

	dwellPageFragment() {
		this.dwellLink( '[href="#section"]', true );
	}

	hoverPageLink() {
		$( PAGE_POPUPS_LINK_SELECTOR ).moveTo();
	}

	dwellReferenceLink( num ) {
		this.dwellLink( `.reference:nth-of-type(${num}) a` );
	}

	dwellReferenceInceptionLink() {
		$( REFERENCE_INCEPTION_LINK_SELECTOR ).moveTo();
		browser.pause( 1000 );
	}

	doNotSeePreview( selector ) {
		return browser.waitUntil( () => !$( selector ).isDisplayed() );
	}

	doNotSeePagePreview() {
		return this.doNotSeePreview( PAGE_POPUPS_SELECTOR );
	}

	doNotSeeReferencePreview() {
		return this.doNotSeePreview( REFERENCE_POPUPS_SELECTOR );
	}

	seePreview( selector ) {
		return $( selector ).isDisplayed();
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
			const el = document.querySelector( '.mwe-popups-extract .mwe-popups-scroll' );
			return el.scrollHeight > el.offsetHeight;
		} );
	}

	seeFadeoutOnReferenceText() {
		return $( '.mwe-popups-fade-out' ).isExisting();
	}

	open() {
		super.openTitle( TEST_PAGE_TITLE );
	}

}
module.exports = new PopupsPage();
