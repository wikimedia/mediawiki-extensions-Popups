( function ( mw, $ ) {

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
		setup: function () {
			var that = this;

			this.resetWait = function () {
				that.waitDeferred = $.Deferred();
				that.waitPromise = that.waitDeferred.promise();
			};
			this.resetWait();
			this.sandbox.stub( mw.popups, 'wait', function () {
				return that.waitPromise;
			} );

			this.store = Redux.createStore(
				Redux.combineReducers( mw.popups.reducers ),
				Redux.compose( Redux.applyMiddleware( ReduxThunk.default ) )
			);

			this.actions = Redux.bindActionCreators(
				mw.popups.actions,
				this.store.dispatch
			);

			this.registerChangeListener = function ( fn ) {
				return mw.popups.registerChangeListener( that.store, fn );
			};

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

			this.dwell = function ( el, ev, fetchResponse ) {
				that.resetWait();
				that.actions.linkDwell( el, ev, function () {
					return $.Deferred().resolve( fetchResponse ).promise();
				}, function () { return 'pagetoken'; } );
				return that.waitPromise;
			};

			this.dwellAndShowPreview = function ( el, ev, fetchResponse ) {
				var p = that.dwell( el, ev, fetchResponse );
				that.waitDeferred.resolve();
				return p;
			};

			this.abandon = function ( el ) {
				that.resetWait();
				that.actions.linkAbandon( el );
				return that.waitPromise;
			};

			this.abandonAndWait = function ( el ) {
				var p = that.abandon( el );
				that.waitDeferred.resolve();
				return p;
			};

			this.dwellAndPreviewDwell = function ( el, ev, res ) {
				return that.dwellAndShowPreview( el, ev, res ).then( function () {

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

			this.abandonPreview = function ( el ) {
				that.resetWait();
				that.actions.previewAbandon( el );

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
		var state;
		this.actions.linkDwell(
			'element', 'event',
			/* gateway: */ function () { return $.Deferred().promise(); },
			constant( 'pagetoken' )
		);
		state = this.store.getState();
		assert.equal( state.preview.activeLink, 'element', 'It has an active link' );
		assert.equal( state.preview.shouldShow, false, 'Initializes with NO_DATA' );
	} );

	QUnit.test( 'in ACTIVE state, fetch end switches it to DATA', function ( assert ) {
		var store = this.store;
		this.dwellAndShowPreview( 'element', 'event', 42 ).then( function () {
			var state = store.getState();
			assert.equal( state.preview.activeLink, 'element' );
			assert.equal( state.preview.shouldShow, true, 'Should show when data has been fetched' );
		} );
	} );

	QUnit.test( 'in ACTIVE state, abandon start, and then end, switch it to INACTIVE', function ( assert ) {
		var that = this;
		this.dwellAndShowPreview( 'element', 'event', 42 ).then( function () {
			return that.abandonAndWait( 'element' );
		} ).then( function () {
			var state = that.store.getState();
			assert.equal( state.preview.activeLink, undefined, 'After abandoning, preview is back to INACTIVE' );
		} );
	} );

	QUnit.test( 'in ACTIVE state, abandon link, and then dwell preview, should keep it active after all delays', function ( assert ) {
		var that = this;
		this.dwellAndPreviewDwell( 'element', 'event', 42 )
			.then( function () {
				var state = that.store.getState();
				assert.equal( state.preview.activeLink, 'element' );
			} );
	} );

	QUnit.test( 'in ACTIVE state, abandon link, hover preview, back to link, should keep it active after all delays', function ( assert ) {
		var that = this;
		this.dwellAndPreviewDwell( 'element', 'event', 42 )
			.then( function () {
				var abandonPreviewDeferred, dwellPromise, dwellDeferred;

				// Start abandoning the preview
				that.abandonPreview( 'element' );

				abandonPreviewDeferred = that.waitDeferred;
				// Dwell back into the link, new event is triggered
				dwellPromise = that.dwell( 'element', 'event2', 42 );
				dwellDeferred = that.waitDeferred;

				// Preview abandon happens next, before the fetch
				abandonPreviewDeferred.resolve();

				// Then fetch happens
				dwellDeferred.resolve();

				return dwellPromise;
			} )
			.then( function () {
				var state = that.store.getState();
				assert.equal( state.preview.activeLink, 'element' );
			} );
	} );

}( mediaWiki, jQuery ) );
