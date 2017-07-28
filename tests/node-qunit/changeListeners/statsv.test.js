import statsv from '../../../src/changeListeners/statsv';

QUnit.module( 'ext.popups/changeListeners/statsv', {
	beforeEach: function () {
		this.boundActions = {
			statsvLogged: this.sandbox.spy()
		};

		this.track = this.sandbox.spy();
	}
} );

QUnit.test( 'it should log the queued event', function ( assert ) {
	var state, changeListener;

	assert.expect( 2 );

	state = {
		statsv: {
			action: 'myAction',
			data: 123
		}
	};
	changeListener = statsv( this.boundActions, this.track );
	changeListener( undefined, state );

	assert.ok(
		this.track.calledWith( 'myAction', 123 ),
		'It should track an action with data when logging is enabled.'
	);

	assert.ok(
		this.boundActions.statsvLogged.called,
		'The statsvLoggged bound action is called once the event has been logged.'
	);
} );

QUnit.test( 'it should not log when no action is given', function ( assert ) {
	var state, changeListener;

	assert.expect( 2 );

	state = {
		statsv: {
			data: 123
		}
	};
	changeListener = statsv( this.boundActions, this.track );
	changeListener( undefined, state );

	assert.ok(
		this.track.notCalled,
		'No logging occurs when no action is given.'
	);

	assert.ok(
		this.boundActions.statsvLogged.notCalled,
		'The statsvLoggged bound action is not called when no action is given.'
	);
} );
