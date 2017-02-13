var pageVisibility = {
	/**
	 * Cached value of the browser specific name of the `document.hidden` property
	 *
	 * Exposed for testing only.
	 *
	 * @type {null|undefined|string}
	 * @private
	 */
	documentHiddenPropertyName: null,
	/**
	 * Cached value of the browser specific name of the `document.visibilitychange` event
	 *
	 * Exposed for testing only.
	 *
	 * @type {null|undefined|string}
	 * @private
	 */
	documentVisibilityChangeEventName: null
};

/**
 * Return the browser specific name of the `document.hidden` property
 *
 * Exposed for testing only.
 *
 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * @private
 * @param {Object} doc window.document object
 * @return {string|undefined}
 */
pageVisibility.getDocumentHiddenPropertyName = function ( doc ) {
	var property;

	if ( pageVisibility.documentHiddenPropertyName === null ) {
		if ( doc.hidden !== undefined ) {
			property = 'hidden';
		} else if ( doc.mozHidden !== undefined ) {
			property = 'mozHidden';
		} else if ( doc.msHidden !== undefined ) {
			property = 'msHidden';
		} else if ( doc.webkitHidden !== undefined ) {
			property = 'webkitHidden';
		} else {
			// let's be explicit about returning `undefined`
			property = undefined;
		}
		// cache
		pageVisibility.documentHiddenPropertyName = property;
	}

	return pageVisibility.documentHiddenPropertyName;
};

/**
 * Return the browser specific name of the `document.visibilitychange` event
 *
 * Exposed for testing only.
 *
 * @see https://www.w3.org/TR/page-visibility/#sec-visibilitychange-event
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * @private
 * @param {Object} doc window.document object
 * @return {string|undefined}
 */
pageVisibility.getDocumentVisibilitychangeEventName = function ( doc ) {
	var eventName;

	if ( pageVisibility.documentVisibilityChangeEventName === null ) {
		if ( doc.hidden !== undefined ) {
			eventName = 'visibilitychange';
		} else if ( doc.mozHidden !== undefined ) {
			eventName = 'mozvisibilitychange';
		} else if ( doc.msHidden !== undefined ) {
			eventName = 'msvisibilitychange';
		} else if ( doc.webkitHidden !== undefined ) {
			eventName = 'webkitvisibilitychange';
		} else {
			// let's be explicit about returning `undefined`
			eventName = undefined;
		}
		// cache
		pageVisibility.documentVisibilityChangeEventName = eventName;
	}

	return pageVisibility.documentVisibilityChangeEventName;
};

/**
 * Whether `window.document` is visible
 *
 * `undefined` is returned if the browser does not support the Visibility API.
 *
 * Exposed for testing only.
 *
 * @see https://www.w3.org/TR/page-visibility/#dom-document-hidden
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * @private
 * @param {Object} doc window.document object
 * @returns {boolean|undefined}
 */
pageVisibility.isDocumentHidden = function ( doc ) {
	var property = pageVisibility.getDocumentHiddenPropertyName( doc );

	return property !== undefined ? doc[ property ] : undefined;
};

module.exports = pageVisibility;
