( function ( mw ) {

	var ONE_DAY = 24 * 60 * 60 * 1000; // ms.

	/**
	 * @typedef {Object} ext.popups.PreviewModel
	 * @property {String} title
	 * @property {String} url The canonical URL of the page being previewed
	 * @property {String} languageCode
	 * @property {String} languageDirection Either "ltr" or "rtl"
	 * @property {String|undefined} extract `undefined` if the extract isn't
	 *  viable, e.g. if it's empty after having ellipsis and parentheticals
	 *  removed
	 * @property {Date|Number|undefined} lastModified
	 * @property {Bool|undefined} isRecent If `lastModified` is `undefined`, then
	 *  this will also be undefined; otherwise, whether or not `lastModified` is
	 *  less than 24 hours ago
	 * @property {Object|undefined} thumbnail
	 */

	/**
	 * Creates a preview model.
	 *
	 * @param {String} title
	 * @param {String} url The canonical URL of the page being previewed
	 * @param {String} languageCode
	 * @param {String} languageDirection Either "ltr" or "rtl"
	 * @param {String} extract
	 * @param {Date|Number|undefined} lastModified
	 * @param {Object|undefined} thumbnail
	 * @return {ext.popups.PreviewModel}
	 */
	mw.popups.preview.createModel = function (
		title,
		url,
		languageCode,
		languageDirection,
		extract,
		lastModified,
		thumbnail
	) {
		var result = {
			title: title,
			url: url,
			languageCode: languageCode,
			languageDirection: languageDirection,
			extract: processExtract( extract ),
			thumbnail: thumbnail
		};

		if ( lastModified ) {
			result.lastModified = lastModified;
			result.isRecent = mw.now() - lastModified < ONE_DAY;
		}

		return result;
	};

	/**
	 * Processes the extract returned by the TextExtracts MediaWiki API query
	 * module.
	 *
	 * @param {String|undefined} extract
	 * @return {String|undefined}
	 */
	function processExtract( extract ) {
		var result;

		if ( extract === undefined || extract === '' ) {
			return undefined;
		}

		result = extract;
		result = removeParentheticals( result );
		result = removeEllipsis( result );

		return result.length > 0 ? result : undefined;
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
	function removeEllipsis( extract ) {
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
	function removeParentheticals( extract ) {
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

}( mediaWiki ) );
