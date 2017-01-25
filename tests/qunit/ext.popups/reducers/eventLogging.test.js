( function ( mw ) {

	var counts = mw.popups.counts;

	QUnit.module( 'ext.popups/reducers#eventLogging', {
		setup: function () {
			this.initialState = mw.popups.reducers.eventLogging( undefined, {
				type: '@@INIT'
			} );
		}
	} );

	QUnit.test( '@@INIT', function ( assert ) {
		assert.deepEqual(
			this.initialState,
			{
				previewCount: undefined,
				baseData: {},
				event: undefined,
				interaction: undefined
			}
		);
	} );

	QUnit.test( 'BOOT', function ( assert ) {
		var action = {
				type: 'BOOT',
				isEnabled: true,
				isNavPopupsEnabled: false,
				sessionToken: '0123456789',
				pageToken: '9876543210',
				page: {
					title: 'Foo',
					namespaceID: 1,
					id: 2
				},
				user: {
					isAnon: false,
					editCount: 11,
					previewCount: 22
				}
			},
			expectedEditCountBucket,
			expectedPreviewCountBucket;

		expectedEditCountBucket = counts.getEditCountBucket( action.user.editCount );
		expectedPreviewCountBucket = counts.getPreviewCountBucket( action.user.previewCount );

		assert.deepEqual(
			mw.popups.reducers.eventLogging( this.initialState, action ),
			{
				previewCount: action.user.previewCount,
				baseData: {
					pageTitleSource: action.page.title,
					namespaceIdSource: action.page.namespaceID,
					pageIdSource: action.page.id,
					isAnon: action.user.isAnon,
					popupEnabled: action.isEnabled,
					pageToken: action.pageToken,
					sessionToken: action.sessionToken,
					editCountBucket: expectedEditCountBucket,
					previewCountBucket: expectedPreviewCountBucket,
					hovercardsSuppressedByGadget: action.isNavPopupsEnabled
				},
				event: {
					action: 'pageLoaded'
				},
				interaction: undefined
			}
		);
	} );

	QUnit.test( 'EVENT_LOGGED', function ( assert ) {
		var state,
			action;

		state = {
			event: {}
		};

		action = {
			type: 'EVENT_LOGGED'
		};

		assert.deepEqual(
			mw.popups.reducers.eventLogging( state, action ),
			{
				event: undefined
			},
			'It dequeues any event queued for logging.'
		);
	} );

	QUnit.test( 'PREVIEW_SHOW', function ( assert ) {
		var state,
			count = 22,
			expectedCount = count + 1;

		state = {
			previewCount: count,
			baseData: {
				previewCountBucket: counts.getPreviewCountBucket( count )
			},
			event: undefined,

			// state.interaction.started is used in this part of the reducer.
			interaction: {}
		};

		state = mw.popups.reducers.eventLogging( state, {
			type: 'PREVIEW_SHOW'
		} );

		assert.equal(
			state.previewCount,
			expectedCount,
			'It updates the user\'s preview count.'
		);

		assert.deepEqual(
			state.baseData,
			{
				previewCountBucket: counts.getPreviewCountBucket( expectedCount )
			},
			'It re-buckets the user\'s preview count.'
		);
	} );

	QUnit.module( 'ext.popups/reducers#eventLogging @integration' );

	QUnit.test( 'LINK_DWELL starts an interaction', function ( assert ) {
		var state,
			action;

		state = {
			interaction: undefined
		};

		action = {
			type: 'LINK_DWELL',
			token: '0987654321',
			timestamp: mw.now()
		};

		assert.deepEqual(
			mw.popups.reducers.eventLogging( state, action ),
			{
				interaction: {
					token: action.token,
					started: action.timestamp
				}
			}
		);
	} );

	QUnit.test( 'LINK_CLICK should enqueue an "opened" event', function ( assert ) {
		var state,
			now = mw.now();

		state = {
			interaction: undefined
		};

		state = mw.popups.reducers.eventLogging( state, {
			type: 'LINK_DWELL',
			token: '0987654321',
			timestamp: now
		} );

		state = mw.popups.reducers.eventLogging( state, {
			type: 'LINK_CLICK',
			timestamp: now + 250.25
		} );

		assert.deepEqual(
			state.event,
			{
				action: 'opened',
				linkInteractionToken: '0987654321',
				totalInteractionTime: 250
			},
			'The event is enqueued and the totalInteractionProperty is an integer.'
		);
	} );

	QUnit.test( 'PREVIEW_SHOW should update the perceived wait time of the interaction', function ( assert ) {
		var state,
			now = mw.now();

		state = {
			interaction: undefined
		};

		state = mw.popups.reducers.eventLogging( state, {
			type: 'LINK_DWELL',
			token: '0987654321',
			timestamp: now
		} );

		state = mw.popups.reducers.eventLogging( state, {
			type: 'PREVIEW_SHOW',
			timestamp: now + 500
		} );

		assert.deepEqual( state.interaction, {
			token: '0987654321',
			started: now,
			timeToPreviewShow: 500
		} );
	} );

}( mediaWiki ) );
