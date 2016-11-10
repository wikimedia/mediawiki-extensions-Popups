( function ( mw, Redux ) {

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
	 * @param {Function} isUserInCondition See `mw.popups.createExperiment`
	 */
	actions.boot = function ( isUserInCondition ) {
		return {
			type: types.BOOT,
			isUserInCondition: isUserInCondition()
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

	mw.popups.actionTypes = types;

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

	/**
	 * Creates an object whose methods encapsulate all actions that can be
	 * dispatched to the given
	 * [store](http://redux.js.org/docs/api/Store.html#store).
	 *
	 * @param {Store} store
	 * @return {Object}
	 */
	mw.popups.createActions = function ( store ) {
		return Redux.bindActionCreators( actions, store.dispatch );
	};

}( mediaWiki, Redux ) );
