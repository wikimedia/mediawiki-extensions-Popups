/**
 * @module MediaWiki-Popups Integration
 */

import { previewTypes } from '../preview/model';

/**
 * This function provides a mw.popups object which can be used by 3rd party
 * to interact with Popups.
 *
 * @param {Redux.Store} store Popups store
 * @return {Object} external Popups interface
 */
export default function createMwPopups( store ) {
	return {
		/**
		 * @return {boolean} If Page Previews are currently active
		 */
		isEnabled: function isEnabled() {
			return store.getState().preview.enabled[ previewTypes.TYPE_PAGE ];
		}
	};
}
