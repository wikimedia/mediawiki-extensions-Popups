import syncUserSettings from '../../../src/changeListeners/syncUserSettings';

QUnit.module( 'ext.popups/changeListeners/syncUserSettings', {
	beforeEach() {
		this.userSettings = {
			setPreviewCount: this.sandbox.spy(),
			setIsEnabled: this.sandbox.spy()
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
			this.userSettings.setPreviewCount.called,
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
		this.userSettings.setPreviewCount.calledWith( 223 ),
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
			this.userSettings.setIsEnabled.called,
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
		this.userSettings.setIsEnabled.calledWith( false ),
		'The user setting is disabled.'
	);
} );
