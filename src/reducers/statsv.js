import actionTypes from './../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that may result in an event being logged via statsv.
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} state after action
 */
export default function statsv( state, action ) {
	state = state || {};

	switch ( action.type ) {
		case actionTypes.FETCH_START:
			return nextState( state, {
				fetchStartedAt: action.timestamp
			} );

		case actionTypes.FETCH_END:
			return nextState( state, {
				action: 'timing.PagePreviewsApiResponse',
				data: action.timestamp - state.fetchStartedAt
			} );

		case actionTypes.FETCH_FAILED:
			return nextState( state, {
				action: 'counter.PagePreviewsApiFailure',
				data: 1
			} );

		case actionTypes.LINK_DWELL:
			return nextState( state, {
				linkDwellStartedAt: action.timestamp
			} );

		case actionTypes.PREVIEW_SHOW:
			return nextState( state, {
				action: 'timing.PagePreviewsPreviewShow',
				data: action.timestamp - state.linkDwellStartedAt
			} );

		case actionTypes.STATSV_LOGGED:
			return nextState( state, {
				action: null,
				data: null
			} );

		default:
			return state;
	}
}
