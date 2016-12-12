( function ( mw, $ ) {

	var actions = {},
		types = {
			BOOT: 'BOOT',
			LINK_DWELL: 'LINK_DWELL',
			LINK_ABANDON_START: 'LINK_ABANDON_START',
			LINK_ABANDON_END: 'LINK_ABANDON_END',
			LINK_CLICK: 'LINK_CLICK',
			FETCH_START: 'FETCH_START',
			FETCH_END: 'FETCH_END',
			FETCH_FAILED: 'FETCH_FAILED',
			PREVIEW_DWELL: 'PREVIEW_DWELL',
			PREVIEW_ABANDON_START: 'PREVIEW_ABANDON_START',
			PREVIEW_ABANDON_END: 'PREVIEW_ABANDON_END',
			PREVIEW_ANIMATING: 'PREVIEW_ANIMATING',
			PREVIEW_INTERACTIVE: 'PREVIEW_INTERACTIVE',
			PREVIEW_SHOW: 'PREVIEW_SHOW',
			PREVIEW_CLICK: 'PREVIEW_CLICK',
			SETTINGS_DIALOG_RENDERED: 'SETTINGS_DIALOG_RENDERED',
			SETTINGS_SHOW: 'SETTINGS_SHOW',
			SETTINGS_HIDE: 'SETTINGS_HIDE',
			EVENT_LOGGED: 'EVENT_LOGGED'
		},
		FETCH_START_DELAY = 500, // ms.
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
	 * @param {Function} isUserInCondition See `mw.popups.createExperiment`
	 * @param {mw.user} user
	 * @param {ext.popups.UserSettings} userSettings
	 * @param {Function} generateToken
	 * @param {mw.Map} config The config of the MediaWiki client-side application,
	 *  i.e. `mw.config`
	 */
	actions.boot = function (
		isUserInCondition,
		user,
		userSettings,
		generateToken,
		config
	) {
		var editCount = config.get( 'wgUserEditCount' ),
			previewCount = userSettings.getPreviewCount();

		return {
			type: types.BOOT,
			sessionToken: user.sessionId(),
			pageToken: generateToken(),
			page: {
				title: config.get( 'wgTitle' ),
				namespaceID: config.get( 'wgNamespaceNumber' ),
				id: config.get( 'wgArticleId' )
			},
			user: {
				isInCondition: isUserInCondition(),
				isAnon: user.isAnon(),
				editCount: editCount,
				previewCount: previewCount
			}
		};
	};

	/**
	 * Represents Page Previews fetching data via the [gateway](./gateway.js).
	 *
	 * @param {ext.popups.Gateway} gateway
	 * @param {Element} el
	 * @return {Redux.Thunk}
	 */
	function fetch( gateway, el ) {
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
					dispatch( {
						type: types.FETCH_END,
						el: el,
						result: result
					} );
				} );
		};
	}

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
		var interactionToken = generateToken();

		return function ( dispatch, getState ) {
			dispatch( timedAction( {
				type: types.LINK_DWELL,
				el: el,
				event: event,
				interactionToken: interactionToken
			} ) );

			mw.popups.wait( FETCH_START_DELAY )
				.then( function () {
					var previewState = getState().preview;

					if ( previewState.enabled && previewState.activeLink === el ) {
						dispatch( fetch( gateway, el ) );
					}
				} );
		};
	};

	/**
	 * Represents the user abandoning a link, either by moving their mouse away
	 * from it or by shifting focus to another UI element using their keyboard or
	 * an assistive device.
	 *
	 * @param {Element} el
	 * @return {Object}
	 */
	actions.linkAbandon = function ( el ) {
		return function ( dispatch ) {
			dispatch( timedAction( {
				type: types.LINK_ABANDON_START,
				el: el
			} ) );

			mw.popups.wait( ABANDON_END_DELAY )
				.then( function () {
					dispatch( {
						type: types.LINK_ABANDON_END,
						el: el
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
	 * Represents the user abandoning a preview by moving their mouse away from
	 * it.
	 *
	 * @return {Object}
	 */
	actions.previewAbandon = function () {
		return function ( dispatch ) {
			dispatch( {
				type: types.PREVIEW_ABANDON_START
			} );

			mw.popups.wait( ABANDON_END_DELAY )
				.then( function () {
					dispatch( timedAction( {
						type: types.PREVIEW_ABANDON_END
					} ) );
				} );
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
	 * @return {Object}
	 */
	actions.saveSettings = function () {
		return function ( dispatch ) {
			// ...
			return dispatch( actions.hideSettings() );
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
