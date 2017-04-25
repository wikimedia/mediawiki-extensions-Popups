var mock = require( 'mock-require' ),
	createStubUser = require( './stubs' ).createStubUser,
	actions = require( '../../src/actions' ),
	mw = mediaWiki;

function generateToken() {
	return '9876543210';
}

QUnit.module( 'ext.popups/actions' );

QUnit.test( '#boot', function ( assert ) {
	var config = new Map(), /* global Map */
		stubUser = createStubUser( /* isAnon = */ true ),
		stubUserSettings,
		action;

	config.set( 'wgTitle', 'Foo' );
	config.set( 'wgNamespaceNumber', 1 );
	config.set( 'wgArticleId', 2 );
	config.set( 'wgUserEditCount', 3 );
	config.set( 'wgPopupsConflictsWithNavPopupGadget', true );

	stubUserSettings = {
		getPreviewCount: function () {
			return 22;
		}
	};

	assert.expect( 1 );

	action = actions.boot(
		false,
		stubUser,
		stubUserSettings,
		generateToken,
		config
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
				title: 'Foo',
				namespaceID: 1,
				id: 2
			},
			user: {
				isAnon: true,
				editCount: 3,
				previewCount: 22
			}
		}
	);
} );

/**
	* Stubs `wait.js` and adds the deferred and its promise as properties
	* of the module.
	*
	* @param {Object} module
	*/
function setupWait( module ) {
	module.waitDeferreds = [];
	module.waitPromises = [];

	module.wait = module.sandbox.spy( function () {
		var deferred = $.Deferred(),
			promise = deferred.promise();

		module.waitDeferreds.push( deferred );
		module.waitPromises.push( promise );

		return promise;
	} );

	mock( '../../src/wait', module.wait );
	// Re-require actions so that it uses the mocked wait module
	actions = mock.reRequire( '../../src/actions' );
}

function teardownWait() {
	mock.stop( '../../src/wait' );
}

/**
	* Sets up an `a` element that can be passed to action creators.
	*
	* @param {Object} module
	*/
function setupEl( module ) {
	module.el = $( '<a>' )
		.data( 'page-previews-title', 'Foo' )
		.eq( 0 );
}

QUnit.module( 'ext.popups/actions#linkDwell @integration', {
	beforeEach: function () {
		var that = this;

		this.state = {
			preview: {}
		};
		this.getState = function () {
			return that.state;
		};

		// The worst-case implementation of mw.now.
		mw.now = function () { return Date.now(); };

		setupWait( this );
		setupEl( this );
	},
	afterEach: function () {
		teardownWait();
	}
} );

QUnit.test( '#linkDwell', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	this.sandbox.stub( mw, 'now' ).returns( new Date() );
	this.sandbox.stub( actions, 'fetch' );

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		activeToken: generateToken()
	};

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	assert.deepEqual( dispatch.getCall( 0 ).args[ 0 ], {
		type: 'LINK_DWELL',
		el: this.el,
		event: event,
		token: '9876543210',
		timestamp: mw.now()
	} );

	// Stub the state tree being updated.
	this.state.preview = {
		enabled: true,
		activeLink: this.el,
		activeToken: generateToken()
	};

	// ---

	this.waitPromises[ 0 ].then( function () {
		assert.strictEqual(
			dispatch.callCount,
			2,
			'The fetch action is dispatched after FETCH_COMPLETE milliseconds.'
		);

		done();
	} );

	// After FETCH_START_DELAY milliseconds...
	this.waitDeferreds[ 0 ].resolve();
} );

QUnit.test( '#linkDwell doesn\'t continue when previews are disabled', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	// Stub the state tree being updated by the LINK_DWELL action.
	this.state.preview = {
		enabled: false,
		activeLink: this.el,
		activeToken: generateToken()
	};

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	assert.strictEqual( this.wait.callCount, 1 );

	this.waitPromises[ 0 ].then( function () {
		assert.strictEqual( dispatch.callCount, 1 );

		done();
	} );

	// After FETCH_START_DELAY milliseconds...
	this.waitDeferreds[ 0 ].resolve();
} );

QUnit.test( '#linkDwell doesn\'t continue if the token has changed', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	// Stub the state tree being updated by a LINK_DWELL action.
	this.state.preview = {
		enabled: true,
		activeLink: this.el,
		activeToken: generateToken()
	};

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
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

	this.waitPromises[ 0 ].then( function () {
		assert.strictEqual( dispatch.callCount, 1 );

		done();
	} );

	// After FETCH_START_DELAY milliseconds...
	this.waitDeferreds[ 0 ].resolve();
} );

QUnit.test( '#linkDwell dispatches the fetch action', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	this.state.preview = {
		enabled: true,
		activeToken: generateToken()
	};

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	this.waitPromises[ 0 ].then( function () {
		assert.strictEqual( dispatch.callCount, 2 );

		done();
	} );

	// After FETCH_START_DELAY milliseconds...
	this.waitDeferreds[ 0 ].resolve();
} );

QUnit.module( 'ext.popups/actions#fetch', {
	beforeEach: function () {
		var that = this;

		// Setup the mw.now stub before actions is re-required in setupWait
		this.now = 0;

		this.sandbox.stub( mw, 'now', function () {
			return that.now;
		} );

		setupWait( this );
		setupEl( this );

		this.gatewayDeferred = $.Deferred(),
		this.gatewayPromise = this.gatewayDeferred.promise();
		this.gateway = {
			getPageSummary: this.sandbox.stub().returns( this.gatewayPromise )
		};

		this.dispatch = this.sandbox.spy();

		this.token = '1234567890';

		// Sugar.
		this.fetch = function () {
			actions.fetch( that.gateway, that.el, that.token )( that.dispatch );
		};
	},
	afterEach: function () {
		teardownWait();
	}
} );

QUnit.test( 'it should fetch data from the gateway immediately', function ( assert ) {
	this.fetch();

	assert.ok( this.gateway.getPageSummary.calledWith( 'Foo' ) );

	assert.ok(
		this.dispatch.calledWith( {
			type: 'FETCH_START',
			el: this.el,
			title: 'Foo',
			timestamp: this.now
		} ),
		'It dispatches the FETCH_START action immediately.'
	);
} );

QUnit.test( 'it should dispatch the FETCH_END action when the API request ends', function ( assert ) {
	var that = this,
		done = assert.async();

	this.fetch();

	this.now += 115;
	this.gatewayDeferred.resolve( {} );

	this.gatewayPromise.then( function () {
		assert.deepEqual(
			that.dispatch.getCall( 1 ).args[ 0 ],
			{
				type: 'FETCH_END',
				el: that.el,
				timestamp: 115
			}
		);

		done();
	} );
} );

QUnit.test( 'it should delay dispatching the FETCH_COMPLETE action', function ( assert ) {
	var whenDeferred = $.Deferred(),
		whenSpy,
		args,
		result = {},
		that = this,
		done = assert.async();

	whenSpy = this.sandbox.stub( $, 'when' )
		.returns( whenDeferred.promise() );

	this.fetch();

	assert.strictEqual(
		this.wait.getCall( 0 ).args[ 0 ],
		350,
		'It waits for FETCH_COMPLETE_TARGET_DELAY - FETCH_START_DELAY milliseconds.'
	);

	// ---
	args = whenSpy.getCall( 0 ).args;

	// This assertion is disabled due to $.Promise#then and #fail returning a new
	// instance of $.Promise.
	// assert.strictEqual( args[ 0 ], this.gatewayPromise );

	assert.strictEqual( args[ 1 ], this.waitPromises[ 0 ] );

	// ---
	this.now += 500;
	whenDeferred.resolve( result );

	whenDeferred.then( function () {

		// Ensure the following assertions are made after all callbacks have been
		// executed. Use setTimeout( _, 0 ) since it's not critical that these
		// assertions are run before I/O is processed, i.e. we don't require
		// process.nextTick.
		setTimeout( function () {
			assert.deepEqual(
				that.dispatch.getCall( 1 ).args[ 0 ],
				{
					type: 'FETCH_COMPLETE',
					el: that.el,
					result: result,
					timestamp: 500,
					token: that.token
				}
			);

			done();
		}, 0 );
	} );
} );

QUnit.module( 'ext.popups/actions#abandon', {
	beforeEach: function () {
		setupWait( this );
	},
	afterEach: function () {
		teardownWait();
	}
} );

QUnit.test( 'it should dispatch start and end actions', function ( assert ) {
	var dispatch = this.sandbox.spy(),
		token = '0123456789',
		getState = function () {
			return {
				preview: {
					activeToken: token
				}
			};
		},
		done = assert.async();

	this.sandbox.stub( mw, 'now' ).returns( new Date() );

	actions.abandon( this.el )( dispatch, getState );

	assert.ok( dispatch.calledWith( {
		type: 'ABANDON_START',
		timestamp: mw.now(),
		token: token
	} ) );

	// ---

	assert.ok(
		this.wait.calledWith( 300 ),
		'Have you spoken with #Design about changing this value?'
	);

	this.waitPromises[ 0 ].then( function () {
		assert.ok(
			dispatch.calledWith( {
				type: 'ABANDON_END',
				token: token
			} ),
			'ABANDON_* share the same token.'
		);

		done();
	} );

	// After ABANDON_END_DELAY milliseconds...
	this.waitDeferreds[ 0 ].resolve();
} );

QUnit.test( 'it shouldn\'t dispatch under certain conditions', function ( assert ) {
	var dispatch = this.sandbox.spy(),
		getState = function () {
			return {
				preview: {
					activeToken: undefined
				}
			};
		};

	actions.abandon( this.el )( dispatch, getState );

	assert.ok( dispatch.notCalled );
} );

QUnit.module( 'ext.popups/actions#saveSettings' );

QUnit.test( 'it should dispatch an action with previous and current enabled state', function ( assert ) {
	var dispatch = this.sandbox.spy(),
		getState = this.sandbox.stub().returns( {
			preview: {
				enabled: false
			}
		} );

	actions.saveSettings( /* enabled = */ true )( dispatch, getState );

	assert.ok( getState.calledOnce, 'it should query the global state for the current state' );
	assert.ok( dispatch.calledWith( {
		type: 'SETTINGS_CHANGE',
		wasEnabled: false,
		enabled: true
	} ), 'it should dispatch the action with the previous and next enabled state' );
} );

QUnit.module( 'ext.popups/actions#previewShow' );

QUnit.test( 'it should dispatch the PREVIEW_SHOW action', function ( assert ) {
	var token = '1234567890';

	this.sandbox.stub( mw, 'now' ).returns( new Date() );

	assert.deepEqual(
		actions.previewShow( token ),
		{
			type: 'PREVIEW_SHOW',
			token: token,
			timestamp: mw.now()
		}
	);
} );
