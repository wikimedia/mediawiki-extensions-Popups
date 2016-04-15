( function ( $, mw ) {
	QUnit.module( 'ext.popups.logger' );

	QUnit.test( 'samplingRate', function ( assert ) {
		QUnit.expect( 1 );

		// make sure the sampling rate is not accidentally changed
		assert.equal( mw.popups.logger.samplingRate, 10 );
	} );

	QUnit.test( 'getAction', function ( assert ) {
		var i, expected, actual,
			// 0 - main button, 1 - middle button
			cases = [
				[ { button: 0 }, 'opened in same tab' ],
				[ { button: 0, ctrlKey: true }, 'opened in new tab' ],
				[ { button: 0, metaKey: true }, 'opened in new tab' ],
				[ { button: 0, ctrlKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, metaKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, ctrlKey: true, metaKey: true, shiftKey: true }, 'opened in new tab' ],
				[ { button: 0, shiftKey: true }, 'opened in new window' ],
				[ { button: 1 }, 'opened in new tab' ],
				[ { button: 1, shiftKey: true }, 'opened in new tab' ]
			];

		QUnit.expect( cases.length );

		for ( i = 0; i < cases.length; i++ ) {
			expected = cases[ i ][ 1 ];
			actual = mw.popups.logger.getAction( new MouseEvent( 'CustomEvent', cases[ i ][ 0 ] ) );
			assert.equal( actual, expected );
		}
	} );

	QUnit.module( 'ext.popups.logger (with EventLogging)', {
		setup: function () {
			this.eventLog = mw.eventLog;
			if ( !mw.eventLog ) {
				mw.eventLog = { logEvent: $.noop };
			}
			this.sandbox.stub( mw.eventLog, 'logEvent' );
			this.logData = {
				pageTitleHover: 'Main Page',
				pageTitleSource: 'Popups test page',
				popupEnabled: true,
				action: 'opened in same tab',
				time: new Date().getTime()
			};
		},
		teardown: function () {
			mw.eventLog.logEvent.restore();
			mw.eventLog = this.eventLog;
		}
	} );

	QUnit.test( 'log', function ( assert ) {
		QUnit.expect( 6 );

		// not sampled
		this.sandbox.stub( Math, 'random' ).returns( 1 );
		mw.popups.logger.log( $.extend( {}, this.logData ) ).done( function ( result ) {
			assert.equal(
				result,
				undefined,
				'Logger resolves with `undefined` when the page is not sampled.'
			);
		} );
		Math.random.restore();

		// Sampled
		this.sandbox.stub( Math, 'random' ).returns( 0 );
		mw.popups.logger.log( $.extend( {}, this.logData ) );
		assert.ok(
			mw.eventLog.logEvent.firstCall.args[ 1 ].hasOwnProperty( 'duration' ),
			'The `duration` property has been added when `time` is a number.'
		);
		assert.notOk(
			mw.eventLog.logEvent.firstCall.args[ 1 ].hasOwnProperty( 'time' ),
			'The `time` property has been removed when it is a number.'
		);

		delete this.logData.time;
		mw.popups.logger.log( this.logData );
		assert.notOk(
			mw.eventLog.logEvent.secondCall.args[ 1 ].hasOwnProperty( 'duration' ),
			'The `duration` property has not been added when `time` is `undefined`.'
		);

		this.logData.time = 'September, 2046';
		mw.popups.logger.log( this.logData );
		assert.notOk(
			mw.eventLog.logEvent.thirdCall.args[ 1 ].hasOwnProperty( 'duration' ),
			'The `duration` property has not been added when `time` is non-numeric.'
		);
		assert.ok(
			mw.eventLog.logEvent.thirdCall.args[ 1 ].hasOwnProperty( 'time' ),
			'The `time` property has not been removed when it is non-numeric.'
		);
		Math.random.restore();

	} );

	QUnit.module( 'ext.popups.logger (without EventLogging)', {
		setup: function () {
			this.eventLog = mw.eventLog;
			delete mw.eventLog;
			// make sure we're sampled
			this.sandbox.stub( Math, 'random' ).returns( 0 );
			this.logData = {
				pageTitleHover: 'Main Page',
				pageTitleSource: 'Popups test page',
				popupEnabled: true,
				action: 'opened in same tab',
				time: new Date().getTime()
			};
		},
		teardown: function () {
			mw.eventLog = this.eventLog;
			Math.random.restore();
		}
	} );
	QUnit.test( 'log', function ( assert ) {
		QUnit.expect( 1 );

		mw.popups.logger.log( this.logData ).done( function ( result ) {
			assert.equal(
				result,
				undefined,
				'Logger resolves with `undefined` when mw.eventLog is not available.'
			);
		} );
	} );
} )( jQuery, mediaWiki );
