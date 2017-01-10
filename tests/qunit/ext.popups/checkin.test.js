( function ( mw, $ ) {
	var pageVisibility = mw.popups.pageVisibility,
		checkin = mw.popups.checkin,
		// remember the original chechkin times
		CHECKIN_TIMES = checkin.CHECKIN_TIMES;

	QUnit.module( 'ext.popups/checkin', {
		setup: function () {
			checkin.CHECKIN_TIMES = CHECKIN_TIMES;
			checkin.haveCheckinActionsBeenSetup = false;
			this.CHECKIN_TIMES = [ 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233,
				377, 610, 987, 1597, 2584, 4181, 6765 ];

			this.clock = this.sandbox.useFakeTimers( 0, 'setTimeout', 'clearTimeout', 'Date' );
			// Stub performance.now to be Date.now to make timing work with the
			// sinon timers and with integers.
			performance && this.sandbox.stub( performance, 'now', Date.now );
			this.callback = this.sandbox.spy();
			this.delay = 5000;
			this.miniDelay = 10;
			this.pause = 2000;

			this.setupInitialState = function () {
				this.sandbox.stub( pageVisibility, 'getDocumentHiddenPropertyName' ).returns( 'customHidden' );
				this.sandbox.stub( pageVisibility, 'getDocumentVisibilitychangeEventName' ).returns( 'customvisibilitychange' );
				this.isDocumentHidden = this.sandbox.stub( pageVisibility, 'isDocumentHidden' ).returns( false );
			};

			this.setupPageHiddenState = function () {
				this.isDocumentHidden.returns( true );
				this.clock.tick( this.miniDelay );
			};

			this.setupPageVisibleState = function () {
				// resume after `pause` milliseconds
				this.isDocumentHidden.returns( false );
				this.clock.tick( this.pause );
			};
		},

		tearDown: function () {
			performance && performance.now.restore();
			this.clock.restore();
		}
	} );

	QUnit.test( 'checkin times are correct', function ( assert ) {
		assert.expect( 1 );
		assert.deepEqual( checkin.CHECKIN_TIMES, this.CHECKIN_TIMES );
	} );

	QUnit.test( 'visible timeout will not fire the callback if the' +
		' browser does not support the visibility API', function ( assert ) {
		this.sandbox.stub( pageVisibility, 'getDocumentHiddenPropertyName' ).returns( undefined );

		checkin.setVisibleTimeout( this.callback, 1000 );
		this.clock.tick( 1001 );

		assert.equal( this.callback.called, false, 'callback should not have been called' );
	} );

	QUnit.test( '#setVisibleTimeout calls callback if the page is visible', function ( assert ) {
		this.setupInitialState();
		checkin.setVisibleTimeout( this.callback, this.delay );
		this.clock.tick( this.delay + 1 );

		assert.ok( this.callback.calledOnce, 'callback should have been called' );
	} );

	QUnit.test( '#setVisibleTimeout does not call the callback if the page becomes hidden', function ( assert ) {
		this.setupInitialState();
		checkin.setVisibleTimeout( this.callback, this.delay );

		this.setupPageHiddenState();
		$( document ).trigger( 'customvisibilitychange' );

		this.clock.tick( this.delay + 1 );

		assert.notOk( this.callback.called, 'Callback should have not been called' );
	} );

	QUnit.test( '#setVisibleTimeout calls callback with the adjusted delay after the page becoming visible', function ( assert ) {
		this.setupInitialState();
		checkin.setVisibleTimeout( this.callback, this.delay );

		this.setupPageHiddenState();
		$( document ).trigger( 'customvisibilitychange' );

		this.setupPageVisibleState();
		$( document ).trigger( 'customvisibilitychange' );

		this.clock.tick( this.delay - this.miniDelay + 1 );

		assert.equal( this.callback.callCount, 1, 'callback should have been called' );
	} );

	QUnit.test( 'checkin actions will not be set up if they already have been', function ( assert ) {
		var spy = this.sandbox.spy( checkin, 'setVisibleTimeout' ),
			actionSpy = this.sandbox.spy();

		assert.expect( 1 );

		checkin.setupActions( actionSpy );
		checkin.setupActions( actionSpy );
		assert.strictEqual( spy.callCount, 1, 'setVisibleTimeout is only ever called once.' );
	} );

	QUnit.test( 'checkin actions are setup correctly', function ( assert ) {
		var actionSpy = this.sandbox.spy(),
			that = this;

		checkin.CHECKIN_TIMES = [ 1, 2, 3 ];

		checkin.setupActions( actionSpy );

		$.each( checkin.CHECKIN_TIMES, function ( i, time ) {
			that.clock.tick( time * 1000 + 1 );
		} );

		assert.equal( actionSpy.callCount, 3, 'Action called at the appropiate times' );
		assert.deepEqual( [
			actionSpy.getCall( 0 ).args[ 0 ],
			actionSpy.getCall( 1 ).args[ 0 ],
			actionSpy.getCall( 2 ).args[ 0 ]
		], [
			1, 2, 3
		], '`action` has been called the with the correct checkin times' );
	} );
}( mediaWiki, jQuery ) );
