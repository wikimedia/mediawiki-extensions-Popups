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
	module.waitDeferred = $.Deferred();
	module.waitPromise = module.waitDeferred.promise();
	module.wait = module.sandbox.stub().returns( module.waitPromise );

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
	setup: function () {
		var that = this;

		this.state = {
			preview: {}
		};
		this.getState = function () {
			return that.state;
		};

		// Fake implementation of mw.now
		mw.now = function () { return Date.now(); };

		setupWait( this );
		setupEl( this );
	},
	teardown: function () {
		teardownWait();
	}
} );

QUnit.test( '#linkDwell', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	this.sandbox.stub( mw, 'now' ).returns( new Date() );
	this.sandbox.stub( actions, 'fetch' );

	// Set the state for when dispatch is called. New token is accepted
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

	this.waitPromise.then( function () {
		assert.strictEqual(
			dispatch.callCount,
			2,
			'The fetch action is dispatched after 50 ms'
		);

		done();
	} );

	// After 50 ms...
	this.waitDeferred.resolve();
} );

QUnit.test( '#linkDwell doesn\'t continue when previews are disabled', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	this.state.preview = {
		enabled: false
	};

	this.waitPromise.then( function () {
		assert.strictEqual( dispatch.callCount, 1 );

		done();
	} );

	// After 500 ms...
	this.waitDeferred.resolve();
} );

QUnit.test( '#linkDwell doesn\'t continue if the token has changed', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	this.state.preview = {
		enabled: true,

		// Consider the user tabbing back and forth between two links in the time
		// it takes to start fetching data via the gateway: the active link hasn't
		// changed, but the active token has.
		activeLink: this.el,

		activeToken: '0123456789'
	};

	this.waitPromise.then( function () {
		assert.strictEqual( dispatch.callCount, 1 );

		done();
	} );

	// After 500 ms...
	this.waitDeferred.resolve();
} );

QUnit.test( '#linkDwell doesn\'t continue if the interaction is the same one', function ( assert ) {
	var done = assert.async(),
		event = {},
		dispatch = this.sandbox.spy();

	this.state.preview = {
		activeToken: '0123456789'
	};

	actions.linkDwell( this.el, event, /* gateway = */ null, generateToken )(
		dispatch,
		this.getState
	);

	this.waitPromise.then( function () {
		assert.strictEqual( dispatch.callCount, 1 );

		done();
	} );

	// After 500 ms...
	this.waitDeferred.resolve();
} );

QUnit.module( 'ext.popups/actions#fetch', {
	setup: function () {
		var that = this;

		// Setup the mw.now stub before actions is re-required in setupWait
		that.now = 0;

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

		// Sugar.
		this.fetch = function () {
			actions.fetch( that.gateway, that.el, that.now )( that.dispatch );
		};
	},
	teardown: function () {
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

QUnit.test( 'it should delay dispatching the FETCH_END action', function ( assert ) {
	var that = this,
		result = {},
		done = assert.async( 2 );

	assert.expect( 3 );

	this.fetch();

	this.gatewayPromise.then( function () {
		assert.ok(
			that.wait.calledWith( 250 ),
			'FETCH_END is delayed by 250 (500 - 250) ms. ' +
			'If you\'ve changed FETCH_END_TARGET_DELAY, then have you spoken with #Design about changing this value?'
		);

		that.waitDeferred.resolve();

		done();
	} );


	this.waitPromise.then( function () {
		// Let the wait.then execute to run the dispatch before asserting
		setTimeout( function () {
			assert.equal( that.dispatch.callCount, 2, 'dispatch called for start and end' );
			assert.deepEqual( that.dispatch.getCall( 1 ).args[ 0 ], {
				type: 'FETCH_END',
				el: that.el,
				result: result,
				delay: 250,
				timestamp: 250
			} );

			done();
		} );
	} );

	// The API request took 250 ms.
	this.now += 250;
	this.gatewayDeferred.resolve( result );
} );

QUnit.test(
	'it shouldn\'t delay dispatching the FETCH_END action if the API request is over the target',
	function ( assert ) {
		var that = this,
			done = assert.async();

		this.fetch();

		this.gatewayPromise.then( function () {
			assert.ok(
				that.wait.calledWith( 0 ),
				'FETCH_END isn\'t delayed.'
			);
			done();
		} );

		// The API request took 301 ms.
		this.now += 501;
		this.gatewayDeferred.resolve();
	}
);

QUnit.module( 'ext.popups/actions#abandon', {
	setup: function () {
		setupWait( this );
	},
	teardown: function () {
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

	this.waitPromise.then( function () {
		assert.ok(
			dispatch.calledWith( {
				type: 'ABANDON_END',
				token: token
			} ),
			'ABANDON_* share the same token.'
		);

		done();
	} );

	// After 300 ms...
	this.waitDeferred.resolve();
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
