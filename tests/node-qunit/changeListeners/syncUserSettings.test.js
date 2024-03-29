import syncUserSettings from '../../../src/changeListeners/syncUserSettings';

QUnit.module( 'ext.popups/changeListeners/syncUserSettings', {
	beforeEach() {
		this.userSettings = {
			storePreviewTypeEnabled: this.sandbox.spy()
		};

		this.changeListener = syncUserSettings( this.userSettings );
	}
} );

QUnit.test(
	'it shouldn\'t update the storage if the enabled state hasn\'t changed',
	function ( assert ) {
		const oldState = { preview: { enabled: { page: true } } },
			newState = { preview: { enabled: { page: true } } };

		this.changeListener( undefined, newState );
		this.changeListener( oldState, newState );

		assert.false(
			this.userSettings.storePreviewTypeEnabled.called,
			'The user setting is unchanged.'
		);
	}
);

QUnit.test( 'it should update the storage if the enabled flag has changed', function ( assert ) {
	const oldState = { preview: { enabled: { page: true } } },
		newState = { preview: { enabled: { page: false } } };

	this.changeListener( oldState, newState );

	assert.true(
		this.userSettings.storePreviewTypeEnabled.calledWith( 'page', false ),
		'The user setting is disabled.'
	);
} );

QUnit.test(
	'it shouldn\'t update the storage if the reference preview state hasn\'t changed',
	function ( assert ) {
		const oldState = { preview: { enabled: { reference: true } } },
			newState = { preview: { enabled: { reference: true } } };

		this.changeListener( undefined, newState );
		this.changeListener( oldState, newState );

		assert.false(
			this.userSettings.storePreviewTypeEnabled.called,
			'Reference previews are unchanged.'
		);
	}
);

QUnit.test( 'it should update the storage if the reference preview state has changed', function ( assert ) {
	const oldState = { preview: { enabled: { reference: true } } },
		newState = { preview: { enabled: { reference: false } } };

	this.changeListener( oldState, newState );

	assert.true(
		this.userSettings.storePreviewTypeEnabled.calledWith( 'reference', false ),
		'Reference previews opt-out is stored.'
	);
} );
