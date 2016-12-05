( function ( mw ) {

	/**
	 * Creates an instance of the preview count change listener.
	 *
	 * When the user dwells on a link for long enough that a preview is shown,
	 * then their preview count will be incremented (see
	 * `mw.popups.reducers.eventLogging`, and is persisted to local storage.
	 *
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.previewCount = function ( userSettings ) {

		/**
		 * FIXME: This kind of function, one that selects the specific part(s) of
		 * the state tree that a change listener will use, is a common pattern and
		 * should be extracted.
		 *
		 * @param {Object} state
		 * @return {Number}
		 */
		function getPreviewCount( state ) {
			return state.eventLogging.previewCount;
		}

		return function ( prevState, state ) {
			var previewCount = getPreviewCount( state );

			if (
				prevState &&
				previewCount > getPreviewCount( prevState )
			) {
				userSettings.setPreviewCount( previewCount );
			}
		};
	};

}( mediaWiki ) );
