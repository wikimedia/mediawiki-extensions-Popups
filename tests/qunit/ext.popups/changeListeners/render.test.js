( function ( mw, $ ) {

	// Since mw.popups.changeListeners.render manipulates the DOM, this test is,
	// by necessity, an integration test.
	QUnit.module( 'ext.popups/changeListeners/render @integration' );

	QUnit.test(
		'it should call the showPreview action creator when the preview is shown',
		function ( assert ) {
			var boundActions,
				changeListener,
				state;

			boundActions = {
				previewShow: this.sandbox.spy()
			};

			this.sandbox.stub( mw.popups.renderer, 'render', function () {
				return {
					show: function () {
						return $.Deferred().resolve();
					}
				};
			} );

			state = {
				preview: {
					shouldShow: true
				}
			};

			changeListener = mw.popups.changeListeners.render( boundActions );
			changeListener( undefined, state );

			assert.ok( boundActions.previewShow.called );
		}
	);

}( mediaWiki, jQuery ) );
