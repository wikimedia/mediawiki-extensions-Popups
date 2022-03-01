import preview from '../../../src/reducers/preview';
import actionTypes from '../../../src/actionTypes';
import { createNullModel } from '../../../src/preview/model';

QUnit.module( 'ext.popups/reducers#preview', {
	beforeEach() {
		this.el = 'active link';
	}
} );

QUnit.test( '@@INIT', ( assert ) => {
	const state = preview( undefined, { type: '@@INIT' } );

	assert.deepEqual(
		state,
		{
			enabled: {},
			activeLink: undefined,
			previewType: undefined,
			measures: undefined,
			activeToken: '',
			shouldShow: false,
			isUserDwelling: false,
			wasClicked: false
		},
		'The initial state is correct.'
	);
} );

QUnit.test( 'BOOT', ( assert ) => {
	const action = {
		type: actionTypes.BOOT,
		initiallyEnabled: { page: true }
	};

	assert.deepEqual(
		preview( {}, action ),
		{
			enabled: { page: true }
		},
		'It should set whether or not previews are enabled.'
	);
} );

QUnit.test( 'SETTINGS_CHANGE', ( assert ) => {
	const action = {
		type: actionTypes.SETTINGS_CHANGE,
		newValue: { page: true }
	};

	assert.deepEqual(
		preview( { enabled: {} }, action ),
		{
			enabled: { page: true }
		},
		'It should set whether or not previews are enabled when settings change.'
	);
} );

QUnit.test( 'LINK_DWELL initializes the state for a new link', function ( assert ) {
	const promise = $.Deferred().promise();
	const action = {
		type: actionTypes.LINK_DWELL,
		el: this.el,
		previewType: 'page',
		event: {},
		token: '1234567890',
		promise
	};

	assert.deepEqual(
		preview( {}, action ),
		{
			activeLink: action.el,
			previewType: 'page',
			measures: action.measures,
			activeToken: action.token,
			shouldShow: false,
			isUserDwelling: true,
			promise
		},
		'It should set active link and event as well as interaction info and hide the preview.'
	);
} );

QUnit.test( 'LINK_DWELL on an active link only updates dwell state', function ( assert ) {
	const action = {
			type: actionTypes.LINK_DWELL,
			el: this.el,
			event: {},
			token: '1234567890'
		},
		state = {
			activeLink: this.el,
			isUserDwelling: false
		};

	assert.deepEqual(
		preview( state, action ),
		{
			activeLink: this.el,
			isUserDwelling: true
		},
		'It should only set isUserDwelling to true'
	);
} );

QUnit.test( 'ABANDON_END', ( assert ) => {
	const action = {
		type: actionTypes.ABANDON_END,
		token: 'bananas'
	};
	let state = {
		activeToken: 'bananas',
		isUserDwelling: false
	};

	assert.deepEqual(
		preview( state, action ),
		{
			activeLink: undefined,
			previewType: undefined,
			activeToken: undefined,
			measures: undefined,
			fetchResponse: undefined,
			isUserDwelling: false,
			shouldShow: false
		},
		'ABANDON_END should hide the preview and reset the interaction info.'
	);

	// ---

	state = {
		activeToken: 'apples',
		isUserDwelling: true
	};

	assert.strictEqual(
		preview( state, action ),
		state,
		'ABANDON_END should NOOP if the current interaction has changed.'
	);

	// ---

	state = {
		activeToken: 'bananas',
		isUserDwelling: true
	};

	assert.strictEqual(
		preview( state, action ),
		state,
		'ABANDON_END should NOOP if the user is dwelling on the preview.'
	);
} );

QUnit.test( 'FETCH_COMPLETE', ( assert ) => {
	const token = '1234567890';
	let state = {
			activeToken: token,
			isUserDwelling: true
		},
		action = {
			type: actionTypes.FETCH_COMPLETE,
			token,
			result: {}
		};

	assert.deepEqual(
		preview( state, action ),
		{
			// Previous state.
			activeToken: state.activeToken,
			isUserDwelling: true,

			fetchResponse: action.result,
			shouldShow: true
		},
		'It should store the result and signal that a preview should be rendered.'
	);

	// ---

	state = preview( state, {
		type: actionTypes.ABANDON_START,
		token
	} );

	assert.deepEqual(
		preview( state, action ),
		{
			activeToken: token,
			isUserDwelling: false, // Set when ABANDON_START is reduced.
			wasClicked: false,

			fetchResponse: action.result,
			shouldShow: false
		},
		'It shouldn\'t signal that a preview should be rendered if the user has abandoned the link since the gateway request was made.'
	);

	// ---

	action = {
		type: actionTypes.FETCH_COMPLETE,
		token: 'banana',
		result: {}
	};

	assert.deepEqual(
		preview( state, action ),
		state,
		'It should NOOP if the user has interacted with another link since the gateway request was made.'
	);

} );

QUnit.test( actionTypes.FETCH_FAILED, ( assert ) => {
	const token = '1234567890',
		state = {
			activeToken: token,
			isUserDwelling: true
		};
	let action = {
		type: actionTypes.FETCH_FAILED,
		token
	};

	assert.deepEqual(
		preview( state, action ),
		{
			activeToken: state.activeToken,
			isUserDwelling: true
		},
		'It should not transition states.'
	);

	// ---

	action = {
		type: actionTypes.FETCH_COMPLETE,
		token,
		result: { title: createNullModel( 'Title', '/wiki/Title' ) }
	};

	assert.deepEqual(
		preview( state, action ),
		{
			activeToken: state.activeToken,
			isUserDwelling: true,

			fetchResponse: action.result,
			shouldShow: true
		},
		'It should store the result and signal that an error preview should be rendered.'
	);
} );

QUnit.test( 'PREVIEW_DWELL', ( assert ) => {
	const action = {
		type: actionTypes.PREVIEW_DWELL
	};

	assert.deepEqual(
		preview( {}, action ),
		{
			isUserDwelling: true
		},
		'It should mark the preview as being dwelled on.'
	);
} );

QUnit.test( 'ABANDON_START', ( assert ) => {
	const action = {
		type: actionTypes.ABANDON_START
	};

	assert.deepEqual(
		preview( {}, action ),
		{
			isUserDwelling: false,
			wasClicked: false
		},
		'ABANDON_START should mark the preview having been abandoned.'
	);
} );
