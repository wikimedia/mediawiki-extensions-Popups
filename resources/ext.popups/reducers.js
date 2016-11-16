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
				enabled: undefined,
				sessionToken: undefined,
				pageToken: undefined,
				linkInteractionToken: undefined,
				activeLink: undefined,
				previousActiveLink: undefined,
				interactionStarted: undefined,
				isDelayingFetch: false,
				isFetching: false
			};
		}

		switch ( action.type ) {
			case mw.popups.actionTypes.BOOT:
				// FIXME: $.extend doesn't copy properties whose values are null or
				// undefined. If we were to do the following:
				//
				//   return $.extend( {}, state, { /* ... */ } );
				//
				// Then the shape of the state tree would vary. Is this necessarily bad?
				return $.extend( OO.copy( state ), {
					enabled: action.isUserInCondition,
					sessionToken: action.sessionToken,
					pageToken: action.pageToken
				} );
			case mw.popups.actionTypes.LINK_DWELL:
				return $.extend( OO.copy( state ), {
					activeLink: action.activeLink,
					interactionStarted: action.interactionStarted,
					isDelayingFetch: true,
					linkInteractionToken: action.linkInteractionToken
				} );
			case mw.popups.actionTypes.LINK_ABANDON:
				// Should the action handle dispatching a FETCH_FAILED
				// if a new fetch has begun? Or should the reducer?
				return $.extend( OO.copy( state ), {
					previousActiveLink: state.activeLink,
					activeLink: undefined,
					interactionStarted: undefined,
					isDelayingFetc: false,
					linkInteractionToken: undefined
				} );
			case mw.popups.actionTypes.LINK_CLICK:
				return $.extend( OO.copy( state ), {
					isDelayingFetch: false
				} );
			case mw.popups.actionTypes.FETCH_START:
				return $.extend( OO.copy( state ), {
					isDelayingFetch: false,
					isFetching: true,
					fetchResponse: undefined
				} );
			case mw.popups.actionTypes.FETCH_END:
				return $.extend( OO.copy( state ), {
					isFetching: false,
					fetchResponse: action.response
				} );
			case mw.popups.actionTypes.FETCH_FAILED:
				return $.extend( OO.copy( state ), {
					isFetching: false,
					fetchResponse: action.response // To catch error data if it exists
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
