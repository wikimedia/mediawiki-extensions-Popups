var eventLogging = require( '../../../src/changeListeners/eventLogging' );

QUnit.module( 'ext.popups/eventLogging', {
	beforeEach: function () {
		this.boundActions = {
			eventLogged: this.sandbox.spy()
		};

		this.schema = {
			log: this.sandbox.spy()
		};

		this.changeListener = eventLogging(
			this.boundActions,
			this.schema
		);
	}
} );

QUnit.test( 'it should log the queued event', function ( assert ) {
	var baseData,
		state;

	assert.expect( 1 );

	baseData = {
		foo: 'bar',
		baz: 'qux'
	};

	state = {
		eventLogging: {
			baseData: baseData,
			event: {
				action: 'pageLoaded'
			}
		}
	};

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

QUnit.test(
	'it should call the eventLogged bound action creator',
	function ( assert ) {
		var state = {
			eventLogging: {
				baseData: {},
				event: undefined
			}
		};

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
	}
);
