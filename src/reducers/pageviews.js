/**
 * @module reducers/pageviews
 */

import actionTypes from '../actionTypes';
import nextState from './nextState';

/**
 * Reducer for actions that queues and clears events for
 * being logged as virtual pageviews [0]
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
		case actionTypes.BOOT:
			return nextState( state, {
				page: action.page
			} );
		case actionTypes.PAGEVIEW_LOGGED:
			return nextState( state, {
				pageview: undefined
			} );
		case actionTypes.PREVIEW_SEEN:
			return nextState( state, {
				pageview: {
					/* eslint-disable camelcase */
					page_title: action.title,
					page_id: action.pageId,
					page_namespace: action.namespace
					/* eslint-enable camelcase */
				}
			} );
		default:
			return state;
	}
}
