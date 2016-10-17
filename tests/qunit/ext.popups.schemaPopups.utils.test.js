( function ( $, mw ) {
	var schemaPopups = mw.popups.schemaPopups;

	QUnit.module( 'ext.popups.schemaPopups.utils', {
		setup: function () {
			this.sandbox.stub( mw.popups, 'getPreviewCountBucket' ).returns(
				'5-20 previews'
			);
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

	QUnit.test( 'getMassagedData - dwell start time gets deleted', 2, function ( assert ) {
		var newData,
			initialData = { dwellStartTime: 1 };

		newData = schemaPopups.getMassagedData( initialData );
		assert.equal( newData.previewCountBucket, '5-20 previews' );
		assert.ok( newData.dwellStartTime === undefined );
	} );

	QUnit.test( 'getMassagedData - namespaceIdHover is added', 1, function ( assert ) {
		var newData,
			initialData = {
				pageTitleHover: 'Talk:Foo'
			};

		newData = schemaPopups.getMassagedData( initialData );
		assert.ok( newData.namespaceIdHover === 1, 'namespace is added based on title' );
	} );

	QUnit.test( 'getMassagedData - returns false if the data should not be logged due to being a duplicate', 3, function ( assert ) {
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

		assert.ok( schemaPopups.getMassagedData( thisEvent, previousEvent ) === false, 'duplicate events are ignored...' );
		assert.ok( schemaPopups.getMassagedData( settingsEvent, thisEvent ) !== false, '... unless disabled event' );
		assert.ok( thisEvent.dwellStartTime === 1, 'and no side effects' );
	} );

	QUnit.test( 'getMassagedData - returns false for hover and display events', 2, function ( assert ) {
		var
			hoverEvent = {
				action: 'hover'
			},
			displayEvent = {
				action: 'display',
				linkInteractionToken: 't'
			};

		assert.ok( schemaPopups.getMassagedData( hoverEvent ) === false );
		assert.ok( schemaPopups.getMassagedData( displayEvent ) === false );
	} );

} )( jQuery, mediaWiki );
