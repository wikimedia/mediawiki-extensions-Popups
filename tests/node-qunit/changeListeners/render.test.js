import render from '../../../src/changeListeners/render';
import * as RendererModule from '../../../src/ui/renderer';

QUnit.module( 'ext.popups/changeListeners/render', {
	beforeEach() {
		this.preview = {
			show: this.sandbox.stub().returns( $.Deferred().resolve() )
		};

		this.sandbox.stub( RendererModule, 'render' ).callsFake(
			this.sandbox.stub().returns( this.preview )
		);
	}
} );

QUnit.test(
	'it should show the preview with the behavior',
	function ( assert ) {
		const previewBehavior = {};

		const newState = {
			preview: {
				shouldShow: true,
				measures: {},
				activeToken: '1234567890'
			}
		};

		const changeListener = render( previewBehavior );
		changeListener( undefined, newState );

		assert.true(
			this.preview.show.calledWith(
				newState.preview.measures,
				previewBehavior,
				newState.preview.activeToken
			),
			'The preview is shown with correct arguments.'
		);
	}
);

QUnit.test( 'it should render the preview', ( assert ) => {
	const newState = {
		preview: {
			shouldShow: true,
			fetchResponse: {}
		}
	};

	const changeListener = render( /* previewBehavior = undefined */ );
	changeListener( undefined, newState );

	assert.true(
		RendererModule.render.calledWith( newState.preview.fetchResponse ),
		'It should use the data from the gateway.'
	);
} );
