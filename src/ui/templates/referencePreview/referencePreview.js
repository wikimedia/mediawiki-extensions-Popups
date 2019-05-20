/**
 * @module referencePreview
 */

import { renderPopup } from '../popup/popup';
import { escapeHTML } from '../templateUtil';

// Known citation type strings currently supported with icons and messages.
const KNOWN_TYPES = [ 'book', 'journal', 'news', 'web' ],
	mw = mediaWiki,
	$ = jQuery;

/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {JQuery}
 */
export function renderReferencePreview(
	model
) {
	const type = KNOWN_TYPES.indexOf( model.referenceType ) < 0 ? 'generic' : model.referenceType,
		// Messages:
		// popups-refpreview-book
		// popups-refpreview-journal
		// popups-refpreview-news
		// popups-refpreview-reference
		// popups-refpreview-web
		titleMsg = `popups-refpreview-${ type === 'generic' ? 'reference' : type }`,
		title = escapeHTML( mw.msg( titleMsg ) ),
		url = escapeHTML( model.url ),
		linkMsg = escapeHTML( mw.msg( 'popups-refpreview-jump-to-reference' ) );

	const $el = renderPopup( model.type,
		`
			<strong class='mwe-popups-title'>
				<span class='mw-ui-icon mw-ui-icon-element mw-ui-icon-reference-${ type }'></span>
				${ title }
			</strong>
			<div class='mwe-popups-extract'>
				<div class='mw-parser-output'>${ model.extract }</div>
				<div class='mwe-popups-fade' />
			</div>
			<footer>
				<a href='${ url }' class='mwe-popups-read-link'>${ linkMsg }</a>
			</footer>
		`
	);

	// Make sure to not destroy existing targets, if any
	$el.find( '.mwe-popups-extract a[href]:not([target])' ).each( ( i, a ) => {
		a.target = '_blank';
		// Don't let the external site access and possibly manipulate window.opener.location
		a.rel = `${ a.rel ? `${ a.rel } ` : '' }noopener`;
	} );

	if ( model.sourceElementId ) {
		$el.find( '.mwe-popups-read-link' ).on( 'click', ( event ) => {
			event.stopPropagation();
			$( `#${ $.escapeSelector( model.sourceElementId ) } > a:first-child` ).trigger( 'click' );
		} );
	}

	$el.find( '.mw-parser-output' ).on( 'scroll', function ( e ) {
		const element = e.target,
			// We are dealing with floating point numbers here when the page is zoomed!
			scrolledToBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 1;

		if ( !scrolledToBottom && element.isScrolling ) {
			return;
		}

		const $extract = $( element ).parent(),
			hasHorizontalScroll = element.scrollWidth !== element.scrollLeft + element.clientWidth,
			scrollbarHeight = element.offsetHeight - element.clientHeight;
		$extract.find( '.mwe-popups-fade' ).css(
			'bottom',
			hasHorizontalScroll ? `${ scrollbarHeight }px` : 0
		);

		element.isScrolling = !scrolledToBottom;
		$extract.toggleClass( 'mwe-popups-fade-out', element.isScrolling );
	} );

	return $el;
}
