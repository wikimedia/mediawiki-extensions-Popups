import { createStubUser, createStubTitle } from './stubs';
import * as actions from '../../src/actions';
import * as WaitModule from '../../src/wait';

const mw = mediaWiki,
	REFERRER = 'https://en.wikipedia.org/wiki/Kitten';

function generateToken() {
	return '9876543210';
}

QUnit.module( 'ext.popups/actions' );

QUnit.test( '#boot', ( assert ) => {
	const config = new Map(), /* global Map */
		stubUser = createStubUser( /* isAnon = */ true );

	config.set( 'wgTitle', 'Foo' );
	config.set( 'wgNamespaceNumber', 1 );
	config.set( 'wgArticleId', 2 );
	config.set( 'wgUserEditCount', 3 );
	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	const stubUserSettings = {
		getPreviewCount() {
			return 22;
		}
	};

	assert.expect( 1 );

	const action = actions.boot(
		false,
		stubUser,
		stubUserSettings,
		generateToken,
		config,
		REFERRER
	);

	assert.deepEqual(
		action,
		{
			type: 'BOOT',
			isEnabled: false,
			isNavPopupsEnabled: true,
			sessionToken: '0123456789',
			pageToken: '9876543210',
			page: {
				url: REFERRER,
				title: 'Foo',
				namespaceId: 1,
				id: 2
			},
			user: {
				isAnon: true,
				editCount: 3,
				previewCount: 22
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
	*/
function setupWait( module ) {
	module.waitPromise = $.Deferred().resolve().promise();
	module.wait = module.sandbox.stub( WaitModule, 'default' ).callsFake(
		() => module.waitPromise
	);
}

/**
	* Sets up a link/mw.Title stub pair that can be passed to the linkDwell action
	* creator.
	*
	* @param {Object} module
	*/
function setupEl( module ) {
	module.title = createStubTitle( 1, 'Foo' );
	module.el = $( '<a>' ).eq( 0 );
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
	const event = {},
		dispatch = this.sandbox.spy();

	assert.expect( 2 );

	this.sandbox.stub( mw, 'now' ).returns( new Date() );
	this.sandbox.stub( actions, 'fetch' );

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken
	)(
		dispatch,
		this.getState
	);

	assert.deepEqual( dispatch.getCall( 0 ).args[ 0 ], {
		type: 'LINK_DWELL',
		el: this.el,
		event,
		token: '9876543210',
		timestamp: mw.now(),
		title: 'Foo',
		namespaceId: 1
	} );

	// Stub the state tree being updated.
	this.state.preview = {
		enabled: true,
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

	assert.expect( 2 );

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		enabled: false,
		activeLink: this.el,
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken
	)(
		dispatch,
		this.getState
	);

	assert.strictEqual( dispatch.callCount, 1 );

	return linkDwelled.then( () => {
		assert.strictEqual( dispatch.callCount, 1 );
	} );
} );

QUnit.test( '#linkDwell doesn\'t continue if the token has changed', function ( assert ) {
	const event = {},
		dispatch = this.sandbox.spy();

	assert.expect( 1 );

	// Stub the state tree being updated by a LINK_DWELL action.
	this.state.preview = {
		enabled: true,
		activeLink: this.el,
		activeToken: generateToken()
	};

	const linkDwelled = actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken
	)(
		dispatch,
		this.getState
	);

	// Stub the state tree being updated by another LINK_DWELL action.
	this.state.preview = {
		enabled: true,

		// Consider the user tabbing back and forth between two links in the time
		// it takes to start fetching data via the gateway: the active link hasn't
		// changed, but the active token has.
		activeLink: this.el,

		activeToken: 'banana'
	};

	return linkDwelled.then( () => {
		assert.strictEqual( dispatch.callCount, 1 );
	} );
} );

QUnit.test( '#linkDwell dispatches the fetch action', function ( assert ) {
	const event = {},
		dispatch = this.sandbox.spy();

	assert.expect( 1 );

	this.state.preview = {
		enabled: true,
		activeToken: generateToken()
	};

	return actions.linkDwell(
		this.title, this.el, event, /* gateway = */ null, generateToken
	)(
		dispatch,
		this.getState
	).then( () => {
		assert.strictEqual( dispatch.callCount, 2 );
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
			getPageSummary: this.sandbox.stub().returns(
				this.gatewayDeferred.promise()
			)
		};

		this.dispatch = this.sandbox.spy();

		this.token = '1234567890';

		// Sugar.
		this.fetch = () => {
			return actions.fetch(
				this.gateway, this.title, this.el, this.token
			)( this.dispatch );
		};
	}
} );

QUnit.test( 'it should fetch data from the gateway immediately', function ( assert ) {
	assert.expect( 3 );

	this.fetch();

	assert.ok( this.gateway.getPageSummary.calledWith( 'Foo' ) );

	assert.ok( this.dispatch.calledOnce );
	assert.deepEqual(
		this.dispatch.getCall( 0 ).args[ 0 ],
		{
			type: 'FETCH_START',
			el: this.el,
			title: 'Foo',
			namespaceId: 1,
			timestamp: this.now
		},
		'It dispatches the FETCH_START action immediately.'
	);
} );

QUnit.test( 'it should dispatch the FETCH_END action when the API request ends', function ( assert ) {
	assert.expect( 1 );

	const fetched = this.fetch();

	this.now += 115;
	this.gatewayDeferred.resolve( {} );

	return fetched.then( () => {
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: 'FETCH_END',
				el: this.el,
				timestamp: 115
			}
		);
	} );
} );

QUnit.test( 'it should delay dispatching the FETCH_COMPLETE action', function ( assert ) {
	const result = {},
		fetched = this.fetch();

	assert.expect( 2 );

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
				type: 'FETCH_COMPLETE',
				el: this.el,
				result,
				token: this.token
			}
		);
	} );
} );

QUnit.test( 'it should dispatch the FETCH_FAILED action when the request fails', function ( assert ) {
	const fetched = this.fetch();

	assert.expect( 2 );

	this.gatewayDeferred.reject( new Error( 'API req failed' ) );

	this.now += 115;

	return fetched.then( () => {
		assert.equal(
			this.dispatch.callCount, 3,
			'dispatch called thrice, START, FAILED, and COMPLETE'
		);
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: 'FETCH_FAILED',
				el: this.el
			}
		);
	} );
} );

QUnit.test( 'it should dispatch the FETCH_FAILED action when the request fails even after the wait timeout', function ( assert ) {
	const fetched = this.fetch();

	assert.expect( 2 );

	// After the wait interval happens, resolve the gateway request
	return this.waitPromise.then( () => {
		this.gatewayDeferred.reject( new Error( 'API req failed' ) );
		return fetched;
	} ).then( () => {
		assert.equal(
			this.dispatch.callCount, 3,
			'dispatch called thrice, START, FAILED, and COMPLETE'
		);
		assert.deepEqual(
			this.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: 'FETCH_FAILED',
				el: this.el
			}
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
					activeToken: token
				}
			} );

	assert.expect( 3 );

	this.sandbox.stub( mw, 'now' ).returns( new Date() );

	const abandoned = actions.abandon( this.el )( dispatch, getState );

	assert.ok( dispatch.calledWith( {
		type: 'ABANDON_START',
		timestamp: mw.now(),
		token
	} ) );

	// ---

	assert.ok(
		this.wait.calledWith( 300 ),
		'Have you spoken with #Design about changing this value?'
	);

	return abandoned.then( () => {
		assert.ok(
			dispatch.calledWith( {
				type: 'ABANDON_END',
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

	return actions.abandon( this.el )( dispatch, getState )
		.then( () => {
			assert.ok( dispatch.notCalled );
		} );
} );

QUnit.module( 'ext.popups/actions#saveSettings' );

QUnit.test( 'it should dispatch an action with previous and current enabled state', function ( assert ) {
	const dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				enabled: false
			}
		} );

	actions.saveSettings( /* enabled = */ true )( dispatch, getState );

	assert.ok(
		getState.calledOnce,
		'it should query the global state for the current state'
	);
	assert.ok(
		dispatch.calledWith( {
			type: 'SETTINGS_CHANGE',
			wasEnabled: false,
			enabled: true
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

	assert.ok(
		dispatch.calledWith( {
			type: 'PREVIEW_SHOW',
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
		assert.ok(
			dispatch.calledTwice,
			'Dispatch was called twice - once for PREVIEW_SHOW then for PREVIEW_SEEN'
		);
		assert.ok(
			dispatch.calledWith( {
				type: 'PREVIEW_SEEN',
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
		assert.ok(
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
		assert.ok(
			dispatch.calledOnce,
			'Dispatch was only called for PREVIEW_SHOW'
		);
	} );
} );
