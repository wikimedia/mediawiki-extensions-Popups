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
	 * List of classes of which links are ignored
	 * @property {Array} IGNORE_CLASSES
	 */
	mw.popups.IGNORE_CLASSES = [
		'.extiw',
		'.image',
		'.new',
		'.internal',
		'.external',
		'.oo-ui-buttonedElement-button',
		'.cancelLink a'
	];

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
	 * Given an href string for the local wiki, return the title, or undefined if
	 * the link is external, has extra query parameters, or contains no title.
	 *
	 * Note that the returned title is not sanitized (may contain underscores).
	 *
	 * @param {string} href
	 * @return {string|undefined}
	 */
	mw.popups.getTitle = function ( href ) {
		var title, titleRegex, matches, linkHref;

		// Skip every URI that mw.Uri cannot parse
		try {
			linkHref = new mw.Uri( href );
		} catch ( e ) {
			return undefined;
		}

		// External links
		if ( linkHref.host !== location.hostname ) {
			return undefined;
		}

		if ( linkHref.query.hasOwnProperty( 'title' ) ) {
			// linkHref is not a pretty URL, e.g. /w/index.php?title=Foo

			title = linkHref.query.title;
			// Return undefined if there are query parameters other than title
			delete linkHref.query.title;
			return $.isEmptyObject( linkHref.query ) ? title : undefined;
		} else {
			// linkHref is a pretty URL, e.g. /wiki/Foo

			// Return undefined if there are any query parameters
			if ( !$.isEmptyObject( linkHref.query ) ) {
				return undefined;
			}
			titleRegex = new RegExp( mw.RegExp.escape( mw.config.get( 'wgArticlePath' ) )
				.replace( '\\$1', '(.+)' ) );
			matches = titleRegex.exec( linkHref.path );
			return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
		}
	};

	/**
	 * Returns links that can have Popups
	 *
	 * @method selectPopupElements
	 */
	mw.popups.selectPopupElements = function () {
		var contentNamespaces = mw.config.get( 'wgContentNamespaces' );
		return mw.popups.$content
			.find( 'a[href][title]:not(' + mw.popups.IGNORE_CLASSES.join( ', ' ) + ')' )
			.filter( function () {
				var title,
					titleText = mw.popups.getTitle( this.href );
				if ( !titleText ) {
					return false;
				}
				// Is titleText in a content namespace?
				title = mw.Title.newFromText( titleText );
				return title && contentNamespaces.indexOf( title.namespace ) !== -1;
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

	/**
	 * Save the popups enabled state via device storage
	 *
	 * @param {boolean} isEnabled
	 */
	mw.popups.saveEnabledState = function ( isEnabled ) {
		mw.storage.set( popupsEnabledStorageKey, isEnabled ? '1' : '0' );
	};

	/**
	 * Retrieve the popups enabled state via device storage or 'wgPopupsExperiment'
	 * config variable.
	 * If the experiment isn't running, then continue to enable Popups
	 * by default during initialisation. In this case the return value
	 * defaults to `true` if the setting hasn't been saved before.
	 *
	 * @return {boolean}
	 */
	mw.popups.getEnabledState = function () {
		if ( !mw.config.get( 'wgPopupsExperiment', false ) ) {
			return mw.storage.get( popupsEnabledStorageKey ) !== '0';
		} else {
			return this.isUserInCondition();
		}
	};

	/**
	 * @ignore
	 */
	function getToken() {
		var key = 'PopupsExperimentID',
			id = mw.storage.get( key );

		if ( !id ) {
			id = mw.user.generateRandomSessionId();

			mw.storage.set( key, id );
		}

		return id;
	}

	/**
	 * Has the user previously enabled Popups by clicking "Enable previews" in the
	 * footer menu?
	 *
	 * @return {boolean}
	 * @ignore
	 */
	function hasUserEnabledFeature() {
		var value = mw.storage.get( 'mwe-popups-enabled' );

		return Boolean( value ) && value !== '0';
	}

	/**
	 * Has the user previously disabled Popups by clicking "Disable previews" in the settings
	 * overlay?
	 *
	 * @return {boolean}
	 * @ignore
	 */
	function hasUserDisabledFeature() {
		return mw.storage.get( 'mwe-popups-enabled' ) === '0';
	}

	/**
	 * Gets whether or not the user has Popups enabled, i.e. whether they are in the experiment
	 * condition.
	 *
	 * The user is in the experiment condition if:
	 * * they've enabled Popups by click "Enable previews" in the footer menu, or
	 * * they've enabled Popups as a beta feature, or
	 * * they aren't in the control bucket of the experiment
	 *
	 * N.B. that the user isn't entered into the experiment, i.e. they aren't assigned or a bucket,
	 * if the experiment isn't configured.
	 *
	 * @return {boolean}
	 * @ignore
	 */
	mw.popups.isUserInCondition = function isUserInCondition() {
		var config = mw.config.get( 'wgPopupsExperimentConfig' );

		// The first two tests deal with whether the user has /explicitly/ enable or disabled via its
		// settings.
		if ( hasUserEnabledFeature() ) {
			return true;
		}

		if ( hasUserDisabledFeature() ) {
			return false;
		}

		if ( mw.user.isAnon() ) {
			if ( !config ) {
				return false;
			}

			// FIXME: mw.experiments should expose the CONTROL_BUCKET constant, e.g.
			// `mw.experiments.CONTROL_BUCKET`.
			return mw.experiments.getBucket( config, getToken() ) !== 'control';
		} else {
			// Logged in users are in condition depending on the beta feature flag
			// instead of bucketing
			return mw.config.get( 'wgPopupsExperimentIsBetaFeatureEnabled', false );
		}
	};

} )( jQuery, mediaWiki );
