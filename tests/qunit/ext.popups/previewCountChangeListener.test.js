( function ( mw, $ ) {

	QUnit.module( 'ext.popups/previewCountChangeListener', {
		setup: function () {
			this.userSettings = {
				setPreviewCount: this.sandbox.spy()
			};

			this.changeListener = mw.popups.changeListeners.previewCount( this.userSettings );
		}
	} );

	QUnit.test(
		'it shouldn\'t update the storage if the preview count hasn\'t changed',
		function ( assert ) {
			var state,
				prevState;

			assert.expect( 1 );

			state = {
				eventLogging: {
					previewCount: 222
				}
			};

			this.changeListener( undefined, state );

			// ---

			prevState = $.extend( true, {}, state );

			this.changeListener( prevState, state );

			assert.notOk( this.userSettings.setPreviewCount.called );
		}
	);

	QUnit.test( 'it should update the storage', function ( assert ) {
		var prevState,
			state;

		assert.expect( 1 );

		prevState = {
			eventLogging: {
				previewCount: 222
			}
		};

		state = $.extend( true, {}, prevState );
		++state.eventLogging.previewCount;

		this.changeListener( prevState, state );

		assert.ok( this.userSettings.setPreviewCount.calledWith( 223 ) );
	} );

}( mediaWiki, jQuery ) );
