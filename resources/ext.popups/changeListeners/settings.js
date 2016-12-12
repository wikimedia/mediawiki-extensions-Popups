( function ( mw ) {

	/**
	 * Creates an instance of the settings change listener.
	 *
	 * @param {Object} boundActions
	 * @param {Object} render function that renders a jQuery el with the settings
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.settings = function ( boundActions, render ) {
		var settings;

		return function ( prevState, state ) {
			if ( state.settings.shouldShow && !settings ) {
				settings = render( boundActions );
				settings.show();
			} else if ( !state.settings.shouldShow && settings ) {
				settings.hide();
				settings = undefined;
			}
		};
	};

}( mediaWiki ) );
