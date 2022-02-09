import statsv from '../../../src/changeListeners/statsv';

QUnit.module( 'ext.popups/changeListeners/statsv', {
	beforeEach() {
		this.boundActions = {
			statsvLogged: this.sandbox.spy()
		};

		this.track = this.sandbox.spy();
	}
} );

QUnit.test( 'it should log the queued event', function ( assert ) {
	const newState = {
		statsv: {
			action: 'myAction',
			data: 123
		}
	};
	const changeListener = statsv( this.boundActions, this.track );
	changeListener( undefined, newState );

	assert.true(
		this.track.calledWith( 'myAction', 123 ),
		'It should track an action with data when logging is enabled.'
	);

	assert.true(
		this.boundActions.statsvLogged.called,
		'The statsvLoggged bound action is called once the event has been logged.'
	);
} );

QUnit.test( 'it should not log when no action is given', function ( assert ) {
	const newState = {
		statsv: {
			data: 123
		}
	};
	const changeListener = statsv( this.boundActions, this.track );
	changeListener( undefined, newState );

	assert.true(
		this.track.notCalled,
		'No logging occurs when no action is given.'
	);

	assert.true(
		this.boundActions.statsvLogged.notCalled,
		'The statsvLoggged bound action is not called when no action is given.'
	);
} );
