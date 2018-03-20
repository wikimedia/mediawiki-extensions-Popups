const $ = jQuery,
	mw = window.mediaWiki;

/**
 * Improves the plain text extracts
 * @param {String} plainTextExtract
 * @param {String} title
 * @return {Array}
 */
export function formatPlainTextExtract( plainTextExtract, title ) {
	let extract = plainTextExtract;
	if ( plainTextExtract === undefined ) {
		return [];
	}

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
	const elements = [],
		boldIdentifier = `<bi-${ Math.random() }>`,
		snip = `<snip-${ Math.random() }>`;

	title = title.replace( /\s+/g, ' ' ).trim(); // Remove extra white spaces
	const escapedTitle = mw.RegExp.escape( title ); // Escape RegExp elements
	const regExp = new RegExp( `(^|\\s)(${ escapedTitle })(|$)`, 'i' );

	// Remove text in parentheses along with the parentheses
	extract = extract.replace( /\s+/, ' ' ); // Remove extra white spaces

	// Make title bold in the extract text
	// As the extract is html escaped there can be no such string in it
	// Also, the title is escaped of RegExp elements thus can't have "*"
	extract = extract.replace(
		regExp,
		`$1${ snip }${ boldIdentifier }$2${ snip }$3`
	);
	extract = extract.split( snip );

	extract.forEach( part => {
		if ( part.indexOf( boldIdentifier ) === 0 ) {
			elements.push( $( '<b>' )
				.text( part.substring( boldIdentifier.length ) ) );
		} else {
			elements.push( document.createTextNode( part ) );
		}
	} );

	return elements;
}
