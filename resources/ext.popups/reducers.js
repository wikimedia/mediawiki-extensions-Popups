( function ( mw, $ ) {
	mw.popups.reducers = {};

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
	function nextState( state, updates ) {
		var result = {},
			key;

		for ( key in state ) {
			if ( state.hasOwnProperty( key ) && !updates.hasOwnProperty( key ) ) {
				result[key] = state[key];
			}
		}

		for ( key in updates ) {
			if ( updates.hasOwnProperty( key ) ) {
				result[key] = updates[key];
			}
		}

		return result;
	}

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
				enabled: undefined,
				sessionToken: undefined,
				pageToken: undefined,
				linkInteractionToken: undefined,
				activeLink: undefined,
				activeEvent: undefined,
				interactionStarted: undefined,
				shouldShow: false,
				isUserDwelling: false
			};
		}

		switch ( action.type ) {
			case mw.popups.actionTypes.BOOT:
				return nextState( state, {
					enabled: action.isUserInCondition,
					sessionToken: action.sessionToken,
					pageToken: action.pageToken
				} );
			case mw.popups.actionTypes.LINK_DWELL:
				return nextState( state, {
					activeLink: action.el,
					activeEvent: action.event,
					interactionStarted: action.interactionStarted,
					linkInteractionToken: action.linkInteractionToken,

					// When the user dwells on a link with their keyboard, a preview is
					// renderered, and then dwells on another link, the LINK_ABANDON_END
					// action will be ignored.
					//
					// Ensure that all the preview is hidden.
					shouldShow: false
				} );
			case mw.popups.actionTypes.LINK_ABANDON_END:
				if ( action.el !== state.activeLink ) {
					return state;
				}

				/* falls through */
			case mw.popups.actionTypes.PREVIEW_ABANDON_END:
				if ( !state.isUserDwelling ) {
					return nextState( state, {
						activeLink: undefined,
						activeEvent: undefined,
						interactionStarted: undefined,
						linkInteractionToken: undefined,
						fetchResponse: undefined,
						shouldShow: false
					} );
				}

				return state;

			case mw.popups.actionTypes.PREVIEW_DWELL:
				return nextState( state, {
					isUserDwelling: true
				} );
			case mw.popups.actionTypes.PREVIEW_ABANDON_START:
				return nextState( state, {
					isUserDwelling: false
				} );
			case mw.popups.actionTypes.FETCH_START:
				return nextState( state, {
					fetchResponse: undefined
				} );
			case mw.popups.actionTypes.FETCH_END:
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
				isAnimating: false,
				isInteractive: false,
				showSettings: false
			};
		}

		switch ( action.type ) {
			case mw.popups.actionTypes.PREVIEW_ANIMATING:
				return $.extend( {}, state, {
					isAnimating: true,
					isInteractive: false,
					showSettings: false
				} );
			case mw.popups.actionTypes.PREVIEW_INTERACTIVE:
				return $.extend( OO.copy( state ), {
					isAnimating: false,
					isInteractive: true,
					showSettings: false
				} );
			case mw.popups.actionTypes.PREVIEW_CLICK:
				return $.extend( OO.copy( state ), {
					isAnimating: false,
					isInteractive: false,
					showSettings: false
				} );
			case mw.popups.actionTypes.COG_CLICK:
				return $.extend( OO.copy( state ), {
					isAnimating: true,
					isInteractive: false,
					showSettings: true
				} );
			case mw.popups.actionTypes.SETTINGS_DIALOG_INTERACTIVE:
				return $.extend( OO.copy( state ), {
					isAnimating: false,
					isInteractive: true,
					showSettings: true
				} );
			case mw.popups.actionTypes.SETTINGS_DIALOG_CLOSED:
				return $.extend( OO.copy( state ), {
					isAnimating: false,
					isInteractive: false,
					showSettings: false
				} );
			default:
				return state;
		}
	};
}( mediaWiki, jQuery ) );
