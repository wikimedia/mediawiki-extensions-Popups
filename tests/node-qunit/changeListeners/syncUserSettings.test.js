import syncUserSettings from '../../../src/changeListeners/syncUserSettings';

QUnit.module( 'ext.popups/changeListeners/syncUserSettings', {
	beforeEach() {
		this.userSettings = {
			storePreviewCount: this.sandbox.spy(),
			storePagePreviewsEnabled: this.sandbox.spy()
		};

		this.changeListener = syncUserSettings( this.userSettings );
	}
} );

QUnit.test(
	'it shouldn\'t update the storage if the preview count hasn\'t changed',
	function ( assert ) {
		const state = {
			eventLogging: {
				previewCount: 222
			}
		};

		this.changeListener( undefined, state );

		// ---

		const prevState = $.extend( true, {}, state );

		this.changeListener( prevState, state );

		assert.notOk(
			this.userSettings.storePreviewCount.called,
			'The preview count is unchanged.'
		);
	}
);

QUnit.test( 'it should update the storage if the previewCount has changed', function ( assert ) {
	const prevState = {
		eventLogging: {
			previewCount: 222
		}
	};

	const state = $.extend( true, {}, prevState );
	++state.eventLogging.previewCount;

	this.changeListener( prevState, state );

	assert.ok(
		this.userSettings.storePreviewCount.calledWith( 223 ),
		'The preview count is updated.'
	);
} );

QUnit.test(
	'it shouldn\'t update the storage if the enabled state hasn\'t changed',
	function ( assert ) {
		const state = {
			preview: {
				enabled: true
			}
		};

		this.changeListener( undefined, state );

		// ---

		const prevState = $.extend( true, {}, state );

		this.changeListener( prevState, state );

		assert.notOk(
			this.userSettings.storePagePreviewsEnabled.called,
			'The user setting is unchanged.'
		);
	}
);

QUnit.test( 'it should update the storage if the enabled flag has changed', function ( assert ) {
	const prevState = {
		preview: {
			enabled: true
		}
	};

	const state = $.extend( true, {}, prevState );
	state.preview.enabled = false;

	this.changeListener( prevState, state );

	assert.ok(
		this.userSettings.storePagePreviewsEnabled.calledWith( false ),
		'The user setting is disabled.'
	);
} );
