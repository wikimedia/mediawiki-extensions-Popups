import render from '../../../src/changeListeners/render';
import * as RendererModule from '../../../src/ui/renderer';

QUnit.module( 'ext.popups/changeListeners/render', {
	beforeEach: function () {
		this.preview = {
			show: this.sandbox.stub().returns( $.Deferred().resolve() )
		};

		this.sandbox.stub( RendererModule, 'render', this.sandbox.stub().returns( this.preview ) );
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
				activeEvent: {},
				activeToken: '1234567890'
			}
		};

		changeListener = render( previewBehavior );
		changeListener( undefined, state );

		assert.ok( this.preview.show.calledWith(
			state.preview.activeEvent,
			previewBehavior,
			state.preview.activeToken
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

	changeListener = render( /* previewBehavior = undefined */ );
	changeListener( undefined, state );

	assert.ok(
		RendererModule.render.calledWith( state.preview.fetchResponse ),
		'It should use the data from the gateway.'
	);
} );
