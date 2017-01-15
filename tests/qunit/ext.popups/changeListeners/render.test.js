( function ( mw, $ ) {

	QUnit.module( 'ext.popups/changeListeners/render', {
		setup: function () {
			var showStub = this.sandbox.stub();

			showStub.returns( $.Deferred().resolve() );

			this.preview = {
				show: showStub
			};

			this.sandbox.stub( mw.popups.renderer, 'render' )
				.returns( this.preview );
		}
	} );

	QUnit.test(
		'it should show the preview with the behavior',
		function ( assert ) {
			var previewBehavior = {},
				changeListener,
				state;

			state = {
				preview: {
					shouldShow: true,
					activeEvent: {}
				}
			};

			changeListener = mw.popups.changeListeners.render( previewBehavior );
			changeListener( undefined, state );

			assert.ok( this.preview.show.calledWith(
				state.preview.activeEvent,
				previewBehavior
			) );
		}
	);

	QUnit.test( 'it should render the preview', function ( assert ) {
		var state,
			changeListener;

		state = {
			preview: {
				shouldShow: true,
				fetchResponse: {}
			}
		};

		changeListener = mw.popups.changeListeners.render( /* previewBehavior = undefined */ );
		changeListener( undefined, state );

		assert.ok(
			mw.popups.renderer.render.calledWith( state.preview.fetchResponse ),
			'It should use the data from the gateway.'
		);
	} );

}( mediaWiki, jQuery ) );
