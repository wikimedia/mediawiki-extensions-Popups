( function ( mw ) {

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
		};

	/**
	 * Represents Link Previews booting.
	 *
	 * When a Redux store is created, the `@@INIT` action is immediately
	 * dispatched to it. To avoid overriding the term, we refer to booting rather
	 * than initializing.
	 *
	 * Link Previews persists critical pieces of information to local storage.
	 * Since reading from and writing to local storage are synchronous, Link
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
	 * Represents the user dwelling on a link, either by hovering over it with
	 * their mouse or by focussing it using their keyboard or an assistive device.
	 *
	 * @param {jQuery} $el
	 * @return {Object}
	 */
	actions.linkDwell = function ( $el ) {
		return {
			type: types.LINK_DWELL,
			el: $el
		};
	};

	/**
	 * Represents the user abandoning a link, either by moving their mouse away
	 * from it or by shifting focus to another UI element using their keyboard or
	 * an assistive device.
	 *
	 * @param {jQuery} $el
	 * @return {Object}
	 */
	actions.linkAbandon = function ( $el ) {
		return {
			type: types.LINK_ABANDON,
			el: $el
		};
	};

	/**
	 * Represents the user clicking on a link with their mouse, keyboard, or an
	 * assistive device.
	 *
	 * @param {jQuery} $el
	 * @return {Object}
	 */
	actions.linkClick = function ( $el ) {
		return {
			type: 'LINK_CLICK',
			el: $el
		};
	};

	mw.popups.actions = actions;
	mw.popups.actionTypes = types;

}( mediaWiki ) );
