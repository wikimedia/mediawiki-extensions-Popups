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
 * @param {String} referrer url
 * @return {ext.popups.ChangeListener}
 */
export default function pageviews(
	boundActions, pageviewTracker, referrer
) {
	return function ( _, state ) {
		if ( state.pageviews && state.pageviews.pageview ) {
			pageviewTracker( 'event.VirtualPageView', $.extend( {},
				{
					referrer: referrer
				},
				state.pageviews.pageview )
			);
			// Clear the pageview now its been logged.
			boundActions.pageviewLogged();
		}
	};
}
