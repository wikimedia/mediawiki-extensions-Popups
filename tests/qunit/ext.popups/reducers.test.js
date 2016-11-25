( function ( mw, $ ) {

	QUnit.module( 'ext.popups/reducers', {
		setup: function () {
			this.el = $( '<a>' );
		}
	} );

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
					interactionStarted: undefined,
					shouldShow: false
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

	QUnit.test( '#preview: BOOT', function ( assert ) {
		var action = {
			type: 'BOOT',
			isUserInCondition: true,
			sessionToken: '0123456789',
			pageToken: '9876543210'
		};

		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				enabled: true,
				sessionToken: '0123456789',
				pageToken: '9876543210'
			},
			'It should set enabled and the session tokens.'
		);
	} );

	QUnit.test( '#preview: LINK_DWELL', function ( assert ) {
		var action = {
			type: 'LINK_DWELL',
			el: this.el,
			event: {},
			interactionStarted: mw.now(),
			linkInteractionToken: '0123456789'
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				activeLink: action.el,
				activeEvent: action.event,
				interactionStarted: action.interactionStarted,
				linkInteractionToken: action.linkInteractionToken
			},
			'It should set active link and event as well as interaction info.'
		);
	} );

	QUnit.test( '#preview: LINK_ABANDON', function ( assert ) {
		var action = {
			type: 'LINK_ABANDON',
			el: this.el
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				activeLink: undefined,
				activeEvent: undefined,
				interactionStarted: undefined,
				linkInteractionToken: undefined,
				fetchResponse: undefined,
				shouldShow: false
			},
			'It should hide the preview and reset the interaction info.'
		);
	} );

	QUnit.test( '#preview: FETCH_END', function ( assert ) {
		var state = {
				activeLink: this.el
			},
			action = {
				type: 'FETCH_END',
				el: this.el,
				result: {}
			};

		assert.expect( 2 );

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				activeLink: state.activeLink, // Previous state.

				fetchResponse: action.result,
				shouldShow: true
			},
			'It should store the result and signal that a preview should be rendered.'
		);

		// ---

		state = {
			activeLink: $( '<a>' )
		};
		action = {
			type: 'FETCH_END',
			el: this.el,
			result: {}
		};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			state,
			'It should NOOP if the user has interacted with another link since the request was dispatched via the gateway.'
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

