/**
 * @module referencePreview
 */

import { renderPopup } from '../popup/popup';
import { createNodeFromTemplate, escapeHTML } from '../templateUtil';

const templateHTML = `
<div class="mwe-popups-container">
    <div class="mwe-popups-extract">
        <div class="mwe-popups-scroll">
            <strong class="mwe-popups-title">
                <span class="mw-ui-icon mw-ui-icon-element"></span>
                <span class="mwe-popups-title-placeholder"></span>
            </strong>
            <div class="mw-parser-output"></div>
        </div>
        <div class="mwe-popups-fade"></div>
    </div>
	<footer>
		<div class="mwe-popups-settings"></div>
	</footer>
</div>`;

const LOGGING_SCHEMA = 'event.ReferencePreviewsPopups';
let isTracking = false;
$( () => {
	if ( mw.config.get( 'wgPopupsReferencePreviews' ) &&
		navigator.sendBeacon &&
		mw.config.get( 'wgIsArticle' ) &&
		!isTracking
	) {
		isTracking = true;
		mw.track( LOGGING_SCHEMA, { action: 'pageview' } );
	}
} );

/**
 * @param {ext.popups.ReferencePreviewModel} model
 * @return {JQuery}
 */
export function renderReferencePreview(
	model
) {
	const type = model.referenceType || 'generic';
	// The following messages are used here:
	// * popups-refpreview-book
	// * popups-refpreview-journal
	// * popups-refpreview-news
	// * popups-refpreview-note
	// * popups-refpreview-web
	let titleMsg = mw.message( `popups-refpreview-${type}` );
	if ( !titleMsg.exists() ) {
		titleMsg = mw.message( 'popups-refpreview-reference' );
	}

	const $el = renderPopup( model.type, createNodeFromTemplate( templateHTML ) );
	$el.find( '.mwe-popups-title-placeholder' )
		.replaceWith( escapeHTML( titleMsg.text() ) );
	// The following classes are used here:
	// * mw-ui-icon-reference-generic
	// * mw-ui-icon-reference-book
	// * mw-ui-icon-reference-journal
	// * mw-ui-icon-reference-news
	// * mw-ui-icon-reference-note
	// * mw-ui-icon-reference-web
	$el.find( '.mwe-popups-title .mw-ui-icon' )
		.addClass( `mw-ui-icon-reference-${type}` );
	$el.find( '.mw-parser-output' )
		.html( model.extract );

	// Make sure to not destroy existing targets, if any
	$el.find( '.mwe-popups-extract a[href][class~="external"]:not([target])' ).each( ( i, a ) => {
		a.target = '_blank';
		// Don't let the external site access and possibly manipulate window.opener.location
		a.rel = `${a.rel ? `${a.rel} ` : ''}noopener`;
	} );

	// We assume elements that benefit from being collapsible are to large for the popup
	$el.find( '.mw-collapsible' ).replaceWith( $( '<div>' )
		.addClass( 'mwe-collapsible-placeholder' )
		.append(
			$( '<span>' )
				.addClass( 'mw-ui-icon mw-ui-icon-element mw-ui-icon-infoFilled' ),
			$( '<div>' )
				.addClass( 'mwe-collapsible-placeholder-label' )
				.text( mw.msg( 'popups-refpreview-collapsible-placeholder' ) )
		)
	);

	// Undo remaining effects from the jquery.tablesorter.js plugin
	$el.find( 'table.sortable' ).removeClass( 'sortable jquery-tablesorter' )
		.find( '.headerSort' ).removeClass( 'headerSort' ).attr( { tabindex: null, title: null } );

	// TODO: Remove when not in Beta any more
	if ( !mw.config.get( 'wgPopupsReferencePreviewsBetaFeature' ) ) {
		// TODO: Do not remove this but move it up into the templateHTML constant!
		$el.find( '.mwe-popups-settings' ).append(
			$( '<a>' )
				.addClass( 'mwe-popups-settings-icon' )
				.append(
					$( '<span>' )
						.addClass( 'mw-ui-icon mw-ui-icon-element mw-ui-icon-small mw-ui-icon-settings' )
				)
		);
	} else {
		// Change the styling when there is no content in the footer (to prevent empty space)
		$el.find( '.mwe-popups-container' ).addClass( 'footer-empty' );
	}

	if ( isTracking ) {
		$el.find( '.mw-parser-output' ).on( 'click', 'a', () => {
			mw.track( LOGGING_SCHEMA, {
				action: 'clickedReferencePreviewsContentLink'
			} );
		} );
	}

	$el.find( '.mwe-popups-scroll' ).on( 'scroll', function ( e ) {
		const element = e.target,
			// We are dealing with floating point numbers here when the page is zoomed!
			scrolledToBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 1;

		if ( isTracking ) {
			if ( !element.isOpenRecorded ) {
				mw.track( LOGGING_SCHEMA, {
					action: 'poppedOpen',
					scrollbarsPresent: element.scrollHeight > element.clientHeight
				} );
				element.isOpenRecorded = true;
			}

			if (
				element.scrollTop > 0 &&
				!element.isScrollRecorded
			) {
				mw.track( LOGGING_SCHEMA, {
					action: 'scrolled'
				} );
				element.isScrollRecorded = true;
			}
		}

		if ( !scrolledToBottom && element.isScrolling ) {
			return;
		}

		const $extract = $( element ).parent(),
			hasHorizontalScroll = element.scrollWidth > element.clientWidth,
			scrollbarHeight = element.offsetHeight - element.clientHeight,
			hasVerticalScroll = element.scrollHeight > element.clientHeight,
			scrollbarWidth = element.offsetWidth - element.clientWidth;
		$extract.find( '.mwe-popups-fade' ).css( {
			bottom: hasHorizontalScroll ? `${scrollbarHeight}px` : 0,
			right: hasVerticalScroll ? `${scrollbarWidth}px` : 0
		} );

		element.isScrolling = !scrolledToBottom;
		$extract.toggleClass( 'mwe-popups-fade-out', element.isScrolling );
	} );

	return $el;
}
