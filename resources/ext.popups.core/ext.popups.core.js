( function ( $, mw ) {
	'use strict';
	var previewCountStorageKey = 'ext.popups.core.previewCount',
		popupsEnabledStorageKey = 'mwe-popups-enabled';

	/**
	 * @class mw.popups
	 * @singleton
	 */
	mw.popups = {};

	/**
	 * The API object used for all this extension's requests
	 * @property {Object} api
	 */
	mw.popups.api = new mw.Api();

	/**
	 * Whether the page is being scrolled.
	 * @property {boolean} scrolled
	 */
	mw.popups.scrolled = false;

	/**
	 * Temporarily remove the title attribute of a link so that
	 * the tooltip doesn't show up alongside the Hovercard.
	 *
	 * @method removeTooltip
	 * @param {jQuery.Object} $link link from which to strip title
	 */
	mw.popups.removeTooltip = function ( $link ) {
		// We shouldn't empty the title attribute of links that
		// can't have Hovercards, ie. TextExtracts didn't return
		// anything. It's set in the article.init after attempting
		// to make an API request.
		if (
			$link.data( 'dont-empty-title' ) !== true &&
			$link.filter( '[title]:not([title=""])' ).length
		) {
			$link
				.data( 'title', $link.attr( 'title' ) )
				.attr( 'title', '' );
		}
	};

	/**
	 * Restore previously-removed title attribute.
	 *
	 * @method restoreTooltip
	 * @param {jQuery.Object} $link link to which to restore title
	 */
	mw.popups.restoreTooltip = function ( $link ) {
		$link.attr( 'title', $link.data( 'title' ) );
	};

	/**
	 * Register a hover event that may render a popup on an appropriate link.
	 *
	 * @method setupTriggers
	 * @param {jQuery.Object} $elements to bind events to
	 * @param {string} events to bind to
	 */
	mw.popups.setupTriggers = function ( $elements, events ) {
		$elements.on( events, function ( event ) {
			if ( mw.popups.scrolled ) {
				return;
			}

			mw.popups.render.render( $( this ), event, mw.popups.getRandomToken() );
		} );
	};

	/**
	 * Get action based on click event
	 *
	 * @method getAction
	 * @param {Object} event
	 * @return {string}
	 */
	mw.popups.getAction = function ( event ) {
		if ( event.which === 2 ) { // middle click
			return 'opened in new tab';
		} else if ( event.which === 1 ) {
			if ( event.ctrlKey || event.metaKey ) {
				return 'opened in new tab';
			} else if ( event.shiftKey ) {
				return 'opened in new window';
			} else {
				return 'opened in same tab';
			}
		}
	};

	/**
	 * Get a random token.
	 * Append the current timestamp to make the return value more unique.
	 *
	 * @return {string}
	 */
	mw.popups.getRandomToken = function () {
		return mw.user.generateRandomSessionId() + Math.round( mw.now() ).toString();
	};

	/**
	 * Return edit count bucket based on the number of edits.
	 * The returned value is "unknown" is `window.localStorage` is not supported.
	 *
	 * @return {string}
	 */
	mw.popups.getPreviewCountBucket = function () {
		var bucket,
			previewCount = mw.storage.get( previewCountStorageKey );

		// no support for localStorage
		if ( previewCount === false ) {
			return 'unknown';
		}

		// Fall back to 0 if this is the first time.
		previewCount = parseInt( previewCount || 0, 10 );

		if ( previewCount === 0 ) {
			bucket = '0';
		} else if ( previewCount >= 1 && previewCount <= 4 ) {
			bucket = '1-4';
		} else if ( previewCount >= 5 && previewCount <= 20 ) {
			bucket = '5-20';
		} else if ( previewCount >= 21 ) {
			bucket = '21+';
		}

		return bucket + ' previews';
	};

	/**
	 * Increment the preview count and save it to localStorage.
	 */
	mw.popups.incrementPreviewCount = function () {
		var previewCount = parseInt( mw.storage.get( previewCountStorageKey ) || 0, 10 );

		mw.storage.set( previewCountStorageKey, ( previewCount + 1 ).toString() );
	};

} )( jQuery, mediaWiki );
