( function ( mw ) {

	QUnit.module( 'ext.popups/reducers' );

	QUnit.test( '#rootReducer', function ( assert ) {
		var state = mw.popups.reducers.rootReducer( undefined, { type: '@@INIT' } );

		assert.expect( 1 );

		assert.deepEqual(
			state,
			{
				preview: {
					enabled: undefined,
					sessionToken: undefined,
					pageToken: undefined,
					linkInteractionToken: undefined,
					activeLink: undefined,
					previousActiveLink: undefined,
					interactionStarted: undefined,
					isDelayingFetch: false,
					isFetching: false
				},
				renderer: {
					isAanimating: false,
					isInteractive: false,
					showSettings: false
				}
			},
			'It should initialize the state by default'
		);
	} );

	QUnit.test( '#model', 1, function ( assert ) {
		var state = mw.popups.reducers.preview( undefined, { type: '@@INIT' } ),
			action = {
				type: 'BOOT',
				isUserInCondition: true,
				sessionToken: '0123456789',
				pageToken: '9876543210'
			};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				enabled: true,
				sessionToken: '0123456789',
				pageToken: '9876543210',
				linkInteractionToken: undefined,
				activeLink: undefined,
				previousActiveLink: undefined,
				interactionStarted: undefined,
				isDelayingFetch: false,
				isFetching: false
			}
		);
	} );

	QUnit.test( '#renderer', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			// FIXME: There may be more to the action object when this action is implemented
			mw.popups.reducers.renderer( {}, { type: 'PREVIEW_ANIMATING' } ),
			{ isAnimating: true },
			'It should set isAnimating to true when the preview begins rendering.'
		);
	} );
}( mediaWiki ) );

