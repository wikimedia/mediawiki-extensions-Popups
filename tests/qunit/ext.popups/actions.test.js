( function ( mw, $ ) {

	QUnit.module( 'ext.popups/actions' );

	QUnit.test( '#boot', function ( assert ) {
		var isUserInCondition = function () {
				return false;
			},
			sessionID = '0123456789',
			generateToken = function () {
				return '9876543210';
			};

		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.actions.boot( isUserInCondition, sessionID, generateToken ),
			{
				type: 'BOOT',
				isUserInCondition: false,
				sessionToken: '0123456789',
				pageToken: '9876543210'
			}
		);
	} );

	QUnit.module( 'ext.popups/actions#linkDwell @integration', {
		setup: function () {
			var that = this;

			that.el = $( '<a>' )
				.data( 'page-previews-title', 'Foo' )
				.eq( 0 );

			that.state = {};
			that.getState = function () {
				return that.state;
			};

			that.waitDeferred = $.Deferred();
			that.waitPromise = that.waitDeferred.promise();

			that.sandbox.stub( mw.popups, 'wait', function () {
				return that.waitPromise;
			} );
		}
	} );

	QUnit.test( '#linkDwell', function ( assert ) {
		var done = assert.async(),
			event = {},
			dispatch = this.sandbox.spy(),
			gatewayDeferred = $.Deferred(),
			gateway = function () {
				return gatewayDeferred;
			},
			fetchThunk,
			result = {};

		this.sandbox.stub( mw, 'now' ).returns( new Date() );

		mw.popups.actions.linkDwell( this.el, event, gateway )( dispatch, this.getState );

		assert.ok( dispatch.calledWith( {
			type: 'LINK_DWELL',
			el: this.el,
			event: event,
			interactionStarted: mw.now()
		} ) );

		// Stub the state tree being updated.
		this.state.preview = {
			activeLink: this.el
		};

		// ---

		this.waitPromise.then( function () {
			assert.strictEqual(
				dispatch.callCount,
				2,
				'The fetch action is dispatched after 500 ms'
			);

			fetchThunk = dispatch.secondCall.args[0];
			fetchThunk( dispatch );

			assert.ok( dispatch.calledWith( {
				type: 'FETCH_START',
				title: 'Foo'
			} ) );

			gatewayDeferred.resolve( result );

			assert.ok( dispatch.calledWith( {
				type: 'FETCH_END',
				result: result
			} ) );

			done();
		} );

		// After 500 ms...
		this.waitDeferred.resolve();
	} );

	QUnit.test( '#linkDwell doesn\'t dispatch the fetch action if the active link has changed', function ( assert ) {
		var done,
			dispatch = this.sandbox.spy();

		done = assert.async();

		mw.popups.actions.linkDwell( this.el /*, gateway */ )( dispatch, this.getState );

		this.state.preview = {
			activeLink: undefined // Any value other than this.el.
		};

		this.waitPromise.then( function () {
			assert.strictEqual( dispatch.callCount, 1 );

			done();
		} );

		// After 500 ms...
		this.waitDeferred.resolve();
	} );

}( mediaWiki, jQuery ) );
