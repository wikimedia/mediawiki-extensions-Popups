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

	( function ( mw, popups, Redux, ReduxThunk, $ ) {
		var BLACKLISTED_LINKS = [
				'.extiw',
				'.image',
				'.new',
				'.internal',
				'.external',
				'.oo-ui-buttonedElement-button',
				'.cancelLink a'
			],
			constants = __webpack_require__( 1 );
	
		/**
		 * Creates a gateway with sensible values for the dependencies.
		 *
		 * @param {mw.Map} config
		 * @return {ext.popups.Gateway}
		 */
		function createGateway( config ) {
			if ( config.get( 'wgPopupsAPIUseRESTBase' ) ) {
				return popups.gateway.createRESTBaseGateway( $.ajax, constants );
			}
			return popups.gateway.createMediaWikiApiGateway( new mw.Api(), constants );
		}
	
		/**
		 * Subscribes the registered change listeners to the
		 * [store](http://redux.js.org/docs/api/Store.html#store).
		 *
		 * Change listeners are registered by setting a property on
		 * `popups.changeListeners`.
		 *
		 * @param {Redux.Store} store
		 * @param {Object} actions
		 * @param {mw.eventLog.Schema} schema
		 * @param {ext.popups.UserSettings} userSettings
		 * @param {Function} settingsDialog
		 * @param {ext.popups.PreviewBehavior} previewBehavior
		 */
		function registerChangeListeners( store, actions, schema, userSettings, settingsDialog, previewBehavior ) {
	
			// Sugar.
			var changeListeners = popups.changeListeners,
				registerChangeListener = popups.registerChangeListener;
	
			registerChangeListener( store, changeListeners.footerLink( actions ) );
			registerChangeListener( store, changeListeners.linkTitle() );
			registerChangeListener( store, changeListeners.render( previewBehavior ) );
			registerChangeListener( store, changeListeners.eventLogging( actions, schema ) );
			registerChangeListener( store, changeListeners.syncUserSettings( userSettings ) );
			registerChangeListener( store, changeListeners.settings( actions, settingsDialog ) );
		}
	
		/**
		 * Binds the actions (or "action creators") to the
		 * [store](http://redux.js.org/docs/api/Store.html#store).
		 *
		 * @param {Redux.Store} store
		 * @return {Object}
		 */
		function createBoundActions( store ) {
			return Redux.bindActionCreators( popups.actions, store.dispatch );
		}
	
		/**
		 * Creates the reducer for all actions.
		 *
		 * @return {Redux.Reducer}
		 */
		function createRootReducer() {
			return Redux.combineReducers( popups.reducers );
		}
	
		/*
		 * Initialize the application by:
		 * 1. Creating the state store
		 * 2. Binding the actions to such store
		 * 3. Trigger the boot action to bootstrap the system
		 * 4. When the page content is ready:
		 *   - Setup `checkin` actions
		 *   - Process the eligible links for page previews
		 *   - Initialize the renderer
		 *   - Bind hover and click events to the eligible links to trigger actions
		 */
		mw.requestIdleCallback( function () {
			var compose = Redux.compose,
				store,
				actions,
	
				// So-called "services".
				generateToken = mw.user.generateRandomSessionId,
				gateway = createGateway( mw.config ),
				userSettings,
				settingsDialog,
				isEnabled,
				schema,
				previewBehavior;
	
			userSettings = popups.createUserSettings( mw.storage );
			settingsDialog = popups.createSettingsDialogRenderer();
			schema = popups.createSchema( mw.config, window );
	
			isEnabled = popups.isEnabled( mw.user, userSettings, mw.config );
	
			// If debug mode is enabled, then enable Redux DevTools.
			if ( mw.config.get( 'debug' ) === true ) {
				// eslint-disable-next-line no-underscore-dangle
				compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
			}
	
			store = Redux.createStore(
				createRootReducer(),
				compose( Redux.applyMiddleware(
					ReduxThunk.default
				) )
			);
			actions = createBoundActions( store );
	
			previewBehavior = popups.createPreviewBehavior( mw.config, mw.user, actions );
	
			registerChangeListeners( store, actions, schema, userSettings, settingsDialog, previewBehavior );
	
			actions.boot(
				isEnabled,
				mw.user,
				userSettings,
				generateToken,
				mw.config
			);
	
			mw.hook( 'wikipage.content' ).add( function ( $container ) {
				var previewLinks =
					popups.processLinks(
						$container,
						BLACKLISTED_LINKS,
						mw.config
					);
	
				popups.checkin.setupActions( actions.checkin );
	
				popups.renderer.init();
	
				previewLinks
					.on( 'mouseover focus', function ( event ) {
						actions.linkDwell( this, event, gateway, generateToken );
					} )
					.on( 'mouseout blur', function () {
						actions.abandon( this );
					} )
					.on( 'click', function () {
						actions.linkClick( this );
					} );
	
			} );
		} );
	
		// FIXME: Currently needs to be exposed for testing purposes
		mw.popups = popups;
		window.Redux = Redux;
		window.ReduxThunk = ReduxThunk;
	}( mediaWiki, __webpack_require__( 2 ), __webpack_require__( 33 ), __webpack_require__( 55 ), jQuery ) );


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		THUMBNAIL_SIZE: 300 * $.bracketedDevicePixelRatio()
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		actions: __webpack_require__( 3 ),
		actionTypes: __webpack_require__( 4 ),
		changeListeners: __webpack_require__( 5 ),
		checkin: __webpack_require__( 14 ),
		counts: __webpack_require__( 16 ),
		createPreviewBehavior: __webpack_require__( 17 ),
		createUserSettings: __webpack_require__( 18 ),
		createSchema: __webpack_require__( 19 ),
		createSettingsDialogRenderer: __webpack_require__( 20 ),
		gateway: __webpack_require__( 21 ),
		isEnabled: __webpack_require__( 24 ),
		renderer: __webpack_require__( 10 ),
		pageVisibility: __webpack_require__( 15 ),
		preview: __webpack_require__( 25 ),
		processLinks: __webpack_require__( 26 ),
		registerChangeListener: __webpack_require__( 27 ),
		reducers: __webpack_require__( 28 ),
		wait: __webpack_require__( 11 )
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $ = jQuery,
		mw = window.mediaWiki,
		actions = {},
		types = __webpack_require__( 4 ),
		FETCH_START_DELAY = 50, // ms.
	
		// The delay after which a FETCH_END action should be dispatched.
		//
		// If the API endpoint responds faster than 500 ms (or, say, the API
		// response is served from the UA's cache), then we introduce a delay of
		// 300 - t to make the preview delay consistent to the user.
		FETCH_END_TARGET_DELAY = 500, // ms.
	
		ABANDON_END_DELAY = 300; // ms.
	
	/**
	 * Mixes in timing information to an action.
	 *
	 * Warning: the `baseAction` parameter is modified and returned.
	 *
	 * @param {Object} baseAction
	 * @return {Object}
	 */
	function timedAction( baseAction ) {
		baseAction.timestamp = mw.now();
	
		return baseAction;
	}
	
	/**
	 * Represents Page Previews booting.
	 *
	 * When a Redux store is created, the `@@INIT` action is immediately
	 * dispatched to it. To avoid overriding the term, we refer to booting rather
	 * than initializing.
	 *
	 * Page Previews persists critical pieces of information to local storage.
	 * Since reading from and writing to local storage are synchronous, Page
	 * Previews is booted when the browser is idle (using
	 * [`mw.requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
	 * so as not to impact latency-critical events.
	 *
	 * @param {Boolean} isEnabled See `mw.popups.isEnabled`
	 * @param {mw.user} user
	 * @param {ext.popups.UserSettings} userSettings
	 * @param {Function} generateToken
	 * @param {mw.Map} config The config of the MediaWiki client-side application,
	 *  i.e. `mw.config`
	 * @returns {Object}
	 */
	actions.boot = function (
		isEnabled,
		user,
		userSettings,
		generateToken,
		config
	) {
		var editCount = config.get( 'wgUserEditCount' ),
			previewCount = userSettings.getPreviewCount();
	
		return {
			type: types.BOOT,
			isEnabled: isEnabled,
			isNavPopupsEnabled: config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			sessionToken: user.sessionId(),
			pageToken: generateToken(),
			page: {
				title: config.get( 'wgTitle' ),
				namespaceID: config.get( 'wgNamespaceNumber' ),
				id: config.get( 'wgArticleId' )
			},
			user: {
				isAnon: user.isAnon(),
				editCount: editCount,
				previewCount: previewCount
			}
		};
	};
	
	/**
	 * How long has the user been actively reading the page?
	 * @param {number} time The number of seconds the user has seen the page
	 * @returns {{type: string, time: number}}
	 */
	actions.checkin = function ( time ) {
		return {
			type: types.CHECKIN,
			time: time
		};
	};
	
	/**
	 * Represents Page Previews fetching data via the gateway.
	 *
	 * @param {ext.popups.Gateway} gateway
	 * @param {Element} el
	 * @param {Date} started The time at which the interaction started.
	 * @return {Redux.Thunk}
	 */
	actions.fetch = function ( gateway, el, started ) {
		var title = $( el ).data( 'page-previews-title' );
	
		return function ( dispatch ) {
			dispatch( {
				type: types.FETCH_START,
				el: el,
				title: title
			} );
	
			gateway.getPageSummary( title )
				.fail( function () {
					dispatch( {
						type: types.FETCH_FAILED,
						el: el
					} );
				} )
				.done( function ( result ) {
					var now = mw.now(),
						delay;
	
					// If the API request has taken longer than the target delay, then
					// don't delay any further.
					delay = Math.max(
						FETCH_END_TARGET_DELAY - Math.round( now - started ),
						0
					);
	
					// FIXME: This needs to reference a global because the tests are
					// stubbing a global, so can't be required at the top at the moment.
					// When the tests are moved to common.js we should find a different way
					// of stubbing this wait
					mw.popups.wait( delay )
						.then( function () {
							dispatch( {
								type: types.FETCH_END,
								el: el,
								result: result
							} );
						} );
				} );
		};
	};
	
	/**
	 * Represents the user dwelling on a link, either by hovering over it with
	 * their mouse or by focussing it using their keyboard or an assistive device.
	 *
	 * @param {Element} el
	 * @param {Event} event
	 * @param {ext.popups.Gateway} gateway
	 * @param {Function} generateToken
	 * @return {Redux.Thunk}
	 */
	actions.linkDwell = function ( el, event, gateway, generateToken ) {
		var token = generateToken();
	
		return function ( dispatch, getState ) {
			var action = timedAction( {
				type: types.LINK_DWELL,
				el: el,
				event: event,
				token: token
			} );
	
			// Has the new generated token been accepted?
			function isNewInteraction() {
				return getState().preview.activeToken === token;
			}
	
			dispatch( action );
	
			if ( !isNewInteraction() ) {
				return;
			}
	
			// FIXME: This needs to reference a global because the tests are stubbing
			// a global, so can't be required at the top at the moment. When the tests
			// are moved to common.js we should find a different way of stubbing this
			// wait
			mw.popups.wait( FETCH_START_DELAY )
				.then( function () {
					var previewState = getState().preview;
	
					if ( previewState.enabled && isNewInteraction() ) {
						dispatch( actions.fetch( gateway, el, action.timestamp ) );
					}
				} );
		};
	};
	
	/**
	 * Represents the user abandoning a link, either by moving their mouse away
	 * from it or by shifting focus to another UI element using their keyboard or
	 * an assistive device, or abandoning a preview by moving their mouse away
	 * from it.
	 *
	 * @return {Redux.Thunk}
	 */
	actions.abandon = function () {
		return function ( dispatch, getState ) {
			var token = getState().preview.activeToken;
	
			dispatch( timedAction( {
				type: types.ABANDON_START,
				token: token
			} ) );
	
			// FIXME: This needs to reference a global because the tests are stubbing
			// a global, so can't be required at the top at the moment. When the tests
			// are moved to common.js we should find a different way of stubbing this
			// wait
			mw.popups.wait( ABANDON_END_DELAY )
				.then( function () {
					dispatch( {
						type: types.ABANDON_END,
						token: token
					} );
				} );
		};
	};
	
	/**
	 * Represents the user clicking on a link with their mouse, keyboard, or an
	 * assistive device.
	 *
	 * @param {Element} el
	 * @return {Object}
	 */
	actions.linkClick = function ( el ) {
		return timedAction( {
			type: types.LINK_CLICK,
			el: el
		} );
	};
	
	/**
	 * Represents the user dwelling on a preview with their mouse.
	 *
	 * @return {Object}
	 */
	actions.previewDwell = function () {
		return {
			type: types.PREVIEW_DWELL
		};
	};
	
	/**
	 * Represents a preview being shown to the user.
	 *
	 * This action is dispatched by the `mw.popups.changeListeners.render` change
	 * listener.
	 *
	 * @return {Object}
	 */
	actions.previewShow = function () {
		return timedAction( {
			type: types.PREVIEW_SHOW
		} );
	};
	
	/**
	 * Represents the user clicking either the "Enable previews" footer menu link,
	 * or the "cog" icon that's present on each preview.
	 *
	 * @return {Object}
	 */
	actions.showSettings = function () {
		return {
			type: types.SETTINGS_SHOW
		};
	};
	
	/**
	 * Represents the user closing the settings dialog and saving their settings.
	 *
	 * @return {Object}
	 */
	actions.hideSettings = function () {
		return {
			type: types.SETTINGS_HIDE
		};
	};
	
	/**
	 * Represents the user saving their settings.
	 *
	 * N.B. This action returns a Redux.Thunk not because it needs to perform
	 * asynchronous work, but because it needs to query the global state for the
	 * current enabled state. In order to keep the enabled state in a single
	 * place (the preview reducer), we query it and dispatch it as `wasEnabled`
	 * so that other reducers (like settings) can act on it without having to
	 * duplicate the `enabled` state locally.
	 * See doc/adr/0003-keep-enabled-state-only-in-preview-reducer.md for more
	 * details.
	 *
	 * @param {Boolean} enabled if previews are enabled or not
	 * @return {Redux.Thunk}
	 */
	actions.saveSettings = function ( enabled ) {
		return function ( dispatch, getState ) {
			dispatch( {
				type: types.SETTINGS_CHANGE,
				wasEnabled: getState().preview.enabled,
				enabled: enabled
			} );
		};
	};
	
	/**
	 * Represents the queued event being logged
	 * `mw.popups.changeListeners.eventLogging` change listener.
	 *
	 * @return {Object}
	 */
	actions.eventLogged = function () {
		return {
			type: types.EVENT_LOGGED
		};
	};
	
	module.exports = actions;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		BOOT: 'BOOT',
		CHECKIN: 'CHECKIN',
		LINK_DWELL: 'LINK_DWELL',
		ABANDON_START: 'ABANDON_START',
		ABANDON_END: 'ABANDON_END',
		LINK_CLICK: 'LINK_CLICK',
		FETCH_START: 'FETCH_START',
		FETCH_END: 'FETCH_END',
		FETCH_FAILED: 'FETCH_FAILED',
		PREVIEW_DWELL: 'PREVIEW_DWELL',
		PREVIEW_SHOW: 'PREVIEW_SHOW',
		PREVIEW_CLICK: 'PREVIEW_CLICK',
		SETTINGS_SHOW: 'SETTINGS_SHOW',
		SETTINGS_HIDE: 'SETTINGS_HIDE',
		SETTINGS_CHANGE: 'SETTINGS_CHANGE',
		EVENT_LOGGED: 'EVENT_LOGGED'
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		footerLink: __webpack_require__( 6 ),
		eventLogging: __webpack_require__( 7 ),
		linkTitle: __webpack_require__( 8 ),
		render: __webpack_require__( 9 ),
		settings: __webpack_require__( 12 ),
		syncUserSettings: __webpack_require__( 13 )
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	var mw = window.mediaWiki,
		$ = jQuery;
	
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	var $ = jQuery;
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	var $ = jQuery;
	
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var renderer = __webpack_require__( 10 );
	
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
				preview = renderer.render( state.preview.fetchResponse );
				preview.show( state.preview.activeEvent, previewBehavior );
			} else if ( !state.preview.shouldShow && preview ) {
				preview.hide();
				preview = undefined;
			}
		};
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	( function ( mw, $ ) {
	
		var isSafari = navigator.userAgent.match( /Safari/ ) !== null,
			wait = __webpack_require__( 11 ),
			SIZES = {
				portraitImage: {
					h: 250, // Exact height
					w: 203 // Max width
				},
				landscapeImage: {
					h: 200, // Max height
					w: 300 // Exact Width
				},
				landscapePopupWidth: 450,
				portraitPopupWidth: 300,
				pokeySize: 8 // Height of the pokey.
			},
			$window = $( window );
	
		/**
		 * Extracted from `mw.popups.createSVGMasks`.
		 */
		function createPokeyMasks() {
			$( '<div>' )
				.attr( 'id', 'mwe-popups-svg' )
				.html(
					'<svg width="0" height="0">' +
						'<defs>' +
							'<clippath id="mwe-popups-mask">' +
								'<polygon points="0 8, 10 8, 18 0, 26 8, 1000 8, 1000 1000, 0 1000"/>' +
							'</clippath>' +
							'<clippath id="mwe-popups-mask-flip">' +
								'<polygon points="0 8, 274 8, 282 0, 290 8, 1000 8, 1000 1000, 0 1000"/>' +
							'</clippath>' +
							'<clippath id="mwe-popups-landscape-mask">' +
								'<polygon points="0 8, 174 8, 182 0, 190 8, 1000 8, 1000 1000, 0 1000"/>' +
							'</clippath>' +
							'<clippath id="mwe-popups-landscape-mask-flip">' +
								'<polygon points="0 0, 1000 0, 1000 243, 190 243, 182 250, 174 243, 0 243"/>' +
							'</clippath>' +
						'</defs>' +
					'</svg>'
				)
				.appendTo( document.body );
		}
	
		/**
		 * Initializes the renderer.
		 */
		function init() {
			createPokeyMasks();
		}
	
		/**
		 * The model of how a view is rendered, which is constructed from a response
		 * from the gateway.
		 *
		 * TODO: Rename `isTall` to `isPortrait`.
		 *
		 * @typedef {Object} ext.popups.Preview
		 * @property {jQuery} el
		 * @property {Boolean} hasThumbnail
		 * @property {Object} thumbnail
		 * @property {Boolean} isTall Sugar around
		 *  `preview.hasThumbnail && thumbnail.isTall`
		 */
	
		/**
		 * Renders a preview given data from the {@link gateway ext.popups.Gateway}.
		 * The preview is rendered and added to the DOM but will remain hidden until
		 * the `show` method is called.
		 *
		 * Previews are rendered at:
		 *
		 * # The position of the mouse when the user dwells on the link with their
		 *   mouse.
		 * # The centermost point of the link when the user dwells on the link with
		 *   their keboard or other assistive device.
		 *
		 * Since the content of the preview doesn't change but its position might, we
		 * distinguish between "rendering" - generating HTML from a MediaWiki API
		 * response - and "showing/hiding" - positioning the layout and changing its
		 * orientation, if necessary.
		 *
		 * @param {ext.popups.PreviewModel} model
		 * @return {ext.popups.Preview}
		 */
		function render( model ) {
			var preview = model.extract === undefined ? createEmptyPreview( model ) : createPreview( model );
	
			return {
	
				/**
				 * Shows the preview given an event representing the user's interaction
				 * with the active link, e.g. an instance of
				 * [MouseEvent](https://developer.mozilla.org/en/docs/Web/API/MouseEvent).
				 *
				 * See `show` for more detail.
				 *
				 * @param {Event} event
				 * @param {Object} boundActions The
				 *  [bound action creators](http://redux.js.org/docs/api/bindActionCreators.html)
				 *  that were (likely) created in [boot.js](./boot.js).
				 * @return {jQuery.Promise}
				 */
				show: function ( event, boundActions ) {
					return show( preview, event, boundActions );
				},
	
				/**
				 * Hides the preview.
				 *
				 * See `hide` for more detail.
				 *
				 * @return {jQuery.Promise}
				 */
				hide: function () {
					return hide( preview );
				}
			};
		}
	
		/**
		 * Creates an instance of the DTO backing a preview.
		 *
		 * @param {ext.popups.PreviewModel} model
		 * @return {ext.popups.Preview}
		 */
		function createPreview( model ) {
			var templateData,
				thumbnail = createThumbnail( model.thumbnail ),
				hasThumbnail = thumbnail !== null,
	
				// FIXME: This should probably be moved into the gateway as we'll soon be
				// fetching HTML from the API. See
				// https://phabricator.wikimedia.org/T141651 for more detail.
				extract = renderExtract( model.extract, model.title ),
	
				$el;
	
			templateData = $.extend( {}, model, {
				hasThumbnail: hasThumbnail
			} );
	
			$el = mw.template.get( 'ext.popups', 'preview.mustache' )
				.render( templateData );
	
			if ( hasThumbnail ) {
				$el.find( '.mwe-popups-discreet' ).append( thumbnail.el );
			}
	
			if ( extract.length ) {
				$el.find( '.mwe-popups-extract' ).append( extract );
			}
	
			return {
				el: $el,
				hasThumbnail: hasThumbnail,
				thumbnail: thumbnail,
				isTall: hasThumbnail && thumbnail.isTall
			};
		}
	
		/**
		 * Creates an instance of the DTO backing a preview. In this case the DTO
		 * represents a generic preview, which covers the following scenarios:
		 *
		 * * The page doesn't exist, i.e. the user hovered over a redlink or a
		 *   redirect to a page that doesn't exist.
		 * * The page doesn't have a viable extract.
		 *
		 * @param {ext.popups.PreviewModel} model
		 * @return {ext.popups.Preview}
		 */
		function createEmptyPreview( model ) {
			var templateData,
				$el;
	
			templateData = $.extend( {}, model, {
				extractMsg: mw.msg( 'popups-preview-no-preview' ),
				readMsg: mw.msg( 'popups-preview-footer-read' )
			} );
	
			$el = mw.template.get( 'ext.popups', 'preview-empty.mustache' )
				.render( templateData );
	
			return {
				el: $el,
				hasThumbnail: false,
				isTall: false
			};
		}
	
		/**
		 * Converts the extract into a list of elements, which correspond to fragments
		 * of the extract. Fragements that match the title verbatim are wrapped in a
		 * `<b>` element.
		 *
		 * Using the bolded elements of the extract of the page directly is covered by
		 * [T141651](https://phabricator.wikimedia.org/T141651).
		 *
		 * Extracted from `mw.popups.renderer.article.getProcessedElements`.
		 *
		 * @param {String} extract
		 * @param {String} title
		 * @return {Array}
		 */
		function renderExtract( extract, title ) {
			var regExp, escapedTitle,
				elements = [],
				boldIdentifier = '<bi-' + Math.random() + '>',
				snip = '<snip-' + Math.random() + '>';
	
			title = title.replace( /\s+/g, ' ' ).trim(); // Remove extra white spaces
			escapedTitle = mw.RegExp.escape( title ); // Escape RegExp elements
			regExp = new RegExp( '(^|\\s)(' + escapedTitle + ')(|$)', 'i' );
	
			// Remove text in parentheses along with the parentheses
			extract = extract.replace( /\s+/, ' ' ); // Remove extra white spaces
	
			// Make title bold in the extract text
			// As the extract is html escaped there can be no such string in it
			// Also, the title is escaped of RegExp elements thus can't have "*"
			extract = extract.replace( regExp, '$1' + snip + boldIdentifier + '$2' + snip + '$3' );
			extract = extract.split( snip );
	
			$.each( extract, function ( index, part ) {
				if ( part.indexOf( boldIdentifier ) === 0 ) {
					elements.push( $( '<b>' ).text( part.substring( boldIdentifier.length ) ) );
				} else {
					elements.push( document.createTextNode( part ) );
				}
			} );
	
			return elements;
		}
	
		/**
		 * Shows the preview.
		 *
		 * Extracted from `mw.popups.render.openPopup`.
		 *
		 * TODO: From the perspective of the client, there's no need to distinguish
		 * between renderering and showing a preview. Merge #render and Preview#show.
		 *
		 * @param {ext.popups.Preview} preview
		 * @param {Event} event
		 * @param {ext.popups.PreviewBehavior} behavior
		 * @return {jQuery.Promise} A promise that resolves when the promise has faded
		 *  in
		 */
		function show( preview, event, behavior ) {
			var layout = createLayout( preview, event );
	
			preview.el.appendTo( document.body );
	
			// Hack to "refresh" the SVG so that it's displayed.
			//
			// Elements get added to the DOM and not to the screen because of different
			// namespaces of HTML and SVG.
			//
			// See http://stackoverflow.com/a/13654655/366138 for more detail.
			//
			// TODO: Find out how early on in the render that this could be done, e.g.
			// createThumbnail?
			preview.el.html( preview.el.html() );
	
			layoutPreview( preview, layout );
	
			preview.el.hover( behavior.previewDwell, behavior.previewAbandon );
	
			preview.el.find( '.mwe-popups-settings-icon' )
				.attr( 'href', behavior.settingsUrl )
				.click( behavior.showSettings );
	
			preview.el.show();
	
			return wait( 200 )
				.then( behavior.previewShow );
		}
	
		/**
		 * Extracted from `mw.popups.render.closePopup`.
		 *
		 * @param {ext.popups.Preview} preview
		 * @return {jQuery.Promise} A promise that resolves when the preview has faded
		 *  out
		 */
		function hide( preview ) {
			var fadeInClass,
				fadeOutClass;
	
			// FIXME: This method clearly needs access to the layout of the preview.
			fadeInClass = ( preview.el.hasClass( 'mwe-popups-fade-in-up' ) ) ?
				'mwe-popups-fade-in-up' :
				'mwe-popups-fade-in-down';
	
			fadeOutClass = ( fadeInClass === 'mwe-popups-fade-in-up' ) ?
				'mwe-popups-fade-out-down' :
				'mwe-popups-fade-out-up';
	
			preview.el
				.removeClass( fadeInClass )
				.addClass( fadeOutClass );
	
			return wait( 150 ).then( function () {
				preview.el.remove();
			} );
		}
	
		/**
		 * @typedef {Object} ext.popups.Thumbnail
		 * @property {Element} el
		 * @property {Boolean} isTall Whether or not the thumbnail is portrait
		 */
	
		/**
		 * Creates a thumbnail from the representation of a thumbnail returned by the
		 * PageImages MediaWiki API query module.
		 *
		 * If there's no thumbnail, the thumbnail is too small, or the thumbnail's URL
		 * contains characters that could be used to perform an
		 * [XSS attack via CSS](https://www.owasp.org/index.php/Testing_for_CSS_Injection_(OTG-CLIENT-005)),
		 * then `null` is returned.
		 *
		 * Extracted from `mw.popups.renderer.article.createThumbnail`.
		 *
		 * @param {Object} rawThumbnail
		 * @return {ext.popups.Thumbnail|null}
		 */
		function createThumbnail( rawThumbnail ) {
			var tall, thumbWidth, thumbHeight,
				x, y, width, height, clipPath,
				devicePixelRatio = $.bracketedDevicePixelRatio();
	
			if ( !rawThumbnail ) {
				return null;
			}
	
			tall = rawThumbnail.width < rawThumbnail.height;
			thumbWidth = rawThumbnail.width / devicePixelRatio;
			thumbHeight = rawThumbnail.height / devicePixelRatio;
	
			if (
				// Image too small for landscape display
				( !tall && thumbWidth < SIZES.landscapeImage.w ) ||
				// Image too small for portrait display
				( tall && thumbHeight < SIZES.portraitImage.h ) ||
				// These characters in URL that could inject CSS and thus JS
				(
					rawThumbnail.source.indexOf( '\\' ) > -1 ||
					rawThumbnail.source.indexOf( '\'' ) > -1 ||
					rawThumbnail.source.indexOf( '\"' ) > -1
				)
			) {
				return null;
			}
	
			if ( tall ) {
				x = ( thumbWidth > SIZES.portraitImage.w ) ?
					( ( thumbWidth - SIZES.portraitImage.w ) / -2 ) :
					( SIZES.portraitImage.w - thumbWidth );
				y = ( thumbHeight > SIZES.portraitImage.h ) ?
					( ( thumbHeight - SIZES.portraitImage.h ) / -2 ) : 0;
				width = SIZES.portraitImage.w;
				height = SIZES.portraitImage.h;
			} else {
				x = 0;
				y = ( thumbHeight > SIZES.landscapeImage.h ) ?
					( ( thumbHeight - SIZES.landscapeImage.h ) / -2 ) : 0;
				width = SIZES.landscapeImage.w + 3;
				height = ( thumbHeight > SIZES.landscapeImage.h ) ?
					SIZES.landscapeImage.h : thumbHeight;
				clipPath = 'mwe-popups-mask';
			}
	
			return {
				el: createThumbnailElement(
					tall ? 'mwe-popups-is-tall' : 'mwe-popups-is-not-tall',
					rawThumbnail.source,
					x,
					y,
					thumbWidth,
					thumbHeight,
					width,
					height,
					clipPath
				),
				isTall: tall,
				width: thumbWidth,
				height: thumbHeight
			};
		}
	
		/**
		 * Creates the SVG image element that represents the thumbnail.
		 *
		 * This function is distinct from `createThumbnail` as it abstracts away some
		 * browser issues that are uncovered when manipulating elements across
		 * namespaces.
		 *
		 * @param {String} className
		 * @param {String} url
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} thumbnailWidth
		 * @param {Number} thumbnailHeight
		 * @param {Number} width
		 * @param {Number} height
		 * @param {String} clipPath
		 * @return {jQuery}
		 */
		function createThumbnailElement( className, url, x, y, thumbnailWidth, thumbnailHeight, width, height, clipPath ) {
			var $thumbnailSVGImage, $thumbnail,
				ns = 'http://www.w3.org/2000/svg',
	
				// Use createElementNS to create the svg:image tag as jQuery uses
				// createElement instead. Some browsers mistakenly map the image tag to
				// img tag.
				svgElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'image' );
	
			$thumbnailSVGImage = $( svgElement );
			$thumbnailSVGImage
				.addClass( className )
				.attr( {
					x: x,
					y: y,
					width: thumbnailWidth,
					height: thumbnailHeight,
					'clip-path': 'url(#' + clipPath + ')'
				} );
	
			// Certain browsers, e.g. IE9, will not correctly set attributes from
			// foreign namespaces using Element#setAttribute (see T134979). Apart from
			// Safari, all supported browsers can set them using Element#setAttributeNS
			// (see T134979).
			if ( isSafari ) {
				svgElement.setAttribute( 'xlink:href', url );
			} else {
				svgElement.setAttributeNS( ns, 'xlink:href', url );
			}
			$thumbnail = $( '<svg>' )
				.attr( {
					xmlns: ns,
					width: width,
					height: height
				} )
				.append( $thumbnailSVGImage );
	
			return $thumbnail;
		}
	
		/**
		 * Represents the layout of a preview, which consists of a position (`offset`)
		 * and whether or not the preview should be flipped horizontally or
		 * vertically (`flippedX` and `flippedY` respectively).
		 *
		 * @typedef {Object} ext.popups.PreviewLayout
		 * @property {Object} offset
		 * @property {Boolean} flippedX
		 * @property {Boolean} flippedY
		 */
	
		/**
		 * Extracted from `mw.popups.renderer.article.getOffset`.
		 *
		 * @param {ext.popups.Preview} preview
		 * @param {Object} event
		 * @return {ext.popups.PreviewLayout}
		 */
		function createLayout( preview, event ) {
			var flippedX = false,
				flippedY = false,
				link = $( event.target ),
				offsetTop = ( event.pageY ) ? // If it was a mouse event
					// Position according to mouse
					// Since client rectangles are relative to the viewport,
					// take scroll position into account.
					getClosestYPosition(
						event.pageY - $window.scrollTop(),
						link.get( 0 ).getClientRects(),
						false
					) + $window.scrollTop() + SIZES.pokeySize :
					// Position according to link position or size
					link.offset().top + link.height() + SIZES.pokeySize,
				clientTop = ( event.clientY ) ?
					event.clientY :
					offsetTop,
				offsetLeft = ( event.pageX ) ?
					event.pageX :
					link.offset().left;
	
			// X Flip
			if ( offsetLeft > ( $window.width() / 2 ) ) {
				offsetLeft += ( !event.pageX ) ? link.width() : 0;
				offsetLeft -= !preview.isTall ?
					SIZES.portraitPopupWidth :
					SIZES.landscapePopupWidth;
				flippedX = true;
			}
	
			if ( event.pageX ) {
				offsetLeft += ( flippedX ) ? 20 : -20;
			}
	
			// Y Flip
			if ( clientTop > ( $window.height() / 2 ) ) {
				flippedY = true;
	
				// Mirror the positioning of the preview when there's no "Y flip": rest
				// the pokey on the edge of the link's bounding rectangle. In this case
				// the edge is the top-most.
				offsetTop = link.offset().top - SIZES.pokeySize;
	
				// Change the Y position to the top of the link
				if ( event.pageY ) {
					// Since client rectangles are relative to the viewport,
					// take scroll position into account.
					offsetTop = getClosestYPosition(
						event.pageY - $window.scrollTop(),
						link.get( 0 ).getClientRects(),
						true
					) + $window.scrollTop();
				}
			}
	
			return {
				offset: {
					top: offsetTop,
					left: offsetLeft
				},
				flippedX: flippedX,
				flippedY: flippedY
			};
		}
	
		/**
		 * Generates a list of declarative CSS classes that represent the layout of
		 * the preview.
		 *
		 * @param {ext.popups.Preview} preview
		 * @param {ext.popups.PreviewLayout} layout
		 * @return {String[]}
		 */
		function getClasses( preview, layout ) {
			var classes = [];
	
			if ( layout.flippedY ) {
				classes.push( 'mwe-popups-fade-in-down' );
			} else {
				classes.push( 'mwe-popups-fade-in-up' );
			}
	
			if ( layout.flippedY && layout.flippedX ) {
				classes.push( 'flipped_x_y' );
			}
	
			if ( layout.flippedY && !layout.flippedX ) {
				classes.push( 'flipped_y' );
			}
	
			if ( layout.flippedX && !layout.flippedY ) {
				classes.push( 'flipped_x' );
			}
	
			if ( ( !preview.hasThumbnail || preview.isTall ) && !layout.flippedY ) {
				classes.push( 'mwe-popups-no-image-tri' );
			}
	
			if ( ( preview.hasThumbnail && !preview.isTall ) && !layout.flippedY ) {
				classes.push( 'mwe-popups-image-tri' );
			}
	
			if ( preview.isTall ) {
				classes.push( 'mwe-popups-is-tall' );
			} else {
				classes.push( 'mwe-popups-is-not-tall' );
			}
	
			return classes;
		}
	
		/**
		 * Lays out the preview given the layout.
		 *
		 * If the preview should be oriented differently, then the pokey is updated,
		 * e.g. if the preview should be flipped vertically, then the pokey is
		 * removed.
		 *
		 * If the thumbnail is landscape and isn't the full height of the thumbnail
		 * container, then pull the extract up to keep whitespace consistent across
		 * previews.
		 *
		 * @param {ext.popups.Preview} preview
		 * @param {ext.popups.PreviewLayout} layout
		 */
		function layoutPreview( preview, layout ) {
			var popup = preview.el,
				isTall = preview.isTall,
				hasThumbnail = preview.hasThumbnail,
				thumbnail = preview.thumbnail,
				flippedY = layout.flippedY,
				flippedX = layout.flippedX,
				offsetTop = layout.offset.top;
	
			if ( !flippedY && !isTall && hasThumbnail && thumbnail.height < SIZES.landscapeImage.h ) {
				$( '.mwe-popups-extract' ).css(
					'margin-top',
					thumbnail.height - SIZES.pokeySize
				);
			}
	
			popup.addClass( getClasses( preview, layout ).join( ' ' ) );
	
			if ( flippedY ) {
				offsetTop -= popup.outerHeight();
			}
	
			popup.css( {
				top: offsetTop,
				left: layout.offset.left + 'px'
			} );
	
			if ( flippedY && hasThumbnail ) {
				popup.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', '' );
			}
	
			if ( flippedY && flippedX && hasThumbnail && isTall ) {
				popup.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask-flip)' );
			}
	
			if ( flippedX && !flippedY && hasThumbnail && !isTall ) {
				popup.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', 'url(#mwe-popups-mask-flip)' );
			}
	
			if ( flippedX && !flippedY && hasThumbnail && isTall ) {
				popup.removeClass( 'mwe-popups-no-image-tri' )
					.find( 'image' )[ 0 ]
					.setAttribute( 'clip-path', 'url(#mwe-popups-landscape-mask)' );
			}
		}
	
		/**
		 * Given the rectangular box(es) find the 'y' boundary of the closest
		 * rectangle to the point 'y'. The point 'y' is the location of the mouse
		 * on the 'y' axis and the rectangular box(es) are the borders of the
		 * element over which the mouse is located. There will be more than one
		 * rectangle in case the element spans multiple lines.
		 *
		 * In the majority of cases the mouse pointer will be inside a rectangle.
		 * However, some browsers (i.e. Chrome) trigger a hover action even when
		 * the mouse pointer is just outside a bounding rectangle. That's why
		 * we need to look at all rectangles and not just the rectangle that
		 * encloses the point.
		 *
		 * @param {Number} y the point for which the closest location is being
		 *  looked for
		 * @param {ClientRectList} rects list of rectangles defined by four edges
		 * @param {Boolean} [isTop] should the resulting rectangle's top 'y'
		 *  boundary be returned. By default the bottom 'y' value is returned.
		 * @return {Number}
		 */
		function getClosestYPosition( y, rects, isTop ) {
			var result,
				deltaY,
				minY = null;
	
			$.each( rects, function ( i, rect ) {
				deltaY = Math.abs( y - rect.top + y - rect.bottom );
	
				if ( minY === null || minY > deltaY ) {
					minY = deltaY;
					// Make sure the resulting point is at or outside the rectangle
					// boundaries.
					result = ( isTop ) ? Math.floor( rect.top ) : Math.ceil( rect.bottom );
				}
			} );
	
			return result;
		}
	
		module.exports = {
			render: render,
			init: init
		};
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 11 */
/***/ function(module, exports) {

	var $ = jQuery;
	
	/**
	 * Sugar around `window.setTimeout`.
	 *
	 * @example
	 * function continueProcessing() {
	 *   // ...
	 * }
	 *
	 * wait( 150 ).then( continueProcessing );
	 *
	 * @param {Number} delay The number of milliseconds to wait
	 * @return {jQuery.Promise}
	 */
	module.exports = function ( delay ) {
		var result = $.Deferred();
	
		setTimeout( function () {
			result.resolve();
		}, delay );
	
		return result.promise();
	};


/***/ },
/* 12 */
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
/* 13 */
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var mw = mediaWiki,
		$ = jQuery,
		pageVisibility = __webpack_require__( 15 ),
		checkin = {
			/**
			 * Checkin times - Fibonacci numbers
			 *
			 * Exposed for testing only.
			 *
			 * @type {number[]}
			 * @private
			 */
			CHECKIN_TIMES: [ 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233,
				377, 610, 987, 1597, 2584, 4181, 6765 ],
			/**
			 * Have checkin actions been setup already?
			 *
			 * Exposed for testing only.
			 *
			 * @private
			 * @type {boolean}
			 */
			haveCheckinActionsBeenSetup: false
		};
	
	/**
	 * A customized `setTimeout` function that takes page visibility into account
	 *
	 * If the document is not visible to the user, e.g. browser window is minimized,
	 * then pause the time. Otherwise execute `callback` after `delay` milliseconds.
	 * The callback won't be executed if the browser does not suppor the page visibility
	 * API.
	 *
	 * Exposed for testing only.
	 *
	 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
	 * @private
	 * @param {Function} callback Function to call when the time is up
	 * @param {number} delay The number of milliseconds to wait before executing the callback
	 */
	checkin.setVisibleTimeout = function ( callback, delay ) {
		var hiddenPropertyName = pageVisibility.getDocumentHiddenPropertyName( document ),
			visibilityChangeEventName = pageVisibility.getDocumentVisibilitychangeEventName( document ),
			timeoutId,
			lastStartedAt;
	
		if ( !hiddenPropertyName || !visibilityChangeEventName ) {
			return;
		}
	
		/**
		 * Execute the callback and turn off listening to the visibilitychange event
		 */
		function done() {
			callback();
			$( document ).off( visibilityChangeEventName, visibilityChangeHandler );
		}
	
		/**
		 * Pause or resume the timer depending on the page visibility state
		 */
		function visibilityChangeHandler() {
			var millisecondsPassed;
	
			// Pause the timer if the page is hidden ...
			if ( pageVisibility.isDocumentHidden( document ) ) {
				// ... and only if the timer has started.
				// Timer may not have been started if the document opened in a
				// hidden tab for example. The timer will be started when the
				// document is visible to the user.
				if ( lastStartedAt !== undefined ) {
					millisecondsPassed = Math.round( mw.now() - lastStartedAt );
					delay = Math.max( 0, delay - millisecondsPassed );
					clearTimeout( timeoutId );
				}
			} else {
				lastStartedAt = Math.round( mw.now() );
				timeoutId = setTimeout( done, delay );
			}
		}
	
		visibilityChangeHandler();
	
		$( document ).on( visibilityChangeEventName, visibilityChangeHandler );
	};
	
	/**
	 * Perform the passed `checkin` action at the predefined times
	 *
	 * Actions are setup only once no matter how many times this function is
	 * called. Ideally this function should be called once.
	 *
	 * @see checkin.CHECKIN_TIMES
	 * @param {Function} checkinAction
	 */
	checkin.setupActions = function( checkinAction ) {
		var timeIndex = 0,
			timesLength = checkin.CHECKIN_TIMES.length,
			time,  // current checkin time
			nextTime;  // the checkin time that will be logged next
	
		if ( checkin.haveCheckinActionsBeenSetup ) {
			return;
		}
	
		/**
		 * Execute the checkin action with the current checkin time
		 *
		 * If more checkin times are left, then setup a timer to log the next one.
		 */
		function setup() {
			time = checkin.CHECKIN_TIMES[ timeIndex ];
			checkinAction( time );
	
			timeIndex += 1;
			if ( timeIndex < timesLength ) {
				nextTime = checkin.CHECKIN_TIMES[ timeIndex ];
				// Execute the callback after the number of seconds left till the
				// next checkin time.
				checkin.setVisibleTimeout( setup, ( nextTime - time ) * 1000 );
			}
		}
	
		checkin.setVisibleTimeout( setup, checkin.CHECKIN_TIMES[ timeIndex ] * 1000 );
	
		checkin.haveCheckinActionsBeenSetup = true;
	};
	
	module.exports = checkin;


/***/ },
/* 15 */
/***/ function(module, exports) {

	var pageVisibility = {
		/**
		 * Cached value of the browser specific name of the `document.hidden` property
		 *
		 * Exposed for testing only.
		 *
		 * @type {null|undefined|string}
		 * @private
		 */
		documentHiddenPropertyName: null,
		/**
		 * Cached value of the browser specific name of the `document.visibilitychange` event
		 *
		 * Exposed for testing only.
		 *
		 * @type {null|undefined|string}
		 * @private
		 */
		documentVisibilityChangeEventName: null
	};
	
	/**
	 * Return the browser specific name of the `document.hidden` property
	 *
	 * Exposed for testing only.
	 *
	 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	 * @private
	 * @param {Object} doc window.document object
	 * @return {string|undefined}
	 */
	pageVisibility.getDocumentHiddenPropertyName = function ( doc ) {
		var property;
	
		if ( pageVisibility.documentHiddenPropertyName === null ) {
			if ( doc.hidden !== undefined ) {
				property = 'hidden';
			} else if ( doc.mozHidden !== undefined ) {
				property = 'mozHidden';
			} else if ( doc.msHidden !== undefined ) {
				property = 'msHidden';
			} else if ( doc.webkitHidden !== undefined ) {
				property = 'webkitHidden';
			} else {
				// let's be explicit about returning `undefined`
				property = undefined;
			}
			// cache
			pageVisibility.documentHiddenPropertyName = property;
		}
	
		return pageVisibility.documentHiddenPropertyName;
	};
	
	/**
	 * Return the browser specific name of the `document.visibilitychange` event
	 *
	 * Exposed for testing only.
	 *
	 * @see https://www.w3.org/TR/page-visibility/#sec-visibilitychange-event
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	 * @private
	 * @param {Object} doc window.document object
	 * @return {string|undefined}
	 */
	pageVisibility.getDocumentVisibilitychangeEventName = function ( doc ) {
		var eventName;
	
		if ( pageVisibility.documentVisibilityChangeEventName === null ) {
			if ( doc.hidden !== undefined ) {
				eventName = 'visibilitychange';
			} else if ( doc.mozHidden !== undefined ) {
				eventName = 'mozvisibilitychange';
			} else if ( doc.msHidden !== undefined ) {
				eventName = 'msvisibilitychange';
			} else if ( doc.webkitHidden !== undefined ) {
				eventName = 'webkitvisibilitychange';
			} else {
				// let's be explicit about returning `undefined`
				eventName = undefined;
			}
			// cache
			pageVisibility.documentVisibilityChangeEventName = eventName;
		}
	
		return pageVisibility.documentVisibilityChangeEventName;
	};
	
	/**
	 * Whether `window.document` is visible
	 *
	 * `undefined` is returned if the browser does not support the Visibility API.
	 *
	 * Exposed for testing only.
	 *
	 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	 * @private
	 * @param {Object} doc window.document object
	 * @returns {boolean|undefined}
	 */
	pageVisibility.isDocumentHidden = function ( doc ) {
		var property = pageVisibility.getDocumentHiddenPropertyName( doc );
	
		return property !== undefined ? doc[ property ] : undefined;
	};
	
	module.exports = pageVisibility;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Return count bucket for the number of edits a user has made.
	 *
	 * The buckets are defined as part of
	 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
	 *
	 * Extracted from `mw.popups.schemaPopups.getEditCountBucket`.
	 *
	 * @param {Number} count
	 * @return {String}
	 */
	function getEditCountBucket( count ) {
		var bucket;
	
		if ( count === 0 ) {
			bucket = '0';
		} else if ( count >= 1 && count <= 4 ) {
			bucket = '1-4';
		} else if ( count >= 5 && count <= 99 ) {
			bucket = '5-99';
		} else if ( count >= 100 && count <= 999 ) {
			bucket = '100-999';
		} else if ( count >= 1000 ) {
			bucket = '1000+';
		}
	
		return bucket + ' edits';
	}
	
	/**
	 * Return count bucket for the number of previews a user has seen.
	 *
	 * If local storage isn't available - because the user has disabled it
	 * or the browser doesn't support it - then then "unknown" is returned.
	 *
	 * The buckets are defined as part of
	 * [the Popups schema](https://meta.wikimedia.org/wiki/Schema:Popups).
	 *
	 * Extracted from `mw.popups.getPreviewCountBucket`.
	 *
	 * @param {Number} count
	 * @return {String}
	 */
	function getPreviewCountBucket( count ) {
		var bucket;
	
		if ( count === -1 ) {
			return 'unknown';
		}
	
		if ( count === 0 ) {
			bucket = '0';
		} else if ( count >= 1 && count <= 4 ) {
			bucket = '1-4';
		} else if ( count >= 5 && count <= 20 ) {
			bucket = '5-20';
		} else if ( count >= 21 ) {
			bucket = '21+';
		}
	
		return bucket + ' previews';
	}
	
	module.exports = {
		getPreviewCountBucket: getPreviewCountBucket,
		getEditCountBucket: getEditCountBucket
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		/**
		 * @typedef {Object} ext.popups.PreviewBehavior
		 * @property {String} settingsUrl
		 * @property {Function} showSettings
		 * @property {Function} previewDwell
		 * @property {Function} previewAbandon
		 */
	
		/**
		 * Creates an instance of `ext.popups.PreviewBehavior`.
		 *
		 * If the user is logged out, then clicking the cog should show the settings
		 * modal.
		 *
		 * If the user is logged in, then clicking the cog should send them to the
		 * Special:Preferences page with the "Beta features" tab open if Page Previews
		 * is enabled as a beta feature, or the "Appearance" tab otherwise.
		 *
		 * @param {mw.Map} config
		 * @param {mw.User} user
		 * @param {Object} actions The action creators bound to the Redux store
		 * @return {ext.popups.PreviewBehavior}
		 */
		module.exports = function ( config, user, actions ) {
			var isBetaFeature = config.get( 'wgPopupsBetaFeature' ),
				rawTitle,
				settingsUrl,
				showSettings = $.noop;
	
			if ( user.isAnon() ) {
				showSettings = function ( event ) {
					event.preventDefault();
	
					actions.showSettings();
				};
			} else {
				rawTitle = 'Special:Preferences#mw-prefsection-';
				rawTitle += isBetaFeature ? 'betafeatures' : 'rendering';
	
				settingsUrl = mw.Title.newFromText( rawTitle )
					.getUrl();
			}
	
			return {
				settingsUrl: settingsUrl,
				showSettings: showSettings,
				previewDwell: actions.previewDwell,
				previewAbandon: actions.abandon,
				previewShow: actions.previewShow
			};
		};
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * @typedef {Object} ext.popups.UserSettings
	 */
	
	var IS_ENABLED_KEY = 'mwe-popups-enabled',
		PREVIEW_COUNT_KEY = 'ext.popups.core.previewCount';
	
	/**
	 * Given the global state of the application, creates an object whose methods
	 * encapsulate all interactions with the given User Agent's storage.
	 *
	 * @param {mw.storage} storage The `mw.storage` singleton instance
	 *
	 * @return {ext.popups.UserSettings}
	 */
	module.exports = function ( storage ) {
		return {
	
			/**
			 * Gets whether or not the user has previously enabled Page Previews.
			 *
			 * N.B. that if the user hasn't previously enabled or disabled Page
			 * Previews, i.e. mw.popups.userSettings.setIsEnabled(true), then they
			 * are treated as if they have enabled them.
			 *
			 * @return {Boolean}
			 */
			getIsEnabled: function () {
				return storage.get( IS_ENABLED_KEY ) !== '0';
			},
	
			/**
			 * Sets whether or not the user has enabled Page Previews.
			 *
			 * @param {Boolean} isEnabled
			 */
			setIsEnabled: function ( isEnabled ) {
				storage.set( IS_ENABLED_KEY, isEnabled ? '1' : '0' );
			},
	
			/**
			 * Gets whether or not the user has previously enabled **or disabled**
			 * Page Previews.
			 *
			 * @return {Boolean}
			 */
			hasIsEnabled: function () {
				return storage.get( IS_ENABLED_KEY, undefined ) !== undefined;
			},
	
			/**
			 * Gets the number of Page Previews that the user has seen.
			 *
			 * If the storage isn't available, then -1 is returned.
			 *
			 * @return {Number}
			 */
			getPreviewCount: function () {
				var result = storage.get( PREVIEW_COUNT_KEY );
	
				if ( result === false ) {
					return -1;
				} else if ( result === null ) {
					return 0;
				}
	
				return parseInt( result, 10 );
			},
	
			/**
			 * Sets the number of Page Previews that the user has seen.
			 *
			 * @param {Number} count
			 */
			setPreviewCount: function ( count ) {
				storage.set( PREVIEW_COUNT_KEY, count.toString() );
			}
		};
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		/**
		 * Creates an instance of an EventLogging schema that can be used to log
		 * Popups events.
		 *
		 * @param {mw.Map} config
		 * @param {Window} window
		 * @return {mw.eventLog.Schema}
		 */
		module.exports = function ( config, window ) {
			var samplingRate = config.get( 'wgPopupsSchemaSamplingRate', 0 );
	
			if (
				!window.navigator ||
				!$.isFunction( window.navigator.sendBeacon ) ||
				window.QUnit
			) {
				samplingRate = 0;
			}
	
			return new mw.eventLog.Schema( 'Popups', samplingRate );
		};
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 20 */
/***/ function(module, exports) {

	var mw = window.mediaWiki,
		$ = jQuery;
	
	/**
	 * Creates a render function that will create the settings dialog and return
	 * a set of methods to operate on it
	 * @returns {Function} render function
	 */
	module.exports = function () {
	
		/**
		 * Cached settings dialog
		 *
		 * @type {jQuery}
		 */
		var $dialog,
			/**
			 * Cached settings overlay
			 *
			 * @type {jQuery}
			 */
			$overlay;
	
		/**
		 * Renders the relevant form and labels in the settings dialog
		 * @param {Object} boundActions
		 * @returns {Object} object with methods to affect the rendered UI
		 */
		return function ( boundActions ) {
	
			if ( !$dialog ) {
				$dialog = createSettingsDialog();
				$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );
	
				// Setup event bindings
	
				$dialog.find( '.save' ).click( function () {
					// Find the selected value (simple|advanced|off)
					var selected = getSelectedSetting( $dialog ),
						// Only simple means enabled, advanced is disabled in favor of
						// NavPops and off means disabled.
						enabled = selected === 'simple';
	
					boundActions.saveSettings( enabled );
				} );
				$dialog.find( '.close, .okay' ).click( boundActions.hideSettings );
			}
	
			return {
				/**
				 * Append the dialog and overlay to a DOM element
				 * @param {HTMLElement} el
				 */
				appendTo: function ( el ) {
					$overlay.appendTo( el );
					$dialog.appendTo( el );
				},
	
				/**
				 * Show the settings element and position it correctly
				 */
				show: function () {
					var h = $( window ).height(),
						w = $( window ).width();
	
					$overlay.show();
	
					// FIXME: Should recalc on browser resize
					$dialog
						.show()
						.css( 'left', ( w - $dialog.outerWidth( true ) ) / 2 )
						.css( 'top', ( h - $dialog.outerHeight( true ) ) / 2 );
				},
	
				/**
				 * Hide the settings dialog.
				 */
				hide: function () {
					$overlay.hide();
					$dialog.hide();
				},
	
				/**
				 * Toggle the help dialog on or off
				 * @param {Boolean} visible if you want to show or hide the help dialog
				 */
				toggleHelp: function ( visible ) {
					toggleHelp( $dialog, visible );
				},
	
				/**
				 * Update the form depending on the enabled flag
				 *
				 * If false and no navpops, then checks 'off'
				 * If true, then checks 'on'
				 * If false, and there are navpops, then checks 'advanced'
				 *
				 * @param {Boolean} enabled if page previews are enabled
				 */
				setEnabled: function ( enabled ) {
					var name = 'off';
					if ( enabled ) {
						name = 'simple';
					} else if ( isNavPopupsEnabled() ) {
						name = 'advanced';
					}
	
					// Check the appropiate radio button
					$dialog.find( '#mwe-popups-settings-' + name )
						.prop( 'checked', true );
				}
			};
		};
	};
	
	/**
	 * Create the settings dialog
	 *
	 * @return {jQuery} settings dialog
	 */
	function createSettingsDialog() {
		var $el,
			path = mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/ext.popups/images/',
			choices = [
				{
					id: 'simple',
					name: mw.msg( 'popups-settings-option-simple' ),
					description: mw.msg( 'popups-settings-option-simple-description' ),
					image: path + 'hovercard.svg',
					isChecked: true
				},
				{
					id: 'advanced',
					name: mw.msg( 'popups-settings-option-advanced' ),
					description: mw.msg( 'popups-settings-option-advanced-description' ),
					image: path + 'navpop.svg'
				},
				{
					id: 'off',
					name: mw.msg( 'popups-settings-option-off' )
				}
			];
	
		if ( !isNavPopupsEnabled() ) {
			// remove the advanced option
			choices.splice( 1, 1 );
		}
	
		// render the template
		$el = mw.template.get( 'ext.popups', 'settings.mustache' ).render( {
			heading: mw.msg( 'popups-settings-title' ),
			closeLabel: mw.msg( 'popups-settings-cancel' ),
			saveLabel: mw.msg( 'popups-settings-save' ),
			helpText: mw.msg( 'popups-settings-help' ),
			okLabel: mw.msg( 'popups-settings-help-ok' ),
			descriptionText: mw.msg( 'popups-settings-description' ),
			choices: choices
		} );
	
		return $el;
	}
	
	/**
	 * Get the selected value on the radio button
	 *
	 * @param {jQuery.Object} $el the element to extract the setting from
	 * @return {String} Which should be (simple|advanced|off)
	 */
	function getSelectedSetting( $el ) {
		return $el.find(
			'input[name=mwe-popups-setting]:checked, #mwe-popups-settings'
		).val();
	}
	
	/**
	 * Toggles the visibility between a form and the help
	 * @param {jQuery.Object} $el element that contains form and help
	 * @param {Boolean} visible if the help should be visible, or the form
	 */
	function toggleHelp( $el, visible ) {
		var $dialog = $( '#mwe-popups-settings' ),
			formSelectors = 'main, .save, .close',
			helpSelectors = '.mwe-popups-settings-help, .okay';
	
		if ( visible ) {
			$dialog.find( formSelectors ).hide();
			$dialog.find( helpSelectors ).show();
		} else {
			$dialog.find( formSelectors ).show();
			$dialog.find( helpSelectors ).hide();
		}
	}
	
	/**
	 * Checks if the NavigationPopups gadget is enabled by looking at the global
	 * variables
	 * @returns {Boolean} if navpops was found to be enabled
	 */
	function isNavPopupsEnabled() {
		/* global pg: false*/
		return typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined;
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Interface for API gateway that fetches page summary
	 *
	 * @interface ext.popups.Gateway
	 */
	
	/**
	 * Returns a preview model fetched from the api
	 * @function
	 * @name ext.popups.Gateway#getPageSummary
	 * @param {String} title Page title we're querying
	 * @returns {jQuery.Promise} that resolves with {ext.popups.PreviewModel}
	 * if the request is successful and the response is not empty; otherwise
	 * it rejects.
	 */
	module.exports = {
		createMediaWikiApiGateway: __webpack_require__( 22 ),
		createRESTBaseGateway: __webpack_require__( 23 )
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	( function ( mw ) {
	
		var EXTRACT_LENGTH = 525,
			// Public and private cache lifetime (5 minutes)
			CACHE_LIFETIME = 300;
	
		/**
		 * MediaWiki API gateway factory
		 *
		 * @param {mw.Api} api
		 * @param {mw.ext.constants } config
		 * @returns {ext.popups.Gateway}
		 */
		function createMediaWikiApiGateway( api, config ) {
	
			/**
			 * Fetch page data from the API
			 *
			 * @param {String} title
			 * @return {jQuery.Promise}
			 */
			function fetch( title ) {
				return api.get( {
					action: 'query',
					prop: 'info|extracts|pageimages|revisions|info',
					formatversion: 2,
					redirects: true,
					exintro: true,
					exchars: EXTRACT_LENGTH,
	
					// There is an added geometric limit on .mwe-popups-extract
					// so that text does not overflow from the card.
					explaintext: true,
	
					piprop: 'thumbnail',
					pithumbsize: config.THUMBNAIL_SIZE,
					rvprop: 'timestamp',
					inprop: 'url',
					titles: title,
					smaxage: CACHE_LIFETIME,
					maxage: CACHE_LIFETIME,
					uselang: 'content'
				}, {
					headers: {
						'X-Analytics': 'preview=1'
					}
				} );
			}
	
			/**
			 * Get the page summary from the api and transform the data
			 *
			 * @param {String} title
			 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
			 */
			function getPageSummary( title ) {
				return fetch( title )
					.then( extractPageFromResponse )
					.then( convertPageToModel );
			}
	
			return {
				fetch: fetch,
				extractPageFromResponse: extractPageFromResponse,
				convertPageToModel: convertPageToModel,
				getPageSummary: getPageSummary
			};
		}
	
		/**
		 * Extract page data from the MediaWiki API response
		 *
		 * @param {Object} data API response data
		 * @throws {Error} Throw an error if page data cannot be extracted,
		 * i.e. if the response is empty,
		 * @returns {Object}
		 */
		function extractPageFromResponse( data ) {
			if (
				data.query &&
				data.query.pages &&
				data.query.pages.length
			) {
				return data.query.pages[ 0 ];
			}
	
			throw new Error( 'API response `query.pages` is empty.' );
		}
	
		/**
		 * Transform the MediaWiki API response to a preview model
		 *
		 * @param {Object} page
		 * @returns {ext.popups.PreviewModel}
		 */
		function convertPageToModel( page ) {
			return mw.popups.preview.createModel(
				page.title,
				page.canonicalurl,
				page.pagelanguagehtmlcode,
				page.pagelanguagedir,
				page.extract,
				page.thumbnail
			);
		}
	
		module.exports = createMediaWikiApiGateway;
	
	}( mediaWiki ) );


/***/ },
/* 23 */
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		var RESTBASE_ENDPOINT = '/api/rest_v1/page/summary/',
			RESTBASE_PROFILE = 'https://www.mediawiki.org/wiki/Specs/Summary/1.0.0';
	
		/**
		 * RESTBase gateway factory
		 *
		 * @param {Function} ajax function from jQuery for example
		 * @param {ext.popups.constants} config set of configuration values
		 * @returns {ext.popups.Gateway}
		 */
		function createRESTBaseGateway( ajax, config ) {
	
			/**
			 * Fetch page data from the API
			 *
			 * @param {String} title
			 * @return {jQuery.Promise}
			 */
			function fetch( title ) {
				return ajax( {
					url: RESTBASE_ENDPOINT + encodeURIComponent( title ),
					headers: {
						Accept: 'application/json; charset=utf-8' +
							'profile="' + RESTBASE_PROFILE + '"'
					}
				} );
			}
	
			/**
			 * Get the page summary from the api and transform the data
			 *
			 * @param {String} title
			 * @returns {jQuery.Promise<ext.popups.PreviewModel>}
			 */
			function getPageSummary( title ) {
				return fetch( title )
					.then( function( page ) {
						return convertPageToModel( page, config.THUMBNAIL_SIZE );
					} );
			}
	
			return {
				fetch: fetch,
				convertPageToModel: convertPageToModel,
				getPageSummary: getPageSummary
			};
		}
	
		/**
		 * Takes the original thumbnail and ensure it fits within limits of THUMBNAIL_SIZE
		 *
		 * @param {Object} original image
		 * @param {int} thumbSize  expected thumbnail size
		 * @returns {Object}
		 */
		function generateThumbnailData( original, thumbSize ) {
			var parts = original.source.split( '/' ),
				filename = parts[ parts.length - 1 ];
	
			if ( thumbSize > original.width && filename.indexOf( '.svg' ) === -1 ) {
				thumbSize = original.width;
			}
	
			return $.extend( {}, original, {
				source: parts.join( '/' ) + '/' + thumbSize + 'px-' + filename
			} );
		}
	
		/**
		 * Transform the rest API response to a preview model
		 *
		 * @param {Object} page
		 * @param {int} thumbSize
		 * @returns {ext.popups.PreviewModel}
		 */
		function convertPageToModel( page, thumbSize ) {
			return mw.popups.preview.createModel(
				page.title,
				new mw.Title( page.title ).getUrl(),
				page.lang,
				page.dir,
				page.extract,
				page.originalimage ? generateThumbnailData( page.originalimage, thumbSize ) : undefined
			);
		}
	
		module.exports = createRESTBaseGateway;
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * Given the global state of the application, creates a function that gets
	 * whether or not the user should have Page Previews enabled.
	 *
	 * If Page Previews is configured as a beta feature (see
	 * `$wgPopupsBetaFeature`), the user must be logged in and have enabled the
	 * beta feature in order to see previews.
	 *
	 * If Page Previews is configured as a preference, then the user must either
	 * be logged in and have enabled the preference or be logged out and have not
	 * disabled previews via the settings modal.
	 *
	 * @param {mw.user} user The `mw.user` singleton instance
	 * @param {Object} userSettings An object returned by
	 *  `mw.popups.createUserSettings`
	 * @param {mw.Map} config
	 *
	 * @return {Boolean}
	 */
	module.exports = function ( user, userSettings, config ) {
		if ( !user.isAnon() ) {
			return config.get( 'wgPopupsShouldSendModuleToUser' );
		}
	
		if ( config.get( 'wgPopupsBetaFeature' ) ) {
			return false;
		}
	
		return !userSettings.hasIsEnabled() ||
			( userSettings.hasIsEnabled() && userSettings.getIsEnabled() );
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	var createModel,
		TYPE_GENERIC = 'generic',
		TYPE_PAGE = 'page';
	
	/**
	 * @typedef {Object} ext.popups.PreviewModel
	 * @property {String} title
	 * @property {String} url The canonical URL of the page being previewed
	 * @property {String} languageCode
	 * @property {String} languageDirection Either "ltr" or "rtl"
	 * @property {String|undefined} extract `undefined` if the extract isn't
	 *  viable, e.g. if it's empty after having ellipsis and parentheticals
	 *  removed
	 * @property {String} type Either "EXTRACT" or "GENERIC"
	 * @property {Object|undefined} thumbnail
	 */
	
	/**
	 * Creates a preview model.
	 *
	 * @param {String} title
	 * @param {String} url The canonical URL of the page being previewed
	 * @param {String} languageCode
	 * @param {String} languageDirection Either "ltr" or "rtl"
	 * @param {String} extract
	 * @param {Object|undefined} thumbnail
	 * @return {ext.popups.PreviewModel}
	 */
	createModel = function (
		title,
		url,
		languageCode,
		languageDirection,
		extract,
		thumbnail
	) {
		var processedExtract = processExtract( extract ),
			result = {
				title: title,
				url: url,
				languageCode: languageCode,
				languageDirection: languageDirection,
				extract: processedExtract,
				type: processedExtract === undefined ? TYPE_GENERIC : TYPE_PAGE,
				thumbnail: thumbnail
			};
	
		return result;
	};
	
	/**
	 * Processes the extract returned by the TextExtracts MediaWiki API query
	 * module.
	 *
	 * @param {String|undefined} extract
	 * @return {String|undefined}
	 */
	function processExtract( extract ) {
		var result;
	
		if ( extract === undefined || extract === '' ) {
			return undefined;
		}
	
		result = extract;
		result = removeParentheticals( result );
		result = removeEllipsis( result );
	
		return result.length > 0 ? result : undefined;
	}
	
	/**
	 * Removes the trailing ellipsis from the extract, if it's there.
	 *
	 * This function was extracted from
	 * `mw.popups.renderer.article#removeEllipsis`.
	 *
	 * @param {String} extract
	 * @return {String}
	 */
	function removeEllipsis( extract ) {
		return extract.replace( /\.\.\.$/, '' );
	}
	
	/**
	 * Removes parentheticals from the extract.
	 *
	 * If the parenthesis are unbalanced or out of order, then the extract is
	 * returned without further processing.
	 *
	 * This function was extracted from
	 * `mw.popups.renderer.article#removeParensFromText`.
	 *
	 * @param {String} extract
	 * @return {String}
	 */
	function removeParentheticals( extract ) {
		var
			ch,
			result = '',
			level = 0,
			i = 0;
	
		for ( i; i < extract.length; i++ ) {
			ch = extract.charAt( i );
	
			if ( ch === ')' && level === 0 ) {
				return extract;
			}
			if ( ch === '(' ) {
				level++;
				continue;
			} else if ( ch === ')' ) {
				level--;
				continue;
			}
			if ( level === 0 ) {
				// Remove leading spaces before brackets
				if ( ch === ' ' && extract.charAt( i + 1 ) === '(' ) {
					continue;
				}
				result += ch;
			}
		}
	
		return ( level === 0 ) ? result : extract;
	}
	
	module.exports = {
		/**
		* @constant {String}
		*/
		TYPE_GENERIC: TYPE_GENERIC,
		/**
		* @constant {String}
		*/
		TYPE_PAGE: TYPE_PAGE,
		createModel: createModel
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	( function ( mw, $ ) {
	
		/**
		 * @private
		 *
		 * Gets the title of a local page from an href given some configuration.
		 *
		 * @param {String} href
		 * @param {mw.Map} config
		 * @return {String|undefined}
		 */
		function getTitle( href, config ) {
			var linkHref,
				matches,
				queryLength,
				titleRegex = new RegExp( mw.RegExp.escape( config.get( 'wgArticlePath' ) )
					.replace( '\\$1', '(.+)' ) );
	
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
	
			queryLength = Object.keys( linkHref.query ).length;
	
			// No query params (pretty URL)
			if ( !queryLength ) {
				matches = titleRegex.exec( linkHref.path );
				return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
			} else if ( queryLength === 1 && linkHref.query.hasOwnProperty( 'title' ) ) {
				// URL is not pretty, but only has a `title` parameter
				return linkHref.query.title;
			}
	
			return undefined;
		}
	
		/**
		 * Processes and returns link elements (or "`<a>`s") that are eligible for
		 * previews in a given container.
		 *
		 * An `<a>` is eligible for a preview if:
		 *
		 * * It has an href and a title, i.e. `<a href="/wiki/Foo" title="Foo" />`.
		 * * It doesn't have any blacklisted CSS classes.
		 * * Its href is a valid URI of a page on the local wiki.
		 *
		 * If an `<a>` is eligible, then the title of the page on the local wiki is
		 * stored in the `data-previews-page-title` attribute for later reuse.
		 *
		 * @param {jQuery} $container
		 * @param {String[]} blacklist If an `<a>` has one or more of these CSS
		 *  classes, then it will be ignored.
		 * @param {mw.Map} config
		 *
		 * @return {jQuery}
		 */
		module.exports = function ( $container, blacklist, config ) {
			var contentNamespaces;
	
			contentNamespaces = config.get( 'wgContentNamespaces' );
	
			return $container
				.find( 'a[href][title]:not(' + blacklist.join( ', ' ) + ')' )
				.filter( function () {
					var title,
						titleText = getTitle( this.href, config );
	
					if ( !titleText ) {
						return false;
					}
					// Is titleText in a content namespace?
					title = mw.Title.newFromText( titleText );
					if ( title && ( $.inArray( title.namespace, contentNamespaces ) >= 0 ) ) {
						$( this ).data( 'page-previews-title', titleText );
	
						return true;
					}
				} );
		};
	
	}( mediaWiki, jQuery ) );


/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * @typedef {Function} ext.popups.ChangeListener
	 * @param {Object} prevState The previous state
	 * @param {Object} state The current state
	 */
	
	/**
	 * Registers a change listener, which is bound to the
	 * [store](http://redux.js.org/docs/api/Store.html).
	 *
	 * A change listener is a function that is only invoked when the state in the
	 * [store](http://redux.js.org/docs/api/Store.html) changes. N.B. that there
	 * may not be a 1:1 correspondence with actions being dispatched to the store
	 * and the state in the store changing.
	 *
	 * See [Store#subscribe](http://redux.js.org/docs/api/Store.html#subscribe)
	 * for more information about what change listeners may and may not do.
	 *
	 * @param {Redux.Store} store
	 * @param {ext.popups.ChangeListener} callback
	 */
	module.exports = function ( store, callback ) {
		// This function is based on the example in [the documentation for
		// Store#subscribe](http://redux.js.org/docs/api/Store.html#subscribe),
		// which was written by Dan Abramov.
	
		var state;
	
		store.subscribe( function () {
			var prevState = state;
	
			state = store.getState();
	
			if ( prevState !== state ) {
				callback( prevState, state );
			}
		} );
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		eventLogging: __webpack_require__( 29 ),
		preview: __webpack_require__( 31 ),
		settings: __webpack_require__( 32 )
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var actionTypes = __webpack_require__( 4 ),
		nextState = __webpack_require__( 30 ),
		counts = __webpack_require__( 16 );
	
	/**
	 * Initialize the data that's shared between all events logged with [the Popups
	 * schema](https://meta.wikimedia.org/wiki/Schema:Popups).
	 *
	 * @param {Object} bootAction
	 * @return {Object}
	 */
	function getBaseData( bootAction ) {
		var result = {
			pageTitleSource: bootAction.page.title,
			namespaceIdSource: bootAction.page.namespaceID,
			pageIdSource: bootAction.page.id,
			isAnon: bootAction.user.isAnon,
			popupEnabled: bootAction.isEnabled,
			pageToken: bootAction.pageToken,
			sessionToken: bootAction.sessionToken,
			previewCountBucket: counts.getPreviewCountBucket( bootAction.user.previewCount ),
			hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
		};
	
		if ( !bootAction.user.isAnon ) {
			result.editCountBucket = counts.getEditCountBucket( bootAction.user.editCount );
		}
	
		return result;
	}
	
	/**
	 * Reducer for actions that may result in an event being logged with the
	 * Popups schema via Event Logging.
	 *
	 * TODO: For obvious reasons, this reducer and the associated change listener
	 * are tightly bound to the Popups schema. This reducer must be
	 * renamed/moved if we introduce additional instrumentation.
	 *
	 * The base data represents data that's shared between all events. Very nearly
	 * all of it is initialized during the BOOT action (see `getBaseData`) and
	 * doesn't change between link interactions, e.g. the user being an anon or
	 * the number of edits they've made.
	 *
	 * The user's number of previews, however, does change between link
	 * interactions and the associated bucket (a computed property) is what is
	 * logged. This is reflected in the state tree: the `previewCount` property is
	 * used to store the user's number of previews and the
	 * `baseData.previewCountBucket` property is used to store the associated
	 * bucket.
	 *
	 * @param {Object} state
	 * @param {Object} action
	 * @return {Object} The state as a result of processing the action
	 */
	module.exports = function ( state, action ) {
		var nextCount, abandonEvent;
	
		if ( state === undefined ) {
			state = {
				previewCount: undefined,
				baseData: {},
				interaction: undefined,
				event: undefined
			};
		}
	
		switch ( action.type ) {
			case actionTypes.BOOT:
				return nextState( state, {
					previewCount: action.user.previewCount,
					baseData: getBaseData( action ),
					event: {
						action: 'pageLoaded'
					}
				} );
	
			case actionTypes.CHECKIN:
				return nextState( state, {
					event: {
						action: 'checkin',
						checkin: action.time
					}
				} );
	
			case actionTypes.EVENT_LOGGED:
				return nextState( state, {
					event: undefined
				} );
	
			case actionTypes.FETCH_END:
				return nextState( state, {
					interaction: nextState( state.interaction, {
						previewType: action.result.type
					} )
				} );
	
			case actionTypes.PREVIEW_SHOW:
				nextCount = state.previewCount + 1;
	
				return nextState( state, {
					previewCount: nextCount,
					baseData: nextState( state.baseData, {
						previewCountBucket: counts.getPreviewCountBucket( nextCount )
					} ),
					interaction: nextState( state.interaction, {
						timeToPreviewShow: action.timestamp - state.interaction.started
					} )
				} );
	
			case actionTypes.LINK_DWELL:
				return nextState( state, {
					interaction: {
						token: action.token,
						started: action.timestamp
					}
				} );
	
			case actionTypes.LINK_CLICK:
				return nextState( state, {
					event: {
						action: 'opened',
						linkInteractionToken: state.interaction.token,
						totalInteractionTime: Math.round( action.timestamp - state.interaction.started )
					}
				} );
	
			case actionTypes.ABANDON_START:
				return nextState( state, {
					interaction: nextState( state.interaction, {
						finished: action.timestamp
					} )
				} );
	
			case actionTypes.ABANDON_END:
				abandonEvent = {
					linkInteractionToken: state.interaction.token,
					totalInteractionTime: Math.round( state.interaction.finished - state.interaction.started )
				};
	
				// Has the preview been shown? If so, then, in the context of the
				// instrumentation, then the preview has been dismissed by the user
				// rather than the user has abandoned the link.
				if ( state.interaction.timeToPreviewShow !== undefined ) {
					abandonEvent.action = 'dismissed';
					abandonEvent.previewType = state.interaction.previewType;
				} else {
					abandonEvent.action = 'dwelledButAbandoned';
				}
	
				return nextState( state, {
					event: abandonEvent
				} );
	
			default:
				return state;
		}
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Creates the next state tree from the current state tree and some updates.
	 *
	 * N.B. OO.copy doesn't copy Element instances, whereas $.extend does.
	 * However, OO.copy does copy properties whose values are undefined or null,
	 * whereas $.extend doesn't. Since the state tree contains an Element instance
	 * - the preview.activeLink property - and we want to copy undefined/null into
	 * the state we need to manually iterate over updates and check with
	 * hasOwnProperty to copy over to the new state.
	 *
	 * In [change listeners](/doc/change_listeners.md), for example, we talk about
	 * the previous state and the current state (the `prevState` and `state`
	 * parameters, respectively). Since
	 * [reducers](http://redux.js.org/docs/basics/Reducers.html) take the current
	 * state and an action and make updates, "next state" seems appropriate.
	 *
	 * @param {Object} state
	 * @param {Object} updates
	 * @return {Object}
	 */
	module.exports = function ( state, updates ) {
		var result = {},
			key;
	
		for ( key in state ) {
			if ( state.hasOwnProperty( key ) && !updates.hasOwnProperty( key ) ) {
				result[ key ] = state[ key ];
			}
		}
	
		for ( key in updates ) {
			if ( updates.hasOwnProperty( key ) ) {
				result[ key ] = updates[ key ];
			}
		}
	
		return result;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var actionTypes = __webpack_require__( 4 ),
		nextState = __webpack_require__( 30 );
	
	/**
	 * Reducer for actions that modify the state of the preview model
	 *
	 * @param {Object} state before action
	 * @param {Object} action Redux action that modified state.
	 *  Must have `type` property.
	 * @return {Object} state after action
	 */
	module.exports = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				enabled: undefined,
				activeLink: undefined,
				activeEvent: undefined,
				activeToken: '',
				shouldShow: false,
				isUserDwelling: false
			};
		}
	
		switch ( action.type ) {
			case actionTypes.BOOT:
				return nextState( state, {
					enabled: action.isEnabled
				} );
			case actionTypes.SETTINGS_CHANGE:
				return nextState( state, {
					enabled: action.enabled
				} );
			case actionTypes.LINK_DWELL:
				// New interaction
				if ( action.el !== state.activeLink ) {
					return nextState( state, {
						activeLink: action.el,
						activeEvent: action.event,
						activeToken: action.token,
	
						// When the user dwells on a link with their keyboard, a preview is
						// renderered, and then dwells on another link, the ABANDON_END
						// action will be ignored.
						//
						// Ensure that all the preview is hidden.
						shouldShow: false,
	
						isUserDwelling: true
					} );
				} else {
					// Dwelling back into the same link
					return nextState( state, {
						isUserDwelling: true
					} );
				}
	
			case actionTypes.ABANDON_END:
				if ( action.token === state.activeToken && !state.isUserDwelling ) {
					return nextState( state, {
						activeLink: undefined,
						activeToken: undefined,
						activeEvent: undefined,
						fetchResponse: undefined,
						shouldShow: false
					} );
				}
				return state;
	
			case actionTypes.PREVIEW_DWELL:
				return nextState( state, {
					isUserDwelling: true
				} );
	
			case actionTypes.ABANDON_START:
				return nextState( state, {
					isUserDwelling: false
				} );
	
			case actionTypes.FETCH_START:
				return nextState( state, {
					fetchResponse: undefined
				} );
			case actionTypes.FETCH_END:
				if ( action.el === state.activeLink ) {
					return nextState( state, {
						fetchResponse: action.result,
						shouldShow: true
					} );
				}
	
				/* falls through */
			default:
				return state;
		}
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var actionTypes = __webpack_require__( 4 ),
		nextState = __webpack_require__( 30 );
	
	/**
	 * Reducer for actions that modify the state of the settings
	 *
	 * @param {Object} state
	 * @param {Object} action
	 * @return {Object} state after action
	 */
	module.exports = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				shouldShow: false,
				showHelp: false,
				shouldShowFooterLink: false
			};
		}
	
		switch ( action.type ) {
			case actionTypes.SETTINGS_SHOW:
				return nextState( state, {
					shouldShow: true,
					showHelp: false
				} );
			case actionTypes.SETTINGS_HIDE:
				return nextState( state, {
					shouldShow: false,
					showHelp: false
				} );
			case actionTypes.SETTINGS_CHANGE:
				return action.wasEnabled === action.enabled ?
					// If the setting is the same, just hide the dialogs
					nextState( state, {
						shouldShow: false
					} ) :
					// If the settings have changed...
					nextState( state, {
						// If we enabled, we just hide directly, no help
						// If we disabled, keep it showing and let the ui show the help.
						shouldShow: !action.enabled,
						showHelp: !action.enabled,
	
						// Since the footer link is only ever shown to anonymous users (see
						// the BOOT case below), state.userIsAnon is always truthy here.
						shouldShowFooterLink: !action.enabled
					} );
	
			case actionTypes.BOOT:
				return nextState( state, {
					shouldShowFooterLink: action.user.isAnon && !action.isEnabled
				} );
			default:
				return state;
		}
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;
	
	var _createStore = __webpack_require__(35);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(50);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(52);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(53);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(54);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _warning = __webpack_require__(51);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}
	
	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}
	
	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 34 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports['default'] = createStore;
	
	var _isPlainObject = __webpack_require__(36);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _symbolObservable = __webpack_require__(46);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;
	
	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }
	
	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }
	
	    return enhancer(createStore)(reducer, preloadedState);
	  }
	
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;
	
	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }
	
	    var isSubscribed = true;
	
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2['default'])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }
	
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }
	
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;
	
	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }
	
	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }
	
	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2['default']] = function () {
	      return this;
	    }, _ref;
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(37),
	    getPrototype = __webpack_require__(43),
	    isObjectLike = __webpack_require__(45);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(38),
	    getRawTag = __webpack_require__(41),
	    objectToString = __webpack_require__(42);
	
	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}
	
	module.exports = baseGetTag;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(39);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(40);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 40 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(38);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];
	
	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}
	
	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}
	
	module.exports = getRawTag;


/***/ },
/* 42 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(44);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(47);


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ponyfill = __webpack_require__(49);
	
	var _ponyfill2 = _interopRequireDefault(_ponyfill);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var root; /* global window */
	
	
	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (true) {
	  root = module;
	} else {
	  root = Function('return this')();
	}
	
	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(48)(module)))

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 49 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;
	
		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	var _createStore = __webpack_require__(35);
	
	var _isPlainObject = __webpack_require__(36);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _warning = __webpack_require__(51);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!(0, _isPlainObject2['default'])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
	  });
	
	  unexpectedKeys.forEach(function (key) {
	    unexpectedKeyCache[key] = true;
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	
	    if (process.env.NODE_ENV !== 'production') {
	      if (typeof reducers[key] === 'undefined') {
	        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
	      }
	    }
	
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);
	
	  if (process.env.NODE_ENV !== 'production') {
	    var unexpectedKeyCache = {};
	  }
	
	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
	      if (warningMessage) {
	        (0, _warning2['default'])(warningMessage);
	      }
	    }
	
	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	var _compose = __webpack_require__(54);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (createStore) {
	    return function (reducer, preloadedState, enhancer) {
	      var store = createStore(reducer, preloadedState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 54 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }
	
	  if (funcs.length === 1) {
	    return funcs[0];
	  }
	
	  var last = funcs[funcs.length - 1];
	  var rest = funcs.slice(0, -1);
	  return function () {
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }
	
	        return next(action);
	      };
	    };
	  };
	}
	
	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;
	
	exports['default'] = thunk;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map