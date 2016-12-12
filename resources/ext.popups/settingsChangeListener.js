( function ( mw ) {

	/**
	 * Creates an instance of the settings change listener.
	 *
	 * @param {Object} boundActions
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.settings = function ( boundActions ) {
		var settings;

		return function ( prevState, state ) {
			if ( state.settings.shouldShow && !settings ) {
				settings = mw.popups.settings.render( boundActions );
				settings.show();
			} else if ( !state.settings.shouldShow && settings ) {
				settings.hide();
				settings = undefined;
			}
		};
	};

}( mediaWiki ) );
