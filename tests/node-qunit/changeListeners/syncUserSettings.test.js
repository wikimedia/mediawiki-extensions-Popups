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
		assert.expect( 1 );

		const state = {
			eventLogging: {
				previewCount: 222
			}
		};

		this.changeListener( undefined, state );

		// ---

		const prevState = $.extend( true, {}, state );

		this.changeListener( prevState, state );

		assert.notOk( this.userSettings.setPreviewCount.called );
	}
);

QUnit.test( 'it should update the storage if the previewCount has changed', function ( assert ) {
	assert.expect( 1 );

	const prevState = {
		eventLogging: {
			previewCount: 222
		}
	};

	const state = $.extend( true, {}, prevState );
	++state.eventLogging.previewCount;

	this.changeListener( prevState, state );

	assert.ok( this.userSettings.setPreviewCount.calledWith( 223 ) );
} );

QUnit.test(
	'it shouldn\'t update the storage if the enabled state hasn\'t changed',
	function ( assert ) {
		assert.expect( 1 );

		const state = {
			preview: {
				enabled: true
			}
		};

		this.changeListener( undefined, state );

		// ---

		const prevState = $.extend( true, {}, state );

		this.changeListener( prevState, state );

		assert.notOk( this.userSettings.setIsEnabled.called );
	}
);

QUnit.test( 'it should update the storage if the enabled flag has changed', function ( assert ) {
	assert.expect( 1 );

	const prevState = {
		preview: {
			enabled: true
		}
	};

	const state = $.extend( true, {}, prevState );
	state.preview.enabled = false;

	this.changeListener( prevState, state );

	assert.ok( this.userSettings.setIsEnabled.calledWith( false ) );
} );
