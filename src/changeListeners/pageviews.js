/**
 * @module changeListeners/pageviews
 */

/**
 * Creates an instance of the pageviews change listener.
 *
 * When a pageview enqueued it'll be logged using the VirtualPageView schema.
 * Note, it's the responsibility of Event Logging (and the UA) to
 * deliver logged events.
 *
 * @param {Object} boundActions
 * @param {EventTracker} pageviewTracker
 * @return {ext.popups.ChangeListener}
 */
export default function pageviews(
	boundActions, pageviewTracker
) {
	return ( _, state ) => {
		let page;
		if ( state.pageviews && state.pageviews.pageview && state.pageviews.page ) {
			page = state.pageviews.page;
			pageviewTracker( 'event.VirtualPageView', $.extend( {},
				{
					/* eslint-disable camelcase */
					source_page_id: page.id,
					source_namespace: page.namespaceId,
					source_title: page.title,
					source_url: page.url
					/* eslint-enable camelcase */
				},
				state.pageviews.pageview )
			);
			// Clear the pageview now its been logged.
			boundActions.pageviewLogged();
		}
	};
}
