import statsv from '../../../src/reducers/statsv';

QUnit.module( 'ext.popups/reducers#eventLogging', {
	beforeEach() {
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
	assert.expect( 1 );

	const action = {
		type: 'FETCH_START',
		timestamp: 123
	};
	const state = statsv( this.initialState, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: 123
		}
	);
} );

QUnit.test( 'FETCH_END', ( assert ) => {
	assert.expect( 1 );

	const startedAt = 200;
	const endedAt = 500;
	const action = {
		type: 'FETCH_END',
		timestamp: endedAt
	};
	const state = statsv( { fetchStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: startedAt,
			action: 'timing.PagePreviewsApiResponse',
			data: endedAt - startedAt
		}
	);
} );

QUnit.test( 'FETCH_FAILED', ( assert ) => {
	assert.expect( 1 );

	const action = {
		type: 'FETCH_FAILED'
	};
	const state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			action: 'counter.PagePreviewsApiFailure',
			data: 1
		}
	);
} );

QUnit.test( 'LINK_DWELL', ( assert ) => {
	assert.expect( 1 );

	const timestamp = 100;
	const action = {
		type: 'LINK_DWELL',
		timestamp
	};
	const state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: timestamp
		}
	);
} );

QUnit.test( 'PREVIEW_SHOW', ( assert ) => {
	assert.expect( 1 );

	const startedAt = 100;
	const endedAt = 300;
	const action = {
		type: 'PREVIEW_SHOW',
		timestamp: endedAt
	};
	const state = statsv( { linkDwellStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: startedAt,
			action: 'timing.PagePreviewsPreviewShow',
			data: endedAt - startedAt
		}
	);
} );

QUnit.test( 'STATSV_LOGGED', ( assert ) => {
	assert.expect( 1 );

	const action = {
		type: 'STATSV_LOGGED'
	};
	const state = statsv( { data: 123 }, action );

	assert.deepEqual(
		state,
		{
			action: null,
			data: null
		}
	);
} );
