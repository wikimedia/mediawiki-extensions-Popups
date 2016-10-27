( function ( $, mw ) {
	var schemaPopups = mw.popups.schemaPopups;

	/**
	 * Simulates a test run of several events.
	 *
	 * @param {Array} actions list of event actions
	 * @param {Object} [additionalData] to log
	 * @return {Array|false} the result of the last event to be run.
	 */
	function runEventSequence( actions, additionalData ) {
		var previousEvent;

		$.each( actions, function ( i, action ) {
			previousEvent = schemaPopups.processHovercardEvent( $.extend( {
					action: action
				}, additionalData || {} ), previousEvent );
		} );
		return previousEvent;
	}

	QUnit.module( 'ext.popups.schemaPopups.utils', {
		setup: function () {
			var ts = 1477422540409;
			this.sandbox.stub( mw.popups, 'getPreviewCountBucket' ).returns(
				'5-20 previews'
			);
			this.sandbox.stub( mw, 'now' )
				.onFirstCall().returns( ts ) // hover
				.onSecondCall().returns( ts + 5000 )
				.onThirdCall().returns( ts + 15000 ) // sometimes second hover if dwelled but abandoned is end of first sequence
				.onCall( 3 ).returns( ts + 15000 + 200 ) // second hover
				.onCall( 4 ).returns( ts + 15000 + 200 + 500 )
				.onCall( 5 ).returns( ts + 15000 + 200 + 700 );
		}
	} );

	QUnit.test( 'getSamplingRate', function ( assert ) {
		var configStub = this.sandbox.stub( mw.config, 'get' )
				.withArgs( 'wgPopupsSchemaPopupsSamplingRate' ),
			isFunctionStub = this.sandbox.stub( $, 'isFunction' )
				.withArgs( navigator.sendBeacon ),
			mwUserSessionIdStub = this.sandbox.stub( mw.user, 'sessionId' );

		QUnit.expect( 9 );

		isFunctionStub.returns( false );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when `navigator.sendBeacon` is unavailable.' );

		isFunctionStub.returns( true );

		configStub.returns( null );
		mwUserSessionIdStub.returns( 'abc' );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when the `wgPopupsSchemaPopupsSamplingRate`' +
			' config variable is undefined and' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( null );
		mwUserSessionIdStub.returns( 'def' );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when the `wgPopupsSchemaPopupsSamplingRate`' +
			' config variable is undefined and' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 0 );
		mwUserSessionIdStub.returns( 'abc' );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when `wgPopupsSchemaPopupsSamplingRate = 0`' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 0 );
		mwUserSessionIdStub.returns( 'def' );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when `wgPopupsSchemaPopupsSamplingRate = 0`' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 1 );
		mwUserSessionIdStub.returns( 'abc' );
		assert.equal( schemaPopups.getSamplingRate(), 1,
			'Sampling rate is 1 when `wgPopupsSchemaPopupsSamplingRate = 1`' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 1 );
		mwUserSessionIdStub.returns( 'def' );
		assert.equal( schemaPopups.getSamplingRate(), 1,
			'Sampling rate is 1 when `wgPopupsSchemaPopupsSamplingRate = 1`' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 0.5 );
		mwUserSessionIdStub.returns( 'abc' );
		assert.equal( schemaPopups.getSamplingRate(), 1,
			'Sampling rate is 1 when `wgPopupsSchemaPopupsSamplingRate = 0.5` and' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );

		configStub.returns( 0.5 );
		mwUserSessionIdStub.returns( 'def' );
		assert.equal( schemaPopups.getSamplingRate(), 0,
			'Sampling rate is 0 when `wgPopupsSchemaPopupsSamplingRate = 0.5` and' +
			' `mw.user.sessionId() = ' + mw.user.sessionId() + '`.' );
	} );

	QUnit.test( 'getEditCountBucket', function ( assert ) {
		var i, bucket, editCount,
			cases = [
				[ 0, '0 edits' ],
				[ 1, '1-4 edits' ],
				[ 2, '1-4 edits' ],
				[ 4, '1-4 edits' ],
				[ 5, '5-99 edits' ],
				[ 25, '5-99 edits' ],
				[ 50, '5-99 edits' ],
				[ 99, '5-99 edits' ],
				[ 100, '100-999 edits' ],
				[ 101, '100-999 edits' ],
				[ 500, '100-999 edits' ],
				[ 999, '100-999 edits' ],
				[ 1000, '1000+ edits' ],
				[ 1500, '1000+ edits' ]
			];

		QUnit.expect( cases.length );

		for ( i = 0; i < cases.length; i++ ) {
			editCount = cases[ i ][ 0 ];
			bucket = schemaPopups.getEditCountBucket( editCount );
			assert.equal(
				bucket,
				cases[ i ][ 1 ],
				'Edit count bucket is "' + bucket + '" when edit count is ' +
					editCount + '.'
			);
		}
	} );

	QUnit.test( 'processHovercardEvent - dwell start time gets deleted', 2, function ( assert ) {
		var newData,
			initialData = {};

		newData = schemaPopups.processHovercardEvent( initialData );
		assert.equal( newData.previewCountBucket, '5-20 previews' );
		assert.ok( newData.dwellStartTime === undefined );
	} );

	QUnit.test( 'processHovercardEvent - namespaceIdHover is added', 1, function ( assert ) {
		var newData,
			initialData = {
				pageTitleHover: 'Talk:Foo'
			};

		newData = schemaPopups.processHovercardEvent( initialData );
		assert.ok( newData.namespaceIdHover === 1, 'namespace is added based on title' );
	} );

	QUnit.test( 'processHovercardEvent - returns false if the data should not be logged due to being a duplicate', 3, function ( assert ) {
		var
			thisEvent = {
				action: 'myevent',
				dwellStartTime: 1,
				linkInteractionToken: 't'
			},
			previousEvent = {
				action: 'myevent',
				linkInteractionToken: 't'
			},
			settingsEvent = {
				action: 'disabled',
				linkInteractionToken: 't'
			};

		assert.ok( schemaPopups.processHovercardEvent( thisEvent, previousEvent ) === false, 'duplicate events are ignored...' );
		assert.ok( schemaPopups.processHovercardEvent( settingsEvent, thisEvent ) !== false, '... unless disabled event' );
		assert.ok( thisEvent.dwellStartTime === 1, 'and no side effects' );
	} );

	QUnit.test( 'processHovercardEvent - returns false for hover and display events', 2, function ( assert ) {
		assert.ok( runEventSequence( [ 'hover' ] ) === false );
		assert.ok( runEventSequence( [ 'display' ] ) === false );
	} );

	QUnit.test( 'processHovercardEvent - check calculations of opened in new window', 1, function ( assert ) {
		var logData = runEventSequence( [ 'hover', 'display', 'opened in new window' ] );

		assert.ok( logData.totalInteractionTime === 15000 );
	} );

	QUnit.test( 'processHovercardEvent - check calculations of dwelledButAbandoned event', 2, function ( assert ) {
		var logData = runEventSequence( [ 'hover', 'dwelledButAbandoned' ] );
		assert.ok( logData.perceivedWait === undefined );
		assert.ok( logData.totalInteractionTime === 5000 );
	} );

	QUnit.test( 'processHovercardEvent - dwelledButAbandoned without hover', 1, function ( assert ) {
		var logData = runEventSequence( [ 'hover', 'dwelledButAbandoned', 'dwelledButAbandoned' ],
			{ linkInteractionToken: 'a' } );

		assert.ok( logData === false, 'if no interaction time reject it' );
	} );

	QUnit.test( 'processHovercardEvent - interaction time is reset on hover', 2, function ( assert ) {
		var logData = runEventSequence( [
			'hover', 'dwelledButAbandoned',
			'hover', 'display', 'opened in new window'
		] );

		assert.ok( logData.perceivedWait !== undefined );
		assert.ok( logData.totalInteractionTime === 700 );
	} );

	QUnit.test( 'processHovercardEvent - multiple dwelledButAbandoned ignored', 1, function ( assert ) {
		var logData = runEventSequence( [
			'hover', 'dwelledButAbandoned', 'dwelledButAbandoned'
		], {
			linkInteractionToken: 'a'
		} );

		assert.ok( logData === false, 'duplicate dwelledButAbandoned ignored' );
	} );

	QUnit.test( 'processHovercardEvent - no display event (opened in same tab)', 2, function ( assert ) {
		var logData = runEventSequence( [
			'hover', 'opened in same tab'
		] );

		assert.ok( logData.perceivedWait === undefined,
			'if no display event no perceived wait can be calculated' );
		assert.ok( logData.totalInteractionTime === 5000,
			'but totalInteractionTime can be calculated' );
	} );

	QUnit.test( 'processHovercardEvent - dwelledButAbandoned triggered if no link interaction token', 1, function ( assert ) {
		var logData = runEventSequence( [
			'hover', 'dwelledButAbandoned', 'dwelledButAbandoned'
		] );

		assert.ok( logData.totalInteractionTime === undefined,
			// is this correct behaviour? We may want to revisit this.
			'if no link interaction time the duplicate event is generated but has no total interaction time' );
	} );

	QUnit.test( 'processHovercardEvent - opened in same tab without a hover', 2, function ( assert ) {
		var logDataSequence = runEventSequence( [
			'opened in same tab'
		], {
			linkInteractionToken: 'a'
		} ),
		logDataSequenceTwo = runEventSequence( [
			'opened in same tab'
		] );

		assert.ok( logDataSequence.totalInteractionTime === undefined,
			'If a end lifecycle event occurs without a hover event occuring beforehand it generates an invalid event' );
		assert.ok( logDataSequenceTwo.totalInteractionTime === undefined,
			'If a end lifecycle event occurs without a hover event occuring beforehand it generates an invalid event' );
	} );

	QUnit.test( 'processHovercardEvent - dwell start time gets reset on dismissed events', 4, function ( assert ) {
		var logDataSequence = runEventSequence( [
			'hover', 'display', 'dismissed'
		], {
			linkInteractionToken: 'a'
		} ),
		logDataSequenceTwo = runEventSequence( [
			'hover', 'display', 'dismissed'
		], {
			linkInteractionToken: 'b'
		} );

		assert.ok( logDataSequence.totalInteractionTime === 15000  );
		assert.ok( logDataSequence.perceivedWait !== undefined  );
		assert.ok( logDataSequenceTwo.totalInteractionTime === 700,
			'The first interaction leads to the rest of the timer.' );
		assert.ok( logDataSequenceTwo.perceivedWait !== undefined  );
	} );

	QUnit.test( 'processHovercardEvent - perceivedWait should be set for "opened in" events', 2, function ( assert ) {
		var data = runEventSequence( [
			'hover',
			'display',
			'opened in same tab'
		] );

		assert.ok( data.perceivedWait !== undefined );

		data = runEventSequence( [
			'hover',
			'display',
			'opened in new tab'
		] );

		assert.ok( data.perceivedWait !== undefined );
	} );
} )( jQuery, mediaWiki );
