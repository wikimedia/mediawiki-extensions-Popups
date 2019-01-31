/**
 * @module gateway
 */

import { previewTypes } from '../preview/model';

const $ = jQuery;

/**
 * @param {Element} el
 * @param {mw.Map} config
 * @param {mw.Title} title
 * @return {string}
 */
export default function selectGatewayType( el, config, title ) {
	let gateway = previewTypes.TYPE_PAGE;

	if ( config.get( 'wgPopupsReferencePreviews' ) ) {
		// The other selector can potentially pick up links with a class="reference" parent,
		// but no fragment
		if ( title.getFragment() &&
			$( el ).parent().hasClass( 'reference' )
		) {
			gateway = previewTypes.TYPE_REFERENCE;
		}
	}

	return gateway;
}
