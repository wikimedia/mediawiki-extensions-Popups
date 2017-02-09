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

	( function ( popups ) {
	
		popups.reducers = {
			eventLogging: __webpack_require__( 10 ),
			preview: __webpack_require__( 12 ),
			settings: __webpack_require__( 13 )
		};
	
	}( mediaWiki.popups ) );


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	( function ( popups, nextState ) {
	
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
				previewCountBucket: popups.counts.getPreviewCountBucket( bootAction.user.previewCount ),
				hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
			};
	
			if ( !bootAction.user.isAnon ) {
				result.editCountBucket = popups.counts.getEditCountBucket( bootAction.user.editCount );
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
				case popups.actionTypes.BOOT:
					return nextState( state, {
						previewCount: action.user.previewCount,
						baseData: getBaseData( action ),
						event: {
							action: 'pageLoaded'
						}
					} );
	
				case popups.actionTypes.CHECKIN:
					return nextState( state, {
						event: {
							action: 'checkin',
							checkin: action.time
						}
					} );
	
				case popups.actionTypes.EVENT_LOGGED:
					return nextState( state, {
						event: undefined
					} );
	
				case popups.actionTypes.FETCH_END:
					return nextState( state, {
						interaction: nextState( state.interaction, {
							previewType: action.result.type
						} )
					} );
	
				case popups.actionTypes.PREVIEW_SHOW:
					nextCount = state.previewCount + 1;
	
					return nextState( state, {
						previewCount: nextCount,
						baseData: nextState( state.baseData, {
							previewCountBucket: popups.counts.getPreviewCountBucket( nextCount )
						} ),
						interaction: nextState( state.interaction, {
							timeToPreviewShow: action.timestamp - state.interaction.started
						} )
					} );
	
				case popups.actionTypes.LINK_DWELL:
					return nextState( state, {
						interaction: {
							token: action.token,
							started: action.timestamp
						}
					} );
	
				case popups.actionTypes.LINK_CLICK:
					return nextState( state, {
						event: {
							action: 'opened',
							linkInteractionToken: state.interaction.token,
							totalInteractionTime: Math.round( action.timestamp - state.interaction.started )
						}
					} );
	
				case popups.actionTypes.ABANDON_START:
					return nextState( state, {
						interaction: nextState( state.interaction, {
							finished: action.timestamp
						} )
					} );
	
				case popups.actionTypes.ABANDON_END:
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
	
	}( mediaWiki.popups, __webpack_require__( 11 ) ) );


/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	( function ( popups, nextState ) {
	
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
				case popups.actionTypes.BOOT:
					return nextState( state, {
						enabled: action.isEnabled
					} );
				case popups.actionTypes.SETTINGS_CHANGE:
					return nextState( state, {
						enabled: action.enabled
					} );
				case popups.actionTypes.LINK_DWELL:
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
	
				case popups.actionTypes.ABANDON_END:
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
	
				case popups.actionTypes.PREVIEW_DWELL:
					return nextState( state, {
						isUserDwelling: true
					} );
	
				case popups.actionTypes.ABANDON_START:
					return nextState( state, {
						isUserDwelling: false
					} );
	
				case popups.actionTypes.FETCH_START:
					return nextState( state, {
						fetchResponse: undefined
					} );
				case popups.actionTypes.FETCH_END:
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
	
	}( mediaWiki.popups, __webpack_require__( 11 ) ) );


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	( function ( popups, nextState ) {
	
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
				case popups.actionTypes.SETTINGS_SHOW:
					return nextState( state, {
						shouldShow: true,
						showHelp: false
					} );
				case popups.actionTypes.SETTINGS_HIDE:
					return nextState( state, {
						shouldShow: false,
						showHelp: false
					} );
				case popups.actionTypes.SETTINGS_CHANGE:
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
	
				case popups.actionTypes.BOOT:
					return nextState( state, {
						shouldShowFooterLink: action.user.isAnon && !action.isEnabled
					} );
				default:
					return state;
			}
		};
	
	}( mediaWiki.popups, __webpack_require__( 11 ) ) );


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map