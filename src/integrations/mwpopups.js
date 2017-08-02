/**
 * @module MediaWiki-Popups Integration
 */
var mw = mediaWiki;

/**
 * This function provides a mw.popups object which can be used by 3rd party
 * to interact with Popups. Currently it allows only to read isEnabled flag.
 *
 * @param {Redux.Store} store Popups store
 */
export default function registerMwPopups( store ) {
	mw.popups = {
		isEnabled: function isEnabled() {
			return store.getState().preview.enabled;
		}
	};

}
