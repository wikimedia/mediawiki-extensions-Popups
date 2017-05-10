var eventLogging = require( '../../../src/changeListeners/eventLogging' );

QUnit.module( 'ext.popups/eventLogging', {
	beforeEach: function () {
		this.boundActions = {
			eventLogged: this.sandbox.spy()
		};

		this.schema = {
			log: this.sandbox.spy()
		};

		this.track = this.sandbox.spy();

		this.changeListener = eventLogging(
			this.boundActions,
			this.schema,
			this.track
		);
	}
} );

function createState( baseData, event ) {
	return {
		eventLogging: {
			baseData: baseData,
			event: event
		}
	};
}

QUnit.test( 'it should log the queued event', function ( assert ) {
	var baseData,
		state;

	assert.expect( 1 );

	baseData = {
		foo: 'bar',
		baz: 'qux'
	};

	state = createState( baseData, {
		action: 'pageLoaded'
	} );

	this.changeListener( undefined, state );

	assert.ok(
		this.schema.log.calledWith( {
			foo: 'bar',
			baz: 'qux',
			action: 'pageLoaded'
		} ),
		'It should merge the event data and the accumulated base data.'
	);
} );

QUnit.test( 'it should call the eventLogged bound action creator', function ( assert ) {
	var state = createState( {}, undefined );

	this.changeListener( undefined, state );

	assert.notOk(
		this.boundActions.eventLogged.called,
		'It shouldn\'t call the eventLogged bound action creator if there\'s no queued event.'
	);

	// ---

	state.eventLogging.event = {
		action: 'pageLoaded'
	};

	this.changeListener( undefined, state );

	assert.ok( this.boundActions.eventLogged.called );
	assert.deepEqual( this.boundActions.eventLogged.getCall( 0 ).args[ 0 ], {
		action: 'pageLoaded'
	} );
} );

QUnit.test( 'it should handle duplicate events', function ( assert ) {
	var state,
		nextState;

	state = nextState = createState( undefined, {
		action: 'dwelledButAbandoned',
		linkInteractionToken: '1234567890',
		totalInteractionTime: 48
	} );

	this.changeListener( undefined, state );
	this.changeListener( state, nextState );

	assert.ok( this.track.calledTwice );
	assert.deepEqual(
		this.track.getCall( 0 ).args,
		[
			'counter.PagePreviews.EventLogging.DuplicateToken',
			1
		]
	);
	assert.deepEqual(
		this.track.getCall( 1 ).args,
		[
			'counter.PagePreviews.EventLogging.DuplicateEvent',
			1
		],
		'It should increment the duplicate token and event counters.'
	);

	assert.notOk(
		this.schema.log.calledTwice,
		'It shouldn\'t log the event.'
	);

	// ---

	nextState = createState( {
		action: 'dwelledButAbandoned',
		linkInteractionToken: '0987654321',
		totalInteractionTime: 16
	} );

	this.changeListener( state, nextState );

	assert.notOk(
		this.track.calledThrice,
		'The counter isn\'t incremented if the event isn\'t a duplicate'
	);
} );

QUnit.test( 'it should handle no event being logged', function ( assert ) {
	var state;

	state = createState( undefined );

	this.changeListener( undefined, state );
	this.changeListener( state, state );

	assert.ok( this.track.notCalled );
} );

QUnit.test( 'it should handle duplicate tokens', function ( assert ) {
	var state,
		nextState;

	state = createState( undefined, {
		action: 'opened',
		linkInteractionToken: '1234567890',
		totalInteractionTime: 48
	} );

	nextState = createState( undefined, {
		action: 'dwelledButAbandoned',
		linkInteractionToken: '1234567890',
		totalInteractionTime: 96
	} );

	this.changeListener( undefined, state );
	this.changeListener( state, nextState );

	assert.ok( this.track.calledOnce );
	assert.deepEqual(
		this.track.getCall( 0 ).args,
		[
			'counter.PagePreviews.EventLogging.DuplicateToken',
			1
		],
		'It should increment the duplicate token counter.'
	);

	assert.ok(
		this.schema.log.calledOnce,
		'It shouldn\'t log the event with the duplicate token.'
	);
} );
