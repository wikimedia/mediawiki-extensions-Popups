var $ = jQuery,
	mw = window.mediaWiki;

/**
 * Improves the plain text extracts
 * @param {String} plainTextExtract
 * @param {String} title
 * @returns {Array}
 */
export function formatPlainTextExtract( plainTextExtract, title ) {
	var extract = plainTextExtract;
	if ( plainTextExtract === undefined ) {
		return [];
	}

	extract = removeParentheticals( extract );
	extract = removeTrailingEllipsis( extract );

	// After cleaning the extract it may have been blanked
	if ( extract.length === 0 ) {
		return [];
	}

	extract = makeTitleInExtractBold( extract, title );
	return extract;
}

/**
 * Converts the extract into a list of elements, which correspond to fragments
 * of the extract. Fragments that match the title verbatim are wrapped in a
 * `<b>` element.
 *
 * Using the bolded elements of the extract of the page directly is covered by
 * [T141651](https://phabricator.wikimedia.org/T141651).
 *
 * Extracted from `mw.popups.renderer.article.getProcessedElements`.
 *
 * @param {String} extract
 * @param {String} title
 * @return {Array} A set of HTML Elements
 */
function makeTitleInExtractBold( extract, title ) {
	var regExp, escapedTitle,
		elements = [],
		boldIdentifier = '<bi-' + Math.random() + '>',
		snip = '<snip-' + Math.random() + '>';

	title = title.replace( /\s+/g, ' ' ).trim(); // Remove extra white spaces
	escapedTitle = mw.RegExp.escape( title ); // Escape RegExp elements
	regExp = new RegExp( '(^|\\s)(' + escapedTitle + ')(|$)', 'i' );

	// Remove text in parentheses along with the parentheses
	extract = extract.replace( /\s+/, ' ' ); // Remove extra white spaces

	// Make title bold in the extract text
	// As the extract is html escaped there can be no such string in it
	// Also, the title is escaped of RegExp elements thus can't have "*"
	extract = extract.replace( regExp, '$1' + snip + boldIdentifier + '$2' + snip + '$3' );
	extract = extract.split( snip );

	$.each( extract, function ( index, part ) {
		if ( part.indexOf( boldIdentifier ) === 0 ) {
			elements.push( $( '<b>' ).text( part.substring( boldIdentifier.length ) ) );
		} else {
			elements.push( document.createTextNode( part ) );
		}
	} );

	return elements;
}

/**
 * Removes the trailing ellipsis from the extract, if it's there.
 *
 * This function was extracted from
 * `mw.popups.renderer.article#removeEllipsis`.
 *
 * @param {String} extract
 * @return {String}
 */
export function removeTrailingEllipsis( extract ) {
	return extract.replace( /\.\.\.$/, '' );
}

/**
 * Removes parentheticals from the extract.
 *
 * If the parenthesis are unbalanced or out of order, then the extract is
 * returned without further processing.
 *
 * This function was extracted from
 * `mw.popups.renderer.article#removeParensFromText`.
 *
 * @param {String} extract
 * @return {String}
 */
export function removeParentheticals( extract ) {
	var
		ch,
		result = '',
		level = 0,
		i = 0;

	for ( i; i < extract.length; i++ ) {
		ch = extract.charAt( i );

		if ( ch === ')' && level === 0 ) {
			return extract;
		}
		if ( ch === '(' ) {
			level++;
			continue;
		} else if ( ch === ')' ) {
			level--;
			continue;
		}
		if ( level === 0 ) {
			// Remove leading spaces before brackets
			if ( ch === ' ' && extract.charAt( i + 1 ) === '(' ) {
				continue;
			}
			result += ch;
		}
	}

	return ( level === 0 ) ? result : extract;
}
