( function ( mw ) {

	/**
	 * Creates an instance of the render change listener.
	 *
	 * @param {ext.popups.PreviewBehavior} previewBehavior
	 * @return {ext.popups.ChangeListener}
	 */
	mw.popups.changeListeners.render = function ( previewBehavior ) {
		var preview;

		return function ( prevState, state ) {
			if ( state.preview.shouldShow && !preview ) {
				preview = mw.popups.renderer.render( state.preview.fetchResponse );
				preview.show( state.preview.activeEvent, previewBehavior );
			} else if ( !state.preview.shouldShow && preview ) {
				preview.hide();
				preview = undefined;
			}
		};
	};

}( mediaWiki ) );
