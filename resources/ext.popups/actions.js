( function ( mw, $ ) {

	var actions = {},
		types = {
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
		},
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

			gateway( title )
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

	mw.popups.actions = actions;
	mw.popups.actionTypes = types;

}( mediaWiki, jQuery ) );
