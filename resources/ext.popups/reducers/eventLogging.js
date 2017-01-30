( function ( popups, nextState ) {

	/**
	 * Reducer for actions that may result in an event being logged via Event
	 * Logging.
	 *
	 * The base data represents data that's shared between all events logged with
	 * the Popups schema ("Popups events"). Very nearly all of it is initialized
	 * during the BOOT action and doesn't change between link interactions, e.g.
	 * the user being an anon or the number of edits they've made.
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
		var nextCount;

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
					baseData: {
						pageTitleSource: action.page.title,
						namespaceIdSource: action.page.namespaceID,
						pageIdSource: action.page.id,
						isAnon: action.user.isAnon,
						popupEnabled: action.isEnabled,
						pageToken: action.pageToken,
						sessionToken: action.sessionToken,
						editCountBucket: popups.counts.getEditCountBucket( action.user.editCount ),
						previewCountBucket: popups.counts.getPreviewCountBucket( action.user.previewCount ),
						hovercardsSuppressedByGadget: action.isNavPopupsEnabled
					},
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
				return nextState( state, {
					event: {
						action: state.interaction.timeToPreviewShow ? 'dismissed' : 'dwelledButAbandoned',
						linkInteractionToken: state.interaction.token,
						totalInteractionTime: Math.round( state.interaction.finished - state.interaction.started )
					}
				} );

			default:
				return state;
		}
	};

}( mediaWiki.popups, mediaWiki.popups.nextState ) );
