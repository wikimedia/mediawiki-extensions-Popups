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
		}
	} );

	QUnit.test( 'checkin times are correct', function ( assert ) {
		assert.expect( 1 );
		assert.deepEqual( checkin.CHECKIN_TIMES, this.CHECKIN_TIMES );
	} );

	QUnit.test( 'visible timeout will not fire the callback if the' +
		' browser does not support the visibility API', function ( assert ) {
		var delay = 1000,
			spy = this.sandbox.spy(),
			done = assert.async();

		assert.expect( 1 );

		this.sandbox.stub( pageVisibility, 'getDocumentHiddenPropertyName' ).returns( undefined );

		checkin.setVisibleTimeout( spy, delay );
		setTimeout( function () {
			assert.ok( spy.notCalled );
			done();
		}, 2 * delay );  // wait a little more in case the the event loop is busy

	} );

	QUnit.test( 'visible timeout pause works correctly', function ( assert ) {
		var delay = 5000,
			pause = 2000,
			// error margin in milliseconds
			delta = 50,
			spy = this.sandbox.spy(),
			done = assert.async();

		assert.expect( 2 );

		this.sandbox.stub( pageVisibility, 'getDocumentHiddenPropertyName' ).returns( 'customHidden' );
		this.sandbox.stub( pageVisibility, 'getDocumentVisibilitychangeEventName' ).returns( 'customvisibilitychange' );

		checkin.setVisibleTimeout( spy, delay );

		// pause immediately, after making sure the document is hidden
		this.sandbox.stub( pageVisibility, 'isDocumentHidden' ).returns( true );
		$( document ).trigger( 'customvisibilitychange' );

		// resume after `pause` milliseconds
		pageVisibility.isDocumentHidden.restore();
		this.sandbox.stub( pageVisibility, 'isDocumentHidden' ).returns( false );
		setTimeout( function () {
			$( document ).trigger( 'customvisibilitychange' );
			pageVisibility.isDocumentHidden.restore();
		}, pause );

		setTimeout( function () {
			// make sure the spy is not called after `delay` as we've paused
			assert.ok( spy.notCalled );

			setTimeout( function () {
				// make sure the spy is called after `delay` + `pause` as we've resumed
				assert.ok( spy.called );
				done();
			}, pause + delta );
		}, delay + delta );

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
			done = assert.async();

		checkin.CHECKIN_TIMES = [ 1, 2, 3 ];

		assert.expect( checkin.CHECKIN_TIMES.length );

		checkin.setupActions( actionSpy );
		setTimeout( function () {
			$.each( checkin.CHECKIN_TIMES, function ( i, time ) {
				assert.ok( actionSpy.calledWith( time ),
						'`action` has been called the correct checkin time: ' + time + '.' );
			} );
			done();
		// give two more seconds to catch up
		}, ( checkin.CHECKIN_TIMES[ checkin.CHECKIN_TIMES.length - 1 ] + 2 ) * 1000 );
	} );
}( mediaWiki, jQuery ) );
