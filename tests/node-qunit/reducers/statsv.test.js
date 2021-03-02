import statsv from '../../../src/reducers/statsv';
import actionTypes from '../../../src/actionTypes';

QUnit.module( 'ext.popups/reducers#statsv', {
	beforeEach() {
		this.initialState = statsv( undefined, {
			type: '@@INIT'
		} );
	}
} );

QUnit.test( '@@INIT', function ( assert ) {
	assert.deepEqual( this.initialState, {}, 'The initial state is empty.' );
} );

QUnit.test( 'FETCH_START', function ( assert ) {
	const action = {
		type: actionTypes.FETCH_START,
		timestamp: 123
	};
	const state = statsv( this.initialState, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: 123
		},
		'The fetch start time is preserved.'
	);
} );

QUnit.test( 'FETCH_END', ( assert ) => {
	const startedAt = 200;
	const endedAt = 500;
	const action = {
		type: actionTypes.FETCH_END,
		timestamp: endedAt
	};
	const state = statsv( { fetchStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			fetchStartedAt: startedAt,
			action: 'timing.PagePreviewsApiResponse',
			data: endedAt - startedAt
		},
		'The start, action, and data are preserved.'
	);
} );

QUnit.test( 'FETCH_FAILED', ( assert ) => {
	const action = {
		type: actionTypes.FETCH_FAILED
	};
	const state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			action: 'counter.PagePreviewsApiFailure',
			data: 1
		},
		'The action and data are preserved.'
	);
} );

QUnit.test( 'LINK_DWELL', ( assert ) => {
	const timestamp = 100;
	const action = {
		type: actionTypes.LINK_DWELL,
		timestamp
	};
	const state = statsv( {}, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: timestamp
		},
		'The link dwell start time is preserved.'
	);
} );

QUnit.test( 'PREVIEW_SHOW', ( assert ) => {
	const startedAt = 100;
	const endedAt = 300;
	const action = {
		type: actionTypes.PREVIEW_SHOW,
		timestamp: endedAt
	};
	const state = statsv( { linkDwellStartedAt: startedAt }, action );

	assert.deepEqual(
		state,
		{
			linkDwellStartedAt: startedAt,
			action: 'timing.PagePreviewsPreviewShow',
			data: endedAt - startedAt
		},
		'The link dwell start time, action, and data are preserved.'
	);
} );

QUnit.test( 'STATSV_LOGGED', ( assert ) => {
	const action = {
		type: actionTypes.STATSV_LOGGED
	};
	const state = statsv( { data: 123 }, action );

	assert.deepEqual(
		state,
		{
			action: null,
			data: null
		},
		'The action and data empty.'
	);
} );
