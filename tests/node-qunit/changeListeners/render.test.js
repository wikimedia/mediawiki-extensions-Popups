var mock = require( 'mock-require' ),
	render;

QUnit.module( 'ext.popups/changeListeners/render', {
	beforeEach: function () {
		this.preview = {
			show: this.sandbox.stub().returns( $.Deferred().resolve() )
		};

		this.renderer = {
			render: this.sandbox.stub().returns( this.preview )
		};

		mock( '../../../src/renderer', this.renderer );
		render = this.sandbox.spy(
			mock.reRequire( '../../../src/changeListeners/render' )
		);
	},
	afterEach: function () {
		mock.stop( '../../../src/renderer' );
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
		this.renderer.render.calledWith( state.preview.fetchResponse ),
		'It should use the data from the gateway.'
	);
} );
