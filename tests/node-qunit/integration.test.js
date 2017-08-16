import * as Redux from 'redux';
import * as ReduxThunk from 'redux-thunk';
import * as WaitModule from '../../src/wait';
import * as stubs from './stubs';
import * as actions from '../../src/actions';
import reducers from '../../src/reducers';
import registerChangeListener from '../../src/changeListener';

var mw = mediaWiki,
	$ = jQuery,
	// Store the real wait to be actually used in tests
	wait = WaitModule.default;

function identity( x ) { return x; }
function constant( x ) { return function () { return x; }; }

/*
	* Integration tests for actions and state of the preview part of the system.
	* Follows a diagram of the interactions considered valid, which will be
	* used as a basis for the following tests:
	*

+--------+
|INACTIVE+-----------------------+
+---+----+                       |
		^                            |
		| link or preview            |
		| abandon end                |
		|                  link_dwell|
		|                            |
		|                            |
		|                            |
+---|----------------------------|---+
|   |           ACTIVE           |   |
+---|----------------------------|---+
|   +                            v   |
| OFF_LINK                   ON_LINK |    Inside ACTIVE, or out
|   +  ^    link or preview   |  ^   |    of it, only actions with
|   |  |    abandon start     |  |   |    that same active link are
|   |  +----------------------+  |   |    valid. Others are ignored.
|   |                            |   |
|   +----------------------------+   |
|     preview or same link dwell     |
|                                    |
|      NO_DATA +-------> DATA        |
|              fetch end             |
+------------------------------------+

	*/

QUnit.module( 'ext.popups preview @integration', {
	beforeEach: function () {
		var that = this;

		// The worst-case implementation of mw.now.
		mw.now = function () { return Date.now(); };

		this.resetWait = function () {
			that.waitDeferred = $.Deferred();
			that.waitPromise = that.waitDeferred.promise();
			that.wait.returns( that.waitPromise );
		};

		this.wait = this.sandbox.stub( WaitModule, 'default' );
		this.resetWait();

		this.store = Redux.createStore(
			Redux.combineReducers( reducers ),
			Redux.compose( Redux.applyMiddleware( ReduxThunk.default ) )
		);

		this.actions = Redux.bindActionCreators(
			actions,
			this.store.dispatch
		);

		this.registerChangeListener = function ( fn ) {
			return registerChangeListener( that.store, fn );
		};

		this.title = stubs.createStubTitle( 1, 'Foo' );

		this.el = $( '<a href="/wiki/Foo">' );

		this.actions.boot(
			/* isEnabled: */
			constant( true ),
			/* user */
			{ sessionId: constant( 'sessiontoken' ),
				isAnon: constant( true ) },
			/* userSettings: */
			{ getPreviewCount: constant( 1 ) },
			/* generateToken: */
			constant( 'pagetoken' ),
			/* config: */
			{ get: identity }
		);

		this.dwell = function ( title, el, ev, fetchResponse ) {
			that.resetWait();
			that.actions.linkDwell( title, el, ev, {
				getPageSummary: function () {
					return $.Deferred().resolve( fetchResponse ).promise();
				}
			}, function () { return 'pagetoken'; } );
			return that.waitPromise;
		};

		this.dwellAndShowPreview = function ( title, el, ev, fetchResponse ) {
			that.dwell( title, el, ev, fetchResponse );
			that.waitDeferred.resolve();

			// Wait for the next tick to resolve pending callbacks. N.B. that the
			// fetch action invokes wait twice.
			return wait( 0 )
				.then( function () {
					that.waitDeferred.resolve();

					return that.waitPromise;
				} );
		};

		this.abandon = function () {
			that.resetWait();
			that.actions.abandon();
			return that.waitPromise;
		};

		this.abandonAndWait = function () {
			that.abandon();
			that.waitDeferred.resolve();
			return wait( 0 ); // Wait for next tick to resolve pending callbacks
		};

		this.dwellAndPreviewDwell = function ( title, el, ev, res ) {
			return that.dwellAndShowPreview( title, el, ev, res ).then( function () {

				// Get out of the link, and before the delay ends...
				var abandonPromise = that.abandon( el ),
					abandonDeferred = that.waitDeferred;

				// Dwell over the preview
				that.actions.previewDwell( el );

				// Then the abandon delay finishes
				abandonDeferred.resolve();

				return abandonPromise;
			} );
		};

		this.abandonPreview = function () {
			that.resetWait();
			that.actions.abandon();

			return that.waitPromise;
		};
	}
} );

QUnit.test( 'it boots in INACTIVE state', function ( assert ) {
	var state = this.store.getState();

	assert.equal( state.preview.activeLink, undefined );
	assert.equal( state.preview.linkInteractionToken, undefined );
} );

QUnit.test( 'in INACTIVE state, a link dwell switches it to ACTIVE', function ( assert ) {
	var state,
		gateway = {
			getPageSummary: function () {
				$.Deferred().promise();
			}
		};

	this.actions.linkDwell(
		this.title, this.el, 'event',
		gateway,
		constant( 'pagetoken' )
	);
	state = this.store.getState();
	assert.equal( state.preview.activeLink, this.el, 'It has an active link' );
	assert.equal( state.preview.shouldShow, false, 'Initializes with NO_DATA' );
} );

QUnit.test( 'in ACTIVE state, fetch end switches it to DATA', function ( assert ) {
	var store = this.store,
		el = this.el;

	return this.dwellAndShowPreview( this.title, el, 'event', 42 ).then( function () {
		var state = store.getState();
		assert.equal( state.preview.activeLink, el );
		assert.equal( state.preview.shouldShow, true, 'Should show when data has been fetched' );
	} );
} );

QUnit.test( 'in ACTIVE state, abandon start, and then end, switch it to INACTIVE', function ( assert ) {
	var that = this,
		el = this.el;

	return this.dwellAndShowPreview( this.title, el, 'event', 42 ).then( function () {
		return that.abandonAndWait( el );
	} ).then( function () {
		var state = that.store.getState();
		assert.equal( state.preview.activeLink, undefined, 'After abandoning, preview is back to INACTIVE' );
	} );
} );

QUnit.test( 'in ACTIVE state, abandon link, and then dwell preview, should keep it active after all delays', function ( assert ) {
	var that = this,
		el = this.el;

	return this.dwellAndPreviewDwell( this.title, el, 'event', 42 )
		.then( function () {
			var state = that.store.getState();
			assert.equal( state.preview.activeLink, el );
		} );
} );

QUnit.test( 'in ACTIVE state, abandon link, hover preview, back to link, should keep it active after all delays', function ( assert ) {
	var that = this,
		el = this.el;

	return this.dwellAndPreviewDwell( this.title, el, 'event', 42 )
		.then( function () {
			var abandonPreviewDeferred, dwellPromise, dwellDeferred;

			// Start abandoning the preview
			that.abandonPreview( el );

			abandonPreviewDeferred = that.waitDeferred;
			// Dwell back into the link, new event is triggered
			dwellPromise = that.dwell( that.title, el, 'event2', 42 );
			dwellDeferred = that.waitDeferred;

			// Preview abandon happens next, before the fetch
			abandonPreviewDeferred.resolve();

			// Then fetch happens
			dwellDeferred.resolve();

			return dwellPromise;
		} )
		.then( function () {
			var state = that.store.getState();
			assert.equal( state.preview.activeLink, el );
		} );
} );
