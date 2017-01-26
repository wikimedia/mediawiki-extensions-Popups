/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	( function ( mw ) {
		mw.popups.changeListeners = {
			footerLink: __webpack_require__( 1 ),
			eventLogging: __webpack_require__( 2 ),
			linkTitle: __webpack_require__( 3 ),
			render: __webpack_require__( 4 ),
			settings: __webpack_require__( 5 ),
			syncUserSettings: __webpack_require__( 6 )
		};
	}( mediaWiki ) );


/***/ },
/* 1 */
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		/**
		 * Creates the link element and appends it to the footer element.
		 *
		 * The following elements are considered to be the footer element (highest
		 * priority to lowest):
		 *
		 * # `#footer-places`
		 * # `#f-list`
		 * # The parent element of `#footer li`, which is either an `ol` or `ul`.
		 *
		 * @return {jQuery} The link element
		 */
		function createFooterLink() {
			var $link = $( '<li>' ).append(
					$( '<a>' )
						.attr( 'href', '#' )
						.text( mw.message( 'popups-settings-enable' ).text() )
				),
				$footer;
	
			// As yet, we don't know whether the link should be visible.
			$link.hide();
	
			// From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js,
			// which was written by Yair rand <https://en.wikipedia.org/wiki/User:Yair_rand>.
			$footer = $( '#footer-places, #f-list' );
	
			if ( $footer.length === 0 ) {
				$footer = $( '#footer li' ).parent();
			}
	
			$footer.append( $link );
	
			return $link;
		}
	
		/**
		 * Creates an instance of the footer link change listener.
		 *
		 * The change listener covers the following behaviour:
		 *
		 * * The "Enable previews" link (the "link") is appended to the footer menu
		 *   (see `createFooterLink` above).
		 * * When Page Previews are disabled, then the link is shown; otherwise, the
		 *   link is hidden.
		 * * When the user clicks the link, then the `showSettings` bound action
		 *   creator is called.
		 *
		 * @param {Object} boundActions
		 * @return {ext.popups.ChangeListener}
		 */
		module.exports = function ( boundActions ) {
			var $footerLink;
	
			return function ( prevState, state ) {
				if ( $footerLink === undefined ) {
					$footerLink = createFooterLink();
					$footerLink.click( function ( e ) {
						e.preventDefault();
						boundActions.showSettings();
					} );
				}
	
				if ( state.settings.shouldShowFooterLink ) {
					$footerLink.show();
				} else {
					$footerLink.hide();
				}
			};
		};
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 2 */
/***/ function(module, exports) {

	( function ( $ ) {
	
		/**
		 * Creates an instance of the event logging change listener.
		 *
		 * When an event is enqueued to be logged it'll be logged using the schema.
		 * Since it's the responsibility of EventLogging (and the UA) to deliver
		 * logged events, the `EVENT_LOGGED` is immediately dispatched rather than
		 * waiting for some indicator of completion.
		 *
		 * @param {Object} boundActions
		 * @param {mw.eventLog.Schema} schema
		 * @return {ext.popups.ChangeListener}
		 */
		module.exports = function ( boundActions, schema ) {
			return function ( _, state ) {
				var eventLogging = state.eventLogging,
					event = eventLogging.event;
	
				if ( event ) {
					schema.log( $.extend( true, {}, eventLogging.baseData, event ) );
	
					boundActions.eventLogged();
				}
			};
		};
	
	}( jQuery ) );


/***/ },
/* 3 */
/***/ function(module, exports) {

	( function ( $ ) {
	
		/**
		 * Creates an instance of the link title change listener.
		 *
		 * While the user dwells on a link, then it becomes the active link. The
		 * change listener will remove a link's `title` attribute while it's the
		 * active link.
		 *
		 * @return {ext.popups.ChangeListener}
		 */
		module.exports = function () {
			var title;
	
			/**
			 * Destroys the title attribute of the element, storing its value in local
			 * state so that it can be restored later (see `restoreTitleAttr`).
			 *
			 * @param {Element} el
			 */
			function destroyTitleAttr( el ) {
				var $el = $( el );
	
				// Has the user dwelled on a link? If we've already removed its title
				// attribute, then NOOP.
				if ( title ) {
					return;
				}
	
				title = $el.attr( 'title' );
	
				$el.attr( 'title', '' );
			}
	
			/**
			 * Restores the title attribute of the element.
			 *
			 * @param {Element} el
			 */
			function restoreTitleAttr( el ) {
				$( el ).attr( 'title', title );
	
				title = undefined;
			}
	
			return function ( prevState, state ) {
				var hasPrevActiveLink = prevState && prevState.preview.activeLink;
	
				if ( hasPrevActiveLink ) {
	
					// Has the user dwelled on a link immediately after abandoning another
					// (remembering that the ABANDON_END action is delayed by
					// ~10e2 ms).
					if ( prevState.preview.activeLink !== state.preview.activeLink ) {
						restoreTitleAttr( prevState.preview.activeLink );
					}
				}
	
				if ( state.preview.activeLink ) {
					destroyTitleAttr( state.preview.activeLink );
				}
			};
		};
	
	}( jQuery ) );


/***/ },
/* 4 */
/***/ function(module, exports) {

	( function ( mw ) {
	
		/**
		 * Creates an instance of the render change listener.
		 *
		 * @param {ext.popups.PreviewBehavior} previewBehavior
		 * @return {ext.popups.ChangeListener}
		 */
		module.exports = function ( previewBehavior ) {
			var preview;
	
			return function ( prevState, state ) {
				if ( state.preview.shouldShow && !preview ) {
					preview = mw.popups.renderer.render( state.preview.fetchResponse );
					preview.show( state.preview.activeEvent, previewBehavior );
				} else if ( !state.preview.shouldShow && preview ) {
					preview.hide();
					preview = undefined;
				}
			};
		};
	
	}( mediaWiki ) );


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Creates an instance of the settings change listener.
	 *
	 * @param {Object} boundActions
	 * @param {Object} render function that renders a jQuery el with the settings
	 * @return {ext.popups.ChangeListener}
	 */
	module.exports = function ( boundActions, render ) {
		var settings;
	
		return function ( prevState, state ) {
			if ( !prevState ) {
				// Nothing to do on initialization
				return;
			}
	
			// Update global modal visibility
			if (
				prevState.settings.shouldShow === false &&
				state.settings.shouldShow === true
			) {
				// Lazily instantiate the settings UI
				if ( !settings ) {
					settings = render( boundActions );
					settings.appendTo( document.body );
				}
	
				// Update the UI settings with the current settings
				settings.setEnabled( state.preview.enabled );
	
				settings.show();
			} else if (
				prevState.settings.shouldShow === true &&
				state.settings.shouldShow === false
			) {
				settings.hide();
			}
	
			// Update help visibility
			if ( prevState.settings.showHelp !== state.settings.showHelp ) {
				settings.toggleHelp( state.settings.showHelp );
			}
		};
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Creates an instance of the user settings sync change listener.
	 *
	 * This change listener syncs certain parts of the state tree to user
	 * settings when they change.
	 *
	 * Used for:
	 *
	 * * Enabled state: If the previews are enabled or disabled.
	 * * Preview count: When the user dwells on a link for long enough that
	 *   a preview is shown, then their preview count will be incremented (see
	 *   `mw.popups.reducers.eventLogging`, and is persisted to local storage.
	 *
	 * @param {ext.popups.UserSettings} userSettings
	 * @return {ext.popups.ChangeListener}
	 */
	module.exports = function ( userSettings ) {
	
		return function ( prevState, state ) {
	
			syncIfChanged(
				prevState, state, 'eventLogging', 'previewCount',
				userSettings.setPreviewCount
			);
			syncIfChanged(
				prevState, state, 'preview', 'enabled',
				userSettings.setIsEnabled
			);
	
		};
	};
	
	/**
	 * Given a state tree, reducer and property, safely return the value of the
	 * property if the reducer and property exist
	 * @param {Object} state tree
	 * @param {String} reducer key to access on the state tree
	 * @param {String} prop key to access on the reducer key of the state tree
	 * @return {*}
	 */
	function get( state, reducer, prop ) {
		return state[ reducer ] && state[ reducer ][ prop ];
	}
	
	/**
	 * Calls a sync function if the property prop on the property reducer on
	 * the state trees has changed value.
	 * @param {Object} prevState
	 * @param {Object} state
	 * @param {String} reducer key to access on the state tree
	 * @param {String} prop key to access on the reducer key of the state tree
	 * @param {Function} sync function to be called with the newest value if
	 * changed
	 */
	function syncIfChanged( prevState, state, reducer, prop, sync ) {
		var current = get( state, reducer, prop );
		if ( prevState && ( get( prevState, reducer, prop ) !== current ) ) {
			sync( current );
		}
	}


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map