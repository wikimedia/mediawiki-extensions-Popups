import actionTypes from './../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that result in Prometheus-compatible metrics.
 *
 * @param {Object|undefined} state
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
				action: 'stats.mediawiki_Popups_api_response_seconds',
				data: action.timestamp - state.fetchStartedAt
			} );

		case actionTypes.FETCH_FAILED:
			return nextState( state, {
				action: 'stats.mediawiki_Popups_api_failure_total',
				data: 1
			} );

		case actionTypes.LINK_DWELL:
			return nextState( state, {
				linkDwellStartedAt: action.timestamp
			} );

		case actionTypes.PREVIEW_SHOW:
			return nextState( state, {
				action: 'stats.mediawiki_Popups_preview_render_seconds',
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
