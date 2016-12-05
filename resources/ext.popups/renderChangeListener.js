( function ( mw ) {

	/**
	 * Creates an instance of the render change listener.
	 *
	 * @param {Object} boundActions
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.render = function ( boundActions ) {
		var preview;

		return function ( prevState, state ) {
			if ( state.preview.shouldShow && !preview ) {
				preview = mw.popups.renderer.render( state.preview.fetchResponse );
				preview.show( state.preview.activeEvent, boundActions )
					.done( boundActions.previewShow );
			} else if ( !state.preview.shouldShow && preview ) {
				preview.hide()
					.done( function () {
						preview = undefined;
					} );
			}
		};
	};

}( mediaWiki ) );
