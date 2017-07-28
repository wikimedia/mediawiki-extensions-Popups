import statsv from '../../../src/reducers/statsv';

QUnit.module( 'ext.popups/reducers#eventLogging', {
	beforeEach: function () {
		this.initialState = statsv( undefined, {
			type: '@@INIT'
		} );
	}
} );

QUnit.test( '@@INIT', function ( assert ) {
	assert.expect( 1 );

	assert.deepEqual( this.initialState, {} );
} );

QUnit.test( 'FETCH_START', function ( assert ) {
	var action, state;

	assert.expect( 1 );

	action = {
		type: 'FETCH_START',
		timestamp: 123
	};
	state = statsv( this.initialState, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: 123
		}
	);
} );

QUnit.test( 'FETCH_END', function ( assert ) {
	var startedAt, endedAt, action, state;

	assert.expect( 1 );

	startedAt = 200;
	endedAt = 500;
	action = {
		type: 'FETCH_END',
		timestamp: endedAt
	};
	state = statsv( { fetchStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: startedAt,
			action: 'timing.PagePreviewsApiResponse',
			data: endedAt - startedAt
		}
	);
} );

QUnit.test( 'FETCH_FAILED', function ( assert ) {
	var action, state;

	assert.expect( 1 );

	action = {
		type: 'FETCH_FAILED'
	};
	state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			action: 'counter.PagePreviewsApiFailure',
			data: 1
		}
	);
} );

QUnit.test( 'LINK_DWELL', function ( assert ) {
	var timestamp, action, state;

	assert.expect( 1 );

	timestamp = 100;
	action = {
		type: 'LINK_DWELL',
		timestamp: timestamp
	};
	state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: timestamp
		}
	);
} );

QUnit.test( 'PREVIEW_SHOW', function ( assert ) {
	var startedAt, endedAt, action, state;

	assert.expect( 1 );

	startedAt = 100;
	endedAt = 300;
	action = {
		type: 'PREVIEW_SHOW',
		timestamp: endedAt
	};
	state = statsv( { linkDwellStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: startedAt,
			action: 'timing.PagePreviewsPreviewShow',
			data: endedAt - startedAt
		}
	);
} );

QUnit.test( 'STATSV_LOGGED', function ( assert ) {
	var action, state;

	assert.expect( 1 );

	action = {
		type: 'STATSV_LOGGED'
	};
	state = statsv( { data: 123 }, action );

	assert.deepEqual(
		state,
		{
			action: null,
			data: null
		}
	);
} );
