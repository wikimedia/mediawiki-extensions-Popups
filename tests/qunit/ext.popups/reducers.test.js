( function ( mw, $ ) {

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
					activeEvent: undefined,
					interactionStarted: undefined
				},
				renderer: {
					isAnimating: false,
					isInteractive: false,
					showSettings: false
				}
			},
			'It should initialize the state by default'
		);
	} );

	QUnit.test( '#preview', function ( assert ) {
		var state = mw.popups.reducers.preview( undefined, { type: '@@INIT' } ),
			action;

		assert.expect( 2 );

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
				pageToken: '9876543210'
			},
			'It should set enabled and the session tokens on the BOOT action'
		);

		// ---
		action = {
			type: 'LINK_DWELL',
			el: $( '<a>' ),
			event: {},
			interactionStarted: mw.now(),
			linkInteractionToken: '0123456789'
		};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				activeLink: action.el,
				activeEvent: action.event,
				interactionStarted: action.interactionStarted,
				linkInteractionToken: action.linkInteractionToken
			},
			'It should set active link and event as well as interaction info on the LINK_DWELL action'
		);
	} );

	QUnit.test( '#renderer', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.renderer( {}, { type: 'PREVIEW_ANIMATING' } ),
			{
				isAnimating: true,
				isInteractive: false,
				showSettings: false
			},
			'It should set isAnimating to true on the PREVIEW_ANIMATING action'
		);
	} );
}( mediaWiki, jQuery ) );

