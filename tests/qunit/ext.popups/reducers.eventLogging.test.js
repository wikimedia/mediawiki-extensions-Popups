( function ( mw ) {

	var counts = mw.popups.counts;

	QUnit.module( 'ext.popups/reducers#eventLogging', {
		setup: function () {
			this.initialState = mw.popups.reducers.eventLogging( undefined, {
				type: '@@INIT'
			} );
		}
	} );

	QUnit.test( 'BOOT', function ( assert ) {
		var action = {
			type: 'BOOT',
			sessionToken: '0123456789',
			pageToken: '9876543210',
			page: {
				title: 'Foo',
				namespaceID: 1,
				id: 2
			},
			user: {
				isInCondition: true,
				isAnon: false,
				editCount: 11
			}
		};

		assert.deepEqual(
			mw.popups.reducers.eventLogging( this.initialState, action ),
			{
				baseData: {
					pageTitleSource: action.page.title,
					namespaceIdSource: action.page.namespaceID,
					pageIdSource: action.page.id,
					isAnon: action.user.isAnon,
					popupEnabled: action.user.isInCondition,
					pageToken: action.pageToken,
					sessionToken: action.sessionToken,
					editCountBucket: counts.getEditCountBucket( action.user.editCount )
				},
				event: {
					action: 'pageLoaded'
				}
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

}( mediaWiki ) );
