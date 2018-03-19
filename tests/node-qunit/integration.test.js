import * as Redux from 'redux';
import * as ReduxThunk from 'redux-thunk';
import * as WaitModule from '../../src/wait';
import * as stubs from './stubs';
import * as actions from '../../src/actions';
import reducers from '../../src/reducers';
import registerChangeListener from '../../src/changeListener';

const mw = mediaWiki,
	$ = jQuery,
	/**
	* Whether Gateway#getPageSummary is resolved or rejected.
	* @enum {number}
	*/
	FETCH_RESOLUTION = { RESOLVE: 0, REJECT: 1 };

function identity( x ) { return x; }
function constant( x ) { return () => x; }

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
	beforeEach() {
		// The worst-case implementation of mw.now.
		mw.now = () => Date.now();

		this.resetWait = () => {
			this.waitDeferred = $.Deferred();
			this.waitPromise = this.waitDeferred.promise();
			this.wait.returns( this.waitPromise );
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

		this.registerChangeListener = ( fn ) => {
			return registerChangeListener( this.store, fn );
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

		this.dwell = (
			title, el, ev, fetchResponse, resolution = FETCH_RESOLUTION.RESOLVE
		) => {
			this.resetWait();
			return this.actions.linkDwell( title, el, ev, {
				getPageSummary() {
					const method = resolution === FETCH_RESOLUTION.RESOLVE ?
						'resolve' : 'reject';
					return $.Deferred()[ method ]( fetchResponse ).promise();
				}
			}, () => 'pagetoken' );
		};

		this.dwellAndShowPreview = (
			title, el, ev, fetchResponse, reject = FETCH_RESOLUTION.RESOLVE
		) => {
			const dwelled = this.dwell( title, el, ev, fetchResponse, reject );
			// Resolve the wait timeout for the linkDwell and the fetch action
			this.waitDeferred.resolve();
			return dwelled;
		};

		this.abandon = () => {
			this.resetWait();
			return this.actions.abandon();
		};

		this.abandonAndWait = () => {
			const abandoned = this.abandon();
			this.waitDeferred.resolve();
			return abandoned;
		};

		this.dwellAndPreviewDwell = ( title, el, ev, res ) => {
			return this.dwellAndShowPreview( title, el, ev, res ).then( () => {

				// Get out of the link, and before the delay ends...
				const abandonPromise = this.abandon(),
					abandonWaitDeferred = this.waitDeferred;

				// Dwell over the preview
				this.actions.previewDwell( el );

				// Then the abandon delay finishes
				abandonWaitDeferred.resolve();

				return abandonPromise;
			} );
		};
	}
} );

QUnit.test( 'it boots in INACTIVE state', function ( assert ) {
	const state = this.store.getState();

	assert.equal( state.preview.activeLink, undefined );
	assert.equal( state.preview.linkInteractionToken, undefined );
} );

QUnit.test( 'in INACTIVE state, a link dwell switches it to ACTIVE', function ( assert ) {
	const gateway = {
		getPageSummary() {
			$.Deferred().promise();
		}
	};

	this.actions.linkDwell(
		this.title, this.el, 'event',
		gateway,
		constant( 'pagetoken' )
	);
	const state = this.store.getState();
	assert.equal( state.preview.activeLink, this.el, 'It has an active link' );
	assert.equal( state.preview.shouldShow, false, 'Initializes with NO_DATA' );
} );

QUnit.test( 'in ACTIVE state, fetch end switches it to DATA', function ( assert ) {
	const store = this.store,
		el = this.el;

	return this.dwellAndShowPreview( this.title, el, 'event', 42 )
		.then( () => {
			const state = store.getState();
			assert.equal( state.preview.activeLink, el );
			assert.equal(
				state.preview.shouldShow, true,
				'Should show when data has been fetched' );
		} );
} );

QUnit.test( 'in ACTIVE state, fetch fail switches it to DATA', function ( assert ) {
	const store = this.store,
		el = this.el;

	return this.dwellAndShowPreview(
		this.title, el, 'event', 42, FETCH_RESOLUTION.REJECT
	).then( () => {
		const state = store.getState();
		assert.equal( state.preview.activeLink, el );
		assert.equal( state.preview.shouldShow, true,
			'Should show when data couldn\'t be fetched' );
	} );
} );

QUnit.test( 'in ACTIVE state, abandon start, and then end, switch it to INACTIVE', function ( assert ) {
	const el = this.el;

	return this.dwellAndShowPreview( this.title, el, 'event', 42 )
		.then( () => {
			return this.abandonAndWait( el );
		} ).then( () => {
			const state = this.store.getState();
			assert.equal( state.preview.activeLink, undefined,
				'After abandoning, preview is back to INACTIVE' );
		} );
} );

QUnit.test( 'in ACTIVE state, abandon link, and then dwell preview, should keep it active after all delays', function ( assert ) {
	const el = this.el;

	return this.dwellAndPreviewDwell( this.title, el, 'event', 42 )
		.then( () => {
			const state = this.store.getState();
			assert.equal( state.preview.activeLink, el );
		} );
} );

QUnit.test( 'in ACTIVE state, abandon link, hover preview, back to link, should keep it active after all delays', function ( assert ) {
	const el = this.el;

	// Dwell link, abandon it & hover preview
	return this.dwellAndPreviewDwell( this.title, el, 'event', 42 )
		.then( () => {
			// Start abandoning the preview
			const abandonedPreview = this.abandon();
			const abandonWaitDeferred = this.waitDeferred;

			// Dwell back into the link, new event ('event2') is triggered
			const dwelled = this.dwell( this.title, el, 'event2', 42 );
			const dwellWaitDeferred = this.waitDeferred;

			// Preview abandon happens next, before the fetch
			abandonWaitDeferred.resolve();

			// Then dwell wait & fetch happens
			dwellWaitDeferred.resolve();

			return $.when( abandonedPreview, dwelled );
		} )
		.then( () => {
			const state = this.store.getState();
			assert.equal( state.preview.activeLink, el );
		} );
} );
