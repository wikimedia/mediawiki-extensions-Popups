import { createStubUser, createStubTitle } from './stubs';
import * as actions from '../../src/actions';
import * as WaitModule from '../../src/wait';
import actionTypes from '../../src/actionTypes';
import { setDwellTime, previewTypes } from '../../src/preview/model';

const REFERRER = 'https://en.wikipedia.org/wiki/Kitten',
	TEST_TITLE = createStubTitle( 0, 'Foo' );

function generateToken() {
	return 'ABC';
}

QUnit.module( 'ext.popups/actions' );

QUnit.test( '#boot', ( assert ) => {
	const config = new Map(),
		stubUser = createStubUser( /* isAnon = */ true );

	config.set( 'wgTitle', 'Foo' );
	config.set( 'wgNamespaceNumber', 0 );
	config.set( 'wgArticleId', 2 );
	config.set( 'wgUserEditCount', 3 );
	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	const stubUserSettings = {
		getPreviewCount() {
			return 22;
		}
	};

	const action = actions.boot(
		{ page: false },
		stubUser,
		stubUserSettings,
		config,
		REFERRER
	);

	assert.deepEqual(
		action,
		{
			type: actionTypes.BOOT,
			initiallyEnabled: { page: false },
			isNavPopupsEnabled: true,
			sessionToken: '0123456789',
			pageToken: '9876543210',
			page: {
				url: REFERRER,
				title: 'Foo',
				namespaceId: 0,
				id: 2
			},
			user: {
				isAnon: true,
				editCount: 3
			}
		},
		'boots with the initial state'
	);
} );

/**
 * Stubs `wait.js` and adds the deferred and its promise as properties
 * of the module.
 *
 * @param {Object} module
 * @return {void}
 */
function setupWait( module ) {
	module.waitPromise = $.Deferred().resolve().promise( { abort() {} } );
	module.wait = module.sandbox.stub( WaitModule, 'default' ).callsFake(
		() => module.waitPromise
	);
}

/**
 * Sets up a link/mw.Title stub pair that can be passed to the linkDwell action
 * creator.
 *
 * @param {Object} module
 * @return {void}
 */
function setupEl( module ) {
	module.title = TEST_TITLE;
	module.el = $( '<a>' ).get( 0 );
}

QUnit.module( 'ext.popups/actions#linkDwell @integration', {
	beforeEach() {
		this.state = {
			preview: {}
		};
		this.getState = () => this.state;

		// The worst-case implementation of mw.now.
		mw.now = () => Date.now();

		setupEl( this );
	}
} );

QUnit.test( '#linkDwell', function ( assert ) {
	const measures = {},
		dispatch = this.sandbox.spy();

	this.sandbox.stub( mw, 'now' ).returns( new Date() );
	this.sandbox.stub( actions, 'fetch' );

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, measures, null, generateToken, previewTypes.TYPE_PAGE
	)(
		dispatch,
		this.getState
	);

	assert.propEqual(
		dispatch.getCall( 0 ).args[ 0 ], {
			type: actionTypes.LINK_DWELL,
			el: this.el,
			previewType: 'page',
			measures,
			token: 'ABC',
			timestamp: mw.now(),
			title: 'Foo',
			namespaceId: 0,
			promise: Promise.resolve()
		},
		'The dispatcher was called with the correct arguments.'
	);

	// Stub the state tree being updated.
	this.state.preview = {
		enabled: { page: true },
		activeLink: this.el,
		activeToken: generateToken()
	};

	// ---

	return linkDwelled.then( () => {
		assert.strictEqual(
			dispatch.callCount,
			2,
			'The fetch action is dispatched after FETCH_COMPLETE milliseconds.'
		);
	} );
} );

QUnit.test( '#linkDwell doesn\'t continue when previews are disabled', function ( assert ) {
	const event = {},
		dispatch = this.sandbox.spy();

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		enabled: { page: false },
		activeLink: this.el,
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken, previewTypes.TYPE_PAGE
	)(
		dispatch,
		this.getState
	);

	assert.strictEqual(
		dispatch.callCount,
		1,
		'The dispatcher was called once.'
	);

	return linkDwelled.then( () => {
		assert.strictEqual(
			dispatch.callCount,
			1,
			'The dispatcher was not called again.'
		);
	} );
} );

QUnit.test( '#linkDwell doesn\'t continue if the token has changed', function ( assert ) {
	const event = {},
		dispatch = this.sandbox.spy();

	// Stub the state tree being updated by a LINK_DWELL action.
	this.state.preview = {
		enabled: { page: true },
		activeLink: this.el,
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken, previewTypes.TYPE_PAGE
	)(
		dispatch,
		this.getState
	);

	// Stub the state tree being updated by another LINK_DWELL action.
	this.state.preview = {
		enabled: { page: true },

		// Consider the user tabbing back and forth between two links in the time
		// it takes to start fetching data via the gateway: the active link hasn't
		// changed, but the active token has.
		activeLink: this.el,

		activeToken: 'banana'
	};

	return linkDwelled.then( () => {
		assert.strictEqual(
			dispatch.callCount,
			1,
			'The dispatcher was called once.'
		);
	} );
} );

QUnit.test( '#linkDwell dispatches the fetch action', function ( assert ) {
	const event = {},
		dispatch = this.sandbox.spy();

	this.state.preview = {
		enabled: { page: true },
		activeToken: generateToken()
	};

	return actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken, previewTypes.TYPE_PAGE
	)(
		dispatch,
		this.getState
	).then( () => {
		assert.strictEqual(
			dispatch.callCount,
			2,
			'The dispatcher was called twice.'
		);
	} );
} );

QUnit.module( 'ext.popups/actions#fetch', {
	beforeEach() {
		this.now = 0;

		this.sandbox.stub( mw, 'now' ).callsFake( () => this.now );

		setupWait( this );
		setupEl( this );

		this.gatewayDeferred = $.Deferred();
		this.gateway = {
			fetchPreviewForTitle: this.sandbox.stub().returns(
				this.gatewayDeferred.promise( { abort() {} } )
			)
		};

		this.dispatch = this.sandbox.spy();

		this.token = '1234567890';

		// Sugar.
		setDwellTime( previewTypes.TYPE_PAGE, 350 );
		this.fetch = () => {
			return actions.fetch(
				this.gateway, this.title, this.el, this.token, previewTypes.TYPE_PAGE
			)( this.dispatch );
		};
	}
} );

QUnit.test( 'it should fetch data from the gateway immediately', function ( assert ) {
	this.fetch();

	assert.true(
		this.gateway.fetchPreviewForTitle.calledWith( TEST_TITLE ),
		'The gateway was called with the correct arguments.'
	);

	assert.strictEqual( this.dispatch.callCount, 1 );
	assert.propEqual(
		this.dispatch.getCall( 0 ).args[ 0 ],
		{
			type: actionTypes.FETCH_START,
			el: this.el,
			title: 'Foo',
			namespaceId: 0,
			timestamp: this.now,
			promise: $.Deferred().promise( { abort() {} } )
		},
		'It dispatches the FETCH_START action immediately.'
	);
} );

QUnit.test( 'it should dispatch the FETCH_END action when the API request ends', function ( assert ) {
	const fetched = this.fetch();

	this.now += 115;
	this.gatewayDeferred.resolve( {} );

	return fetched.then( () => {
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: actionTypes.FETCH_END,
				el: this.el,
				timestamp: 115
			},
			'The dispatcher was called with the correct arguments.'
		);
	} );
} );

QUnit.test( 'it should delay dispatching the FETCH_COMPLETE action', function ( assert ) {
	const result = {},
		fetched = this.fetch();

	assert.strictEqual(
		this.wait.getCall( 0 ).args[ 0 ],
		350,
		'It waits for FETCH_COMPLETE_TARGET_DELAY - FETCH_START_DELAY milliseconds.'
	);
	this.gatewayDeferred.resolve( result );

	return fetched.then( () => {
		assert.deepEqual(
			this.dispatch.getCall( 2 ).args[ 0 ],
			{
				type: actionTypes.FETCH_COMPLETE,
				el: this.el,
				result,
				token: this.token
			},
			'The dispatcher was called with the correct arguments.'
		);
	} );
} );

QUnit.test( 'it should dispatch the FETCH_FAILED action when the request fails', function ( assert ) {
	const fetched = this.fetch();

	this.gatewayDeferred.reject( new Error( 'API req failed' ) );

	this.now += 115;

	return fetched.then( () => {
		assert.strictEqual(
			this.dispatch.callCount, 3,
			'dispatch called thrice, START, FAILED, and COMPLETE'
		);
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: actionTypes.FETCH_FAILED,
				el: this.el,
				token: this.token
			},
			'The dispatcher was called with the correct arguments.'
		);
	} );
} );

QUnit.test( 'it should dispatch the FETCH_FAILED action when the request fails even after the wait timeout', function ( assert ) {
	// After the wait interval happens, resolve the gateway request
	return this.waitPromise.then( () => {
		this.gatewayDeferred.reject( new Error( 'API req failed' ) );
		return this.fetch();
	} ).then( () => {
		assert.strictEqual(
			this.dispatch.callCount, 3,
			'dispatch called thrice, START, FAILED, and COMPLETE'
		);
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: actionTypes.FETCH_FAILED,
				el: this.el,
				token: this.token
			},
			'The dispatcher was called with the correct arguments.'
		);
	} );
} );

QUnit.test( 'it should dispatch the FETCH_ABORTED action when the request is aborted', function ( assert ) {
	const fetched = this.fetch();
	this.now += 115;
	this.gatewayDeferred.reject( 'http', {
		textStatus: 'abort',
		exception: 'abort',
		xhr: {
			readyState: 0
		}
	} );

	return fetched.then( () => {
		assert.strictEqual(
			this.dispatch.callCount, 2,
			'dispatch called twice with START and  ABORT'
		);
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: actionTypes.FETCH_ABORTED,
				el: this.el,
				token: this.token
			},
			'The dispatcher was called with the correct arguments.'
		);
	} );
} );

QUnit.module( 'ext.popups/actions#abandon', {
	beforeEach() {
		setupWait( this );
		setupEl( this );
	}
} );

QUnit.test( 'it should dispatch start and end actions', function ( assert ) {
	const dispatch = this.sandbox.spy(),
		token = '0123456789',
		getState = () =>
			( {
				preview: {
					activeToken: token,
					promise: $.Deferred().promise( { abort() {} } )
				}
			} );

	this.sandbox.stub( mw, 'now' ).returns( new Date() );

	const abandoned = actions.abandon()( dispatch, getState );

	assert.true(
		dispatch.calledWith( {
			type: actionTypes.ABANDON_START,
			timestamp: mw.now(),
			token
		} ),
		'The dispatcher was called with the correct arguments.'
	);

	// ---

	assert.true(
		this.wait.calledWith( 300 ),
		'Have you spoken with #Design about changing this value?'
	);

	return abandoned.then( () => {
		assert.true(
			dispatch.calledWith( {
				type: actionTypes.ABANDON_END,
				token
			} ),
			'ABANDON_* share the same token.'
		);
	} );
} );

QUnit.test( 'it shouldn\'t dispatch under certain conditions', function ( assert ) {
	const dispatch = this.sandbox.spy(),
		getState = () =>
			( {
				preview: {
					activeToken: undefined
				}
			} );

	return actions.abandon()( dispatch, getState )
		.then( () => {
			assert.strictEqual(
				dispatch.callCount,
				0,
				'The dispatcher was not called.'
			);
		} );
} );

QUnit.module( 'ext.popups/actions#saveSettings' );

QUnit.test( 'it should dispatch an action with previous and current enabled state', function ( assert ) {
	const dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				enabled: { page: false }
			}
		} );

	actions.saveSettings( { page: true } )( dispatch, getState );

	assert.true(
		getState.calledOnce,
		'it should query the global state for the current state'
	);
	assert.true(
		dispatch.calledWith( {
			type: actionTypes.SETTINGS_CHANGE,
			oldValue: { page: false },
			newValue: { page: true }
		} ),
		'it should dispatch the action with the previous and next enabled state'
	);
} );

QUnit.module( 'ext.popups/actions#previewShow', {
	beforeEach() {
		setupWait( this );
	}
} );

QUnit.test( 'it should dispatch the PREVIEW_SHOW action and log a pageview', function ( assert ) {
	const token = '1234567890',
		dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				activeToken: token,
				fetchResponse: {
					title: 'A',
					pageId: 42,
					type: 'page'
				}
			}
		} );

	this.sandbox.stub( mw, 'now' ).returns( new Date() );
	const previewShow = actions
		.previewShow( token )( dispatch, getState );

	assert.true(
		dispatch.calledWith( {
			type: actionTypes.PREVIEW_SHOW,
			token,
			timestamp: mw.now()
		} ),
		'dispatches the preview show event'
	);

	assert.strictEqual(
		this.wait.getCall( 0 ).args[ 0 ],
		1000,
		'It waits for PAGEVIEW_VISIBILITY_DURATION milliseconds before trigging a pageview.'
	);
	return previewShow.then( () => {
		assert.true(
			dispatch.calledTwice,
			'Dispatch was called twice - once for PREVIEW_SHOW then for PREVIEW_SEEN'
		);
		assert.true(
			dispatch.calledWith( {
				type: actionTypes.PREVIEW_SEEN,
				namespace: 0,
				pageId: 42,
				title: 'A'
			} ),
			'Dispatches virtual pageview'
		);
	} );
} );

QUnit.test( 'PREVIEW_SEEN action not called if activeToken changes', function ( assert ) {
	const token = '1234567890',
		dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				activeToken: '911',
				fetchResponse: {
					title: 'A',
					type: 'page'
				}
			}
		} );

	// dispatch event
	const previewShow = actions
		.previewShow( token )( dispatch, getState );

	return previewShow.then( () => {
		assert.true(
			dispatch.calledOnce,
			'Dispatch was only called for PREVIEW_SHOW'
		);
	} );
} );

QUnit.test( 'PREVIEW_SEEN action not called if preview type not page', function ( assert ) {
	const token = '1234567890',
		dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				activeToken: token,
				fetchResponse: {
					title: 'A',
					type: 'empty'
				}
			}
		} );

	// dispatch event
	const previewShow = actions
		.previewShow( token )( dispatch, getState );

	return previewShow.then( () => {
		assert.true(
			dispatch.calledOnce,
			'Dispatch was only called for PREVIEW_SHOW'
		);
	} );
} );
