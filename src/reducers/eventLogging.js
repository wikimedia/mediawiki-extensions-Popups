var actionTypes = require( './../actionTypes' ),
	nextState = require( './nextState' ),
	counts = require( './../counts' );

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
 * @param {Object} interaction
 * @param {Number} endTimestamp
 * @return {Object}
 */
function createAbandonEvent( interaction ) {
	var result = {
		linkInteractionToken: interaction.token,
		totalInteractionTime: Math.round( interaction.finished - interaction.started )
	};

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
				event: state.interaction ? createAbandonEvent( state.interaction ) : undefined
			} );

		case actionTypes.PREVIEW_DWELL:
			return nextState( state, {
				interaction: nextState( state.interaction, {
					isUserDwelling: true
				} )
			} );

		case actionTypes.LINK_CLICK:
			return nextState( state, {
				interaction: undefined,
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
					event: createAbandonEvent( state.interaction )
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
