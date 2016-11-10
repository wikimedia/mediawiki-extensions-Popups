( function ( mw ) {

	QUnit.module( 'ext.popups/reducers' );

	QUnit.test( '#rootReducer', function ( assert ) {
		var state = mw.popups.reducers.rootReducer( undefined, { type: '@@INIT' } );

		assert.expect( 1 );

		assert.deepEqual(
			state,
			{
				preview: {
					enabled: false,
					activeLink: undefined,
					previousActiveLink: undefined,
					interactionStarted: undefined,
					isDelayingFetch: false,
					isFetching: false,
					linkInteractionToken: undefined
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

	QUnit.test( '#model', function ( assert ) {
		var state = mw.popups.reducers.preview(
			{},
			{
				type: 'BOOT',
				isUserInCondition: true
			}
		);

		assert.expect( 1 );

		assert.ok(
			state.enabled,
			'It should set enabled to true when the user is in the enabled condition.'
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

