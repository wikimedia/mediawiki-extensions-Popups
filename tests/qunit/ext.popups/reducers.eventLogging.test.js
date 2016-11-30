( function ( mw ) {

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
			isUserInCondition: true,
			sessionToken: '0123456789',
			pageToken: '9876543210',
			page: {
				title: 'Foo',
				namespaceID: 1,
				id: 2
			},
			isUserAnon: true
		};

		assert.deepEqual(
			mw.popups.reducers.eventLogging( this.initialState, action ),
			{
				baseData: {
					pageTitleSource: action.page.title,
					namespaceIdSource: action.page.namespaceID,
					pageIdSource: action.page.id,
					isAnon: action.isUserAnon,
					popupEnabled: action.isUserInCondition,
					pageToken: action.pageToken,
					sessionToken: action.sessionToken
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
