( function ( mw, $, Redux ) {
	mw.popups.reducers = {};

	/**
	 * Reducer for actions that modify the state of the preview model
	 *
	 * @param {Object} state before action
	 * @param {Object} action Redux action that modified state.
	 *  Must have `type` property.
	 * @return {Object} state after action
	 */
	mw.popups.reducers.preview = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				enabled: false,
				activeLink: undefined,
				previousActiveLink: undefined,
				interactionStarted: undefined,
				isDelayingFetch: false,
				isFetching: false,
				linkInteractionToken: undefined
			};
		}

		switch ( action.type ) {
			case mw.popups.actionTypes.BOOT:
				return $.extend( {}, state, {
					enabled: action.isUserInCondition
				} );
			default:
				return state;
		}
	};

	/**
	 * Reducer for actions that modify the state of the view
	 *
	 * @param {Object} state before action
	 * @param {Object} action Redux action that modified state.
	 *  Must have `type` property.
	 * @return {Object} state after action
	 */
	mw.popups.reducers.renderer = function ( state, action ) {
		if ( state === undefined ) {
			state = {
				isAanimating: false,
				isInteractive: false,
				showSettings: false
			};
		}

		switch ( action.type ) {
			case mw.popups.actionTypes.PREVIEW_ANIMATING:
				return $.extend( {}, state, {
					isAnimating: true
				} );
			default:
				return state;
		}
	};

	/**
	 * Root reducer for all actions
	 *
	 * @param {Object} global state before action
	 * @param {Object} action Redux action that modified state.
	 *  Must have `type` property.
	 * @return {Object} global state after action
	 */
	mw.popups.reducers.rootReducer = Redux.combineReducers( mw.popups.reducers );
}( mediaWiki, jQuery, Redux ) );
