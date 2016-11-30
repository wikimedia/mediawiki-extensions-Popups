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
					activeLink: undefined,
					activeEvent: undefined,
					shouldShow: false,
					isUserDwelling: false
				},
				eventLogging: {
					baseData: {},
					event: undefined
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
			isUserInCondition: true
		};

		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				enabled: true
			},
			'It should set whether or not previews are enabled.'
		);
	} );

	QUnit.test( '#preview: LINK_DWELL', function ( assert ) {
		var action = {
			type: 'LINK_DWELL',
			el: this.el,
			event: {}
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				activeLink: action.el,
				activeEvent: action.event,
				shouldShow: false
			},
			'It should set active link and event as well as interaction info and hide the preview.'
		);
	} );

	QUnit.test( '#preview: LINK_ABANDON_END', function ( assert ) {
		var action = {
				type: 'LINK_ABANDON_END',
				el: this.el
			},
			state = {
				activeLink: this.el
			};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				activeLink: undefined,
				activeEvent: undefined,
				fetchResponse: undefined,
				shouldShow: false
			},
			'It should hide the preview and reset the interaction info.'
		);

		// ---

		state = {
			activeLink: this.el,
			isUserDwelling: true
		};

		assert.equal(
			mw.popups.reducers.preview( state, action ),
			state,
			'It should NOOP if the user is dwelling on the preview.'
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

	QUnit.test( '#preview: PREVIEW_DWELL', function ( assert ) {
		var action = {
			type: 'PREVIEW_DWELL'
		};

		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				isUserDwelling: true
			},
			'It should mark the preview as being dwelled on.'
		);
	} );

	QUnit.test( '#preview: PREVIEW_ABANDON_START', function ( assert ) {
		var action = {
			type: 'PREVIEW_ABANDON_START'
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				isUserDwelling: false
			},
			'It should mark the preview having been abandoned.'
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

