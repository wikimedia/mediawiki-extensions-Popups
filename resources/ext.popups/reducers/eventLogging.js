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
	popups.reducers.eventLogging = function ( state, action ) {
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

}( mediaWiki.popups, mediaWiki.popups.nextState ) );
