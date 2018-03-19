import eventLogging from '../../../src/changeListeners/eventLogging';

function getCurrentTimestamp() {
	return 123;
}

QUnit.module( 'ext.popups/eventLogging', {
	beforeEach() {
		this.boundActions = {
			eventLogged: this.sandbox.spy()
		};

		this.eventLoggingTracker = this.sandbox.spy();
		this.changeListener = eventLogging(
			this.boundActions,
			this.eventLoggingTracker,
			getCurrentTimestamp
		);
	}
} );

function createState( baseData, event ) {
	return {
		eventLogging: {
			baseData,
			event
		}
	};
}

QUnit.test( 'it should log the queued event', function ( assert ) {
	const baseData = {
		foo: 'bar',
		baz: 'qux'
	};

	const state = createState( baseData, {
		action: 'pageLoaded'
	} );

	this.changeListener( undefined, state );

	assert.ok(
		this.eventLoggingTracker.calledWith(
			'event.Popups',
			{
				foo: 'bar',
				baz: 'qux',
				action: 'pageLoaded',
				timestamp: 123
			}
		),
		'It should merge the event data and the accumulated base data.'
	);
} );

QUnit.test( 'it should call the eventLogged bound action creator', function ( assert ) {
	const state = createState( {}, undefined );

	this.changeListener( undefined, state );

	assert.notOk(
		this.boundActions.eventLogged.called,
		'It shouldn\'t call the eventLogged bound action creator if there\'s no queued event.'
	);

	state.eventLogging.event = {
		action: 'pageLoaded'
	};

	this.changeListener( undefined, state );

	assert.ok( this.boundActions.eventLogged.called );
	assert.deepEqual( this.boundActions.eventLogged.getCall( 0 ).args[ 0 ], {
		action: 'pageLoaded',
		timestamp: 123
	} );
} );
