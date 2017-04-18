var actionTypes = require( './../actionTypes' ),
	nextState = require( './nextState' ),
	counts = require( './../counts' );

/**
 * Initialize the data that's shared between all
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) events.
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
		previewCountBucket: counts.getPreviewCountBucket( bootAction.user.previewCount ),
		hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
	};

	if ( !bootAction.user.isAnon ) {
		result.editCountBucket = counts.getEditCountBucket( bootAction.user.editCount );
	}

	return result;
}

/**
 * Creates an event that, when mixed into the base data (see `getBaseData`),
 * represents the user abandoning a link or preview.
 *
 * Since the event should be logged when the user has either abandoned a link or
 * dwelled on a different link, we refer to these events as "closing" events as
 * the link interaction has finished and a new one will be created later.
 *
 * If the link interaction is finalized, i.e. if an event has already been
 * logged for the link interaction, then no closing event is created.
 *
 * @param {Object} interaction
 * @return {Object|undefined}
 */
function createClosingEvent( interaction ) {
	var result = {
		linkInteractionToken: interaction.token,
		totalInteractionTime: Math.round( interaction.finished - interaction.started )
	};

	if ( interaction.finalized ) {
		return undefined;
	}

	// Has the preview been shown? If so, then, in the context of the
	// instrumentation, then the preview has been dismissed by the user
	// rather than the user has abandoned the link.
	if ( interaction.timeToPreviewShow !== undefined ) {
		result.action = 'dismissed';
		result.previewType = interaction.previewType;
	} else {
		result.action = 'dwelledButAbandoned';
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
 * The complexity of this reducer reflects the complexity of the
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) instrumentation. This
 * complexity is further increased by requiring that actions are conditionally
 * reduced rather than conditionally dispatched in order to handle two delays
 * introduced by the system in order to provide a consistent UX.
 *
 * The reducer must:
 *
 * * Accumulate the state required to log
 *   [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) events. This state
 *   is referred to as "the interaction state" or "the interaction";
 * * Handle only logging only one event per link interaction;
 * * Defend against delayed actions being dispatched and, as a direct
 *   consequence;
 * * Handle transitioning from one interaction to another at the same time.
 *
 * Furthermore, we distinguish between "finalizing" and "closing" the current
 * interaction state. Since only one
 * [Popups](https://meta.wikimedia.org/wiki/Schema:Popups) event should be
 * logged per link interaction, we say that the interaction state is
 * //finalized// when an event has been logged and is //closed// when a new
 * interaction state should be created, e.g. the interaction state is only
 * finalized when the user clicks a link or a preview.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */
module.exports = function ( state, action ) {
	var nextCount,
		actionTypesWithTokens = [
			actionTypes.FETCH_COMPLETE,
			actionTypes.ABANDON_END,
			actionTypes.PREVIEW_SHOW
		];

	if ( state === undefined ) {
		state = {
			previewCount: undefined,
			baseData: {},
			interaction: undefined,
			event: undefined
		};
	}

	// Was the action delayed? Then it requires a token to be reduced. Enforce
	// this here to avoid repetion and reduce nesting below.
	if (
		actionTypesWithTokens.indexOf( action.type ) !== -1 &&
		( !state.interaction || action.token !== state.interaction.token )
	) {
		return state;
	}

	switch ( action.type ) {
		case actionTypes.BOOT:
			return nextState( state, {
				previewCount: action.user.previewCount,
				baseData: getBaseData( action ),
				event: {
					action: 'pageLoaded'
				}
			} );

		case actionTypes.EVENT_LOGGED:
			return nextState( state, {
				event: undefined
			} );

		case actionTypes.FETCH_COMPLETE:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					previewType: action.result.type
				} )
			} );

		case actionTypes.PREVIEW_SHOW:
			nextCount = state.previewCount + 1;

			return nextState( state, {
				previewCount: nextCount,
				baseData: nextState( state.baseData, {
					previewCountBucket: counts.getPreviewCountBucket( nextCount )
				} ),
				interaction: nextState( state.interaction, {
					timeToPreviewShow: action.timestamp - state.interaction.started
				} )
			} );

		case actionTypes.LINK_DWELL:

			// Not a new interaction?
			if ( state.interaction && action.el === state.interaction.link ) {
				return nextState( state, {
					interaction: nextState( state.interaction, {
						isUserDwelling: true
					} )
				} );
			}

			return nextState( state, {

				// TODO: Extract this object into a module that can be shared between
				// this and the preview reducer.
				interaction: {
					link: action.el,
					token: action.token,
					started: action.timestamp,

					isUserDwelling: true
				},

				// Was the user interacting with another link? If so, then log the
				// abandoned event.
				event: state.interaction ? createClosingEvent( state.interaction ) : undefined
			} );

		case actionTypes.PREVIEW_DWELL:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					isUserDwelling: true
				} )
			} );

		case actionTypes.LINK_CLICK:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					finalized: true
				} ),
				event: {
					action: 'opened',
					linkInteractionToken: state.interaction.token,
					totalInteractionTime: Math.round( action.timestamp - state.interaction.started )
				}
			} );

		case actionTypes.ABANDON_START:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					finished: action.timestamp,

					isUserDwelling: false
				} )
			} );

		case actionTypes.ABANDON_END:
			if ( !state.interaction.isUserDwelling ) {
				return nextState( state, {
					interaction: undefined,
					event: createClosingEvent( state.interaction )
				} );
			}

			return state;

		case actionTypes.SETTINGS_SHOW:
			return nextState( state, {
				event: {
					action: 'tapped settings cog'
				}
			} );

		default:
			return state;
	}
};
