( function ( mw, Redux ) {

	var actions = {};

	/**
	 * @param {Function} isUserInCondition See `mw.popups.createExperiment`
	 */
	actions.boot = function ( isUserInCondition ) {
		return {
			type: 'BOOT',
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
			type: 'LINK_DWELL',
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
			type: 'LINK_ABANDON',
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
