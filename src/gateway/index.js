/**
 * @module gateway
 */

/**
 * The interface implemented by all preview gateways.
 *
 * @typedef Gateway
 * @property {function(string): JQuery.jqXHR} fetch
 * @property {FetchPreviewForTitle} fetchPreviewForTitle
 * @property {ConvertPageToModel} convertPageToModel
 */

/**
 * A Promise, usually for a long running or costly task such as an HTTP request,
 * that is abortable.
 *
 * @template T
 * @typedef {Promise<T>} AbortPromise
 * @property {function(): void} abort
 */

/**
 * @param {Promise|jQuery.Promise<T>} promise
 * @param {function(): void} [abort]
 * @return {AbortPromise}
 */
export function abortablePromise( promise, abort = () => {} ) {
	// JQuery provided.
	if ( promise.promise ) {
		return promise.promise( {
			abort
		} );
	}
	promise.abort = abort;
	return promise;
}

/**
 * Fetches a preview for a page or reference.
 *
 * If the underlying request is successful and contains data for the requested title,
 * then the resulting promise will resolve. If not, then it will reject.
 *
 * @typedef {function(mw.Title, HTMLAnchorElement): AbortPromise<PreviewModel>} FetchPreviewForTitle
 */

/**
 * Converts the API response to a preview model. Exposed for testing only.
 *
 * @typedef {function(Object, ...any): PagePreviewModel} ConvertPageToModel
 */

const gatewayMap = {};

/**
 * @param {string} type Type of preview we are handling
 * @return {Gateway|undefined}
 */
export function getGatewayForPreviewType( type ) {
	return gatewayMap[ type ];
}

/**
 * Register a gateway for a given preview type.
 *
 * @param {string} type preview type
 * @param {Gateway} gateway
 */
export function registerGatewayForPreviewType( type, gateway ) {
	gatewayMap[ type ] = gateway;
}
