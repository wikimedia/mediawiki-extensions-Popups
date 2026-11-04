/**
 * @module changeListeners/render
 * @private
 */

const renderer = require( '../ui/renderer.js' );

/**
 * Creates an instance of the render change listener.
 *
 * FIXME: Remove hard coupling with renderer, inject it as a parameter
 * * Wire it up in index.js
 * * Fix tests to remove require mocking
 *
 * @param {ext.popups.PreviewBehavior} previewBehavior
 * @return {ext.popups.ChangeListener}
 */
function render( previewBehavior ) {
	let preview;

	return ( oldState, newState ) => {
		if ( newState.preview.shouldShow && !preview ) {
			preview = renderer.render( newState.preview.fetchResponse );
			preview.show(
				newState.preview.measures,
				previewBehavior,
				newState.preview.activeToken
			);
		} else if ( !newState.preview.shouldShow && preview ) {
			preview.hide();
			preview = undefined;
		}
	};
}

module.exports = render;
