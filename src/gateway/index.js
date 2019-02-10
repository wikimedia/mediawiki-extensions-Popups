/**
 * @module gateway
 */

import { previewTypes } from '../preview/model';

const $ = jQuery;

/**
 * The interface implemented by all preview gateways.
 * @typedef Gateway
 * @prop {Function(string): JQuery.jqXHR} fetch
 * @prop {FetchPreviewForTitle} fetchPreviewForTitle
 * @prop {ConvertPageToModel} convertPageToModel
 */

/**
 * A Promise, usually for a long running or costly task such as an HTTP request,
 * that is abortable.
 * @template T
 * @typedef {JQuery.Promise<T>} AbortPromise
 * @prop {Function(): void} abort
 */

/**
 * Fetches a preview for a page or reference.
 *
 * If the underlying request is successful and contains data for the requested title,
 * then the resulting promise will resolve. If not, then it will reject.
 *
 * @typedef {Function(mw.Title, Element): AbortPromise<PreviewModel>} FetchPreviewForTitle
 */

/**
 * Converts the API response to a preview model. Exposed for testing only.
 *
 * @typedef {Function(object, ...any): PreviewModel} ConvertPageToModel
 */

/**
 * Select the general gateway type depending on the applicable popup type.
 *
 * @param {Element} el
 * @param {mw.Map} config
 * @param {mw.Title} title
 * @return {string}
 */
export default function selectGatewayType( el, config, title ) {
	if ( config.get( 'wgPopupsReferencePreviews' ) ) {
		// The other selector can potentially pick up self-links with a class="reference"
		// parent, but no fragment
		if ( title.getFragment() &&
			title.getPrefixedDb() === config.get( 'wgPageName' ) &&
			$( el ).parent().hasClass( 'reference' )
		) {
			return previewTypes.TYPE_REFERENCE;
		}
	}

	return previewTypes.TYPE_PAGE;
}
