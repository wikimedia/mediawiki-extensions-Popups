( function ( mw ) {

	mw.popups = {};

	/**
	 * Unlike action creators and reducers, change listeners are more complex and
	 * won't be defined in just one file. Create the `mw.popups.changeListeners`
	 * namespace here to avoid repeating the following:
	 *
	 * ```js
	 * mw.popups.changeListeners = mw.popups.changeListeners || {};
	 * ```
	 */
	mw.popups.changeListeners = {};

}( mediaWiki ) );
