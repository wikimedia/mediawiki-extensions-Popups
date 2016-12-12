( function ( mw ) {

	/**
	 * Creates an instance of the settings change listener.
	 *
	 * @param {Object} boundActions
	 * @param {Object} render function that renders a jQuery el with the settings
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.settings = function ( boundActions, render ) {
		var settings,
			shown = false;

		return function ( prevState, state ) {
			if ( state.settings.shouldShow && !shown ) {
				// Lazily instantiate the settings UI
				if ( !settings ) {
					settings = render( boundActions );
					settings.appendTo( document.body );
				}

				settings.show();
				shown = true;
			} else if ( !state.settings.shouldShow && settings ) {
				settings.hide();
				shown = false;
			}
		};
	};

}( mediaWiki ) );
