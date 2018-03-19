/**
 * @module reducers/eventLogging
 */

import actionTypes from '../actionTypes';
import nextState from './nextState';
import * as counts from '../counts';

/**
 * Initialize the data that's shared between all events.
 *
 * @param {Object} bootAction
 * @return {Object}
 */
function getBaseData( bootAction ) {
	const result = {
		pageTitleSource: bootAction.page.title,
		namespaceIdSource: bootAction.page.namespaceId,
		pageIdSource: bootAction.page.id,
		isAnon: bootAction.user.isAnon,
		popupEnabled: bootAction.isEnabled,
		pageToken: bootAction.pageToken,
		sessionToken: bootAction.sessionToken,
		previewCountBucket: counts.getPreviewCountBucket(
			bootAction.user.previewCount
		),
		hovercardsSuppressedByGadget: bootAction.isNavPopupsEnabled
	};

	if ( !bootAction.user.isAnon ) {
		result.editCountBucket =
			counts.getEditCountBucket( bootAction.user.editCount );
	}

	return result;
}

/**
 * Takes data specific to the action and adds the following properties:
 *
 * * `linkInteractionToken`;
 * * `pageTitleHover` and `namespaceIdHover`; and
 * * `previewType` and `perceivedWait`, if a preview has been shown.
 *
 * @param {Object} interaction
 * @param {Object} actionData Data specific to the action, e.g. see
 *  {@link module:reducers/eventLogging~createClosingEvent `createClosingEvent`}
 * @return {Object}
 */
function createEvent( interaction, actionData ) {
	actionData.linkInteractionToken = interaction.token;
	actionData.pageTitleHover = interaction.title;
	actionData.namespaceIdHover = interaction.namespaceId;

	// Has the preview been shown?
	if ( interaction.timeToPreviewShow !== undefined ) {
		actionData.previewType = interaction.previewType;
		actionData.perceivedWait = interaction.timeToPreviewShow;
	}

	return actionData;
}

/**
 * Creates an event that, when mixed into the base data (see
 * {@link module:reducers/eventLogging~getBaseData `getBaseData`}), represents
 * the user abandoning a link or preview.
 *
 * Since the event should be logged when the user has either abandoned a link or
 * dwelled on a different link, we refer to these events as "closing" events as
 * the link interaction has finished and a new one will be created later.
 *
 * If the link interaction is finalized, then no closing event is created.
 *
 * @param {Object} interaction
 * @return {Object|undefined}
 */
function createClosingEvent( interaction ) {
	const actionData = {
		totalInteractionTime:
			Math.round( interaction.finished - interaction.started )
	};

	if ( interaction.finalized ) {
		return undefined;
	}

	// Has the preview been shown? If so, then, in the context of the
	// instrumentation, then the preview has been dismissed by the user
	// rather than the user has abandoned the link.
	actionData.action =
		interaction.timeToPreviewShow ? 'dismissed' : 'dwelledButAbandoned';

	return createEvent( interaction, actionData );
}

/**
 * Reducer for actions that may result in an event being logged with [the
 * Popups schema][0] via EventLogging.
 *
 * The complexity of this reducer reflects the complexity of [the schema][0],
 * which is compounded by the introduction of two delays introduced by the
 * system to provide reasonable performance and a consistent UX.
 *
 * The reducer must:
 *
 * * Accumulate the state required to log events. This state is
 *   referred to as "the interaction state" or "the interaction";
 * * Enforce the invariant that one event is logged per interaction;
 * * Defend against delayed actions being dispatched; and, as a direct
 *   consequence
 * * Handle transitioning from one interaction to another at the same time.
 *
 * Furthermore, we distinguish between "finalizing" and "closing" the current
 * interaction state. Since only one event should be logged per link
 * interaction, we say that the interaction state is *finalized* when an event
 * has been logged and is *closed* when a new interaction should be created.
 * In practice, the interaction state is only finalized when the user clicks a
 * link or a preview.
 *
 * [0]: https://meta.wikimedia.org/wiki/Schema:Popups
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */
export default function eventLogging( state, action ) {
	let nextCount, newState;
	const actionTypesWithTokens = [
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

	// If there is no interaction ongoing, ignore all actions except for:
	// * Application initialization
	// * New link dwells (which start a new interaction)
	// * Clearing queued events
	//
	// For example, after ctrl+clicking a link or preview, any other actions
	// until the new interaction should be ignored.
	if (
		!state.interaction &&
		action.type !== actionTypes.BOOT &&
		action.type !== actionTypes.LINK_DWELL &&
		action.type !== actionTypes.EVENT_LOGGED &&
		action.type !== actionTypes.SETTINGS_CHANGE
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
			newState = nextState( state, {
				event: undefined
			} );

			// If an event was logged with an interaction token, and it is still
			// the current interaction, finish the interaction since logging is
			// the exit point of the state machine and an interaction should never
			// be logged twice.
			if (
				action.event.linkInteractionToken &&
				state.interaction &&
				( action.event.linkInteractionToken === state.interaction.token )
			) {
				newState.interaction = undefined;
			}
			return newState;

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
					timeToPreviewShow:
						Math.round( action.timestamp - state.interaction.started )
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
					title: action.title,
					namespaceId: action.namespaceId,
					token: action.token,
					started: action.timestamp,

					isUserDwelling: true
				},

				// Was the user interacting with another link? If so, then log the
				// abandoned event.
				event: state.interaction ?
					createClosingEvent( state.interaction ) : undefined
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
				event: createEvent( state.interaction, {
					action: 'opened',
					totalInteractionTime:
						Math.round( action.timestamp - state.interaction.started )
				} )
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
				event: createEvent( state.interaction, {
					action: 'tapped settings cog'
				} )
			} );

		case actionTypes.SETTINGS_CHANGE:
			if ( action.wasEnabled && !action.enabled ) {
				return nextState( state, {
					event: {
						action: 'disabled',
						popupEnabled: false
					}
				} );
			} else {
				return state;
			}
		default:
			return state;
	}
}
