( function ( mw, $ ) {

	var actions = {},
		types = {
			BOOT: 'BOOT',
			LINK_DWELL: 'LINK_DWELL',
			LINK_ABANDON: 'LINK_ABANDON',
			LINK_CLICK: 'LINK_CLICK',
			FETCH_START: 'FETCH_START',
			FETCH_END: 'FETCH_END',
			FETCH_FAILED: 'FETCH_FAILED',
			PREVIEW_ANIMATING: 'PREVIEW_ANIMATING',
			PREVIEW_INTERACTIVE: 'PREVIEW_INTERACTIVE',
			PREVIEW_CLICK: 'PREVIEW_CLICK',
			COG_CLICK: 'COG_CLICK',
			SETTINGS_DIALOG_RENDERED: 'SETTINGS_DIALOG_RENDERED',
			SETTINGS_DIALOG_CLOSED: 'SETTINGS_DIALOG_CLOSED'
		},
		FETCH_START_DELAY = 500; // ms.

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
	 * @param {String} sessionToken
	 * @param {Function} generateToken
	 */
	actions.boot = function ( isUserInCondition, sessionToken, generateToken ) {
		return {
			type: types.BOOT,
			isUserInCondition: isUserInCondition(),
			sessionToken: sessionToken,
			pageToken: generateToken()
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
	 * @return {Redux.Thunk}
	 */
	actions.linkDwell = function ( el, event, gateway ) {
		return function ( dispatch, getState ) {
			dispatch( {
				type: types.LINK_DWELL,
				el: el,
				event: event,
				interactionStarted: mw.now()
			} );

			mw.popups.wait( FETCH_START_DELAY )
				.then( function () {
					if ( getState().preview.activeLink === el ) {
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
		return {
			type: types.LINK_ABANDON,
			el: el
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
		return {
			type: 'LINK_CLICK',
			el: el
		};
	};

	/**
	 * Represents the user clicking either the "Enable previews" footer menu link,
	 * or the "cog" icon that's present on each preview.
	 *
	 * @return {Object}
	 */
	actions.showSettings = function () {
		return {
			type: 'COG_CLICK'
		};
	};

	mw.popups.actions = actions;
	mw.popups.actionTypes = types;

}( mediaWiki, jQuery ) );
