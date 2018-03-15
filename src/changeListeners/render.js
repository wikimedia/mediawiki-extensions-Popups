import * as renderer from '../ui/renderer';

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
export default function render( previewBehavior ) {
	let preview;

	return ( prevState, state ) => {
		if ( state.preview.shouldShow && !preview ) {
			preview = renderer.render( state.preview.fetchResponse );
			preview.show(
				state.preview.activeEvent,
				previewBehavior,
				state.preview.activeToken
			);
		} else if ( !state.preview.shouldShow && preview ) {
			preview.hide();
			preview = undefined;
		}
	};
}
