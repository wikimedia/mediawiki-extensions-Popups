/**
 * @module getPageviewTracker
 */
const mw = window.mediaWiki;
/**
 * @typedef {Object} MwCodeLoader
 *
 * Loads code from the server to the client on demand.
 *
 * @param {array} dependencies to load
 * @return {jQuery.Deferred} resolving when the code is loaded and
 *   can be used by the client.
 *
 * @global
 */

/**
 * Convert the first letter of a string to uppercase.
 *
 * @param {string} word
 * @return {string}
 */
function titleCase( word ) {
	return word[ 0 ].toUpperCase() + word.slice( 1 );
}

/**
 * Convert Title properties into mediawiki canonical form
 * @param {Object} eventData
 * @return {Object}
 */
function prepareEventData( eventData ) {
	const data = eventData;
	/* eslint-disable camelcase */
	data.source_title = mw.Title.newFromText( eventData.source_title )
		.getPrefixedDb();
	data.page_title = mw.Title.newFromText( eventData.page_title )
		.getPrefixedDb();
	/* eslint-enable camelcase */
	return data;
}

/**
 * Gets the appropriate analytics event tracker for logging virtual pageviews.
 * Note this bypasses EventLogging in order to track virtual pageviews
 * for pages where the DNT header (do not track) has been added.
 * This is explained in https://phabricator.wikimedia.org/T187277.
 *
 * @param {Object} config
 * @param {MwCodeLoader} loader that can source code that obeys the
 *  EventLogging api specification.
 * @param {Function} trackerGetter when called returns an instance
 *  of MediaWiki's EventLogging client
 * @param {Function} sendBeacon see
 *  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
 * @return {EventTracker}
 */
function getPageviewTracker( config, loader, trackerGetter, sendBeacon ) {
	const pageviewTracker = function ( topic, eventData ) {
		const schema = titleCase( topic.slice( topic.indexOf( '.' ) + 1 ) );
		const dependencies = [ 'ext.eventLogging', `schema.${schema}` ];
		return loader( dependencies ).then( function () {
			const evLog = trackerGetter();
			const payload = evLog.prepare( schema, prepareEventData( eventData ) );
			const url = evLog.makeBeaconUrl( payload );
			sendBeacon( url );
		} );
	};
	return config.get( 'wgPopupsVirtualPageViews' ) ? pageviewTracker : $.noop;
}

/**
 * Gets a function that can asynchronously transfer a small amount of data
 * over HTTP to a web server.
 *
 * @param {Window.Navigator} navigatorObj
 * @return {Function}
 */
function getSendBeacon( navigatorObj ) {
	return navigatorObj.sendBeacon ?
		navigatorObj.sendBeacon.bind( navigatorObj ) :
		( url ) => {
			document.createElement( 'img' ).src = url;
		};
}

export { getSendBeacon };
export default getPageviewTracker;
