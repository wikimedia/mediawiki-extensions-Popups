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
	return ( oldState, newState ) => {
		let page, pageview;
		if ( newState.pageviews && newState.pageviews.pageview && newState.pageviews.page ) {
			page = newState.pageviews.page;
			pageview = newState.pageviews.pageview;
			pageviewTracker( 'event.VirtualPageView', {
				/* eslint-disable camelcase */
				source_page_id: page.id,
				source_namespace: page.namespaceId,
				source_title: mw.Title.newFromText( page.title ).getPrefixedDb(),
				source_url: page.url,
				page_id: pageview.page_id,
				page_namespace: pageview.page_namespace,
				page_title: mw.Title.newFromText( pageview.page_title ).getPrefixedDb()
				/* eslint-enable camelcase */
			} );
			// Clear the pageview now its been logged.
			boundActions.pageviewLogged();
		}
	};
}
