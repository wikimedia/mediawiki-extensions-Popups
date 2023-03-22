/**
 * @module MediaWiki-Popups Integration
 */

import { previewTypes } from '../preview/model';

/**
 * This function provides a mw.popups object which can be used by 3rd party
 * to interact with Popups.
 *
 * @param {Redux.Store} store Popups store
 * @param {Function} registerModel allows extensions to register custom preview handlers.
 * @param {Function} registerPreviewUI allows extensions to register custom preview renderers.
 * @param {Function} registerGatewayForPreviewType allows extensions to register gateways for preview types.
 * @return {Object} external Popups interface
 */
export default function createMwPopups( store, registerModel, registerPreviewUI, registerGatewayForPreviewType ) {
	return {
		/**
		 * @return {boolean} If Page Previews are currently active
		 */
		isEnabled: function isEnabled() {
			return store.getState().preview.enabled[ previewTypes.TYPE_PAGE ];
		},
		/**
		 * @stable Do not remove properties in the type PopupModule without providing backwards
		 * compatibility and code that handles migrations.
		 *
		 * @typedef {Object} PopupSubtype
		 * @property {string} type A unique string for identifying the subtype of a page preview
		 * @property {function(ext.popups.PreviewModel): ext.popups.Preview}[renderFn] How the custom preview type will render the preview.
		 *  If not provided default renderer is used.
		 *
		 * @typedef {Object} PopupModule
		 * @property {string} type A unique string for identifying the type of page preview
		 * @property {string} selector A CSS selector which identifies elements that will display this type of page preview
		 * @property {Gateway} gateway A Gateway for obtaining the preview data.
		 * @property {function(ext.popups.PreviewModel): ext.popups.Preview}[renderFn] How the custom preview type will render the preview.
		 *  If not provided default renderer is used.
		 * @property {PopupSubtype[]} subTypes this is for registering types that are subsets of the current type e.g. share the same selector.
		 * @property {number} [delay] optional delay between hovering and displaying preview.
		 *  If not defined, delay will be zero.
		 */
		/**
		 * Register a custom preview type.
		 *
		 * @internal for use inside Extension:Popups only. If you want to register a preview
		 * type, please define `attributes` key in Extension:Popups like so:
		 * ```
		 * "attributes": {
		 *  "Popups": {
		 *    "PluginModules": [
		 *      "modulename"
		 *    ]
		 *  }
		 * ```
		 *
		 * @unstable
		 * @param {PopupModule} module
		 */
		register: function ( module ) {
			const { type, selector, gateway, renderFn, subTypes, delay, init } = module;
			if ( !type || !selector || !gateway ) {
				throw new Error(
					`Registration of Popups custom preview type "${type}" failed: You must specify a type, a selector, and a gateway.`
				);
			}
			registerModel( type, selector, delay );
			registerGatewayForPreviewType( type, gateway );
			registerPreviewUI( type, renderFn );
			if ( subTypes ) {
				subTypes.forEach( function ( subTypePreview ) {
					registerPreviewUI( subTypePreview.type, subTypePreview.renderFn );
				} );
			}
			// Run initialization function if provided.
			if ( typeof init === 'function' ) {
				init();
			}
		}
	};
}
