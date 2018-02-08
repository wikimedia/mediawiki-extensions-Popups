/**
 * @module reducers/pageviews
 */

import actionTypes from '../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that queues and clears events for
 * being logged as virtual page views [0]
 *
 * [0]: https://meta.wikimedia.org/wiki/Schema:VirtualPageViews
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object} The state resulting from reducing the action with the
 *  current state
 */
export default function pageviews( state, action ) {
	if ( state === undefined ) {
		state = {
			pageview: undefined
		};
	}

	switch ( action.type ) {
		case actionTypes.PAGEVIEW_LOGGED:
			return nextState( state, {
				pageview: undefined
			} );
		case actionTypes.PREVIEW_SEEN:
			return nextState( state, {
				pageview: {
					title: action.title,
					namespace: action.namespace
				}
			} );
		default:
			return state;
	}
}
