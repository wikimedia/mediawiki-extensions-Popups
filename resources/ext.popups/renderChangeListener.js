( function ( mw ) {

	/**
	 * Creates an instance of the render change listener.
	 *
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.render = function () {
		var preview;

		return function ( prevState, state ) {
			if ( state.preview.shouldShow && !preview ) {
				preview = mw.popups.renderer.render( state.preview.fetchResponse );
				preview.show( state.preview.activeEvent );
			} else if ( !state.preview.shouldShow && preview ) {
				preview.hide()
					.done( function () {
						preview = undefined;
					} );
			}
		};
	};

}( mediaWiki ) );
