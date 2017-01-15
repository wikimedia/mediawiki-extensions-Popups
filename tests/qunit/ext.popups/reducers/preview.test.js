( function ( mw, $ ) {

	QUnit.module( 'ext.popups/reducers#preview', {
		setup: function () {
			this.el = $( '<a>' );
		}
	} );

	QUnit.test( '@@INIT', function ( assert ) {
		var state = mw.popups.reducers.preview( undefined, { type: '@@INIT' } );

		assert.expect( 1 );

		assert.deepEqual(
			state,
			{
				enabled: undefined,
				activeLink: undefined,
				activeEvent: undefined,
				activeToken: '',
				shouldShow: false,
				isUserDwelling: false
			}
		);
	} );

	QUnit.test( 'BOOT', function ( assert ) {
		var action = {
			type: 'BOOT',
			isEnabled: true
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

	QUnit.test( 'SETTINGS_CHANGE', function ( assert ) {
		var action = {
			type: 'SETTINGS_CHANGE',
			enabled: true
		};

		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				enabled: true
			},
			'It should set whether or not previews are enabled when settings change.'
		);
	} );

	QUnit.test( 'LINK_DWELL initializes the state for a new link', function ( assert ) {
		var action = {
			type: 'LINK_DWELL',
			el: this.el,
			event: {},
			token: '1234567890'
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				activeLink: action.el,
				activeEvent: action.event,
				activeToken: action.token,
				shouldShow: false,
				isUserDwelling: true
			},
			'It should set active link and event as well as interaction info and hide the preview.'
		);
	} );

	QUnit.test( 'LINK_DWELL on an active link only updates dwell state', function ( assert ) {
		var action = {
				type: 'LINK_DWELL',
				el: this.el,
				event: {},
				token: '1234567890'
			},
			state = {
				activeLink: this.el,
				isUserDwelling: false
			};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				activeLink: this.el,
				isUserDwelling: true
			},
			'It should only set isUserDwelling to true'
		);
	} );

	QUnit.test( 'ABANDON_END', function ( assert ) {
		var action = {
				type: 'ABANDON_END',
				token: 'bananas'
			},
			state = {
				activeToken: 'bananas',
				isUserDwelling: false
			};

		assert.deepEqual(
			mw.popups.reducers.preview( state, action ),
			{
				activeLink: undefined,
				activeToken: undefined,
				activeEvent: undefined,
				fetchResponse: undefined,
				isUserDwelling: false,
				shouldShow: false
			},
			'ABANDON_END should hide the preview and reset the interaction info.'
		);

		// ---

		state = {
			activeToken: 'apples',
			isUserDwelling: true
		};

		assert.equal(
			mw.popups.reducers.preview( state, action ),
			state,
			'ABANDON_END should NOOP if the current interaction has changed.'
		);

		// ---

		state = {
			activeToken: 'bananas',
			isUserDwelling: true
		};

		assert.equal(
			mw.popups.reducers.preview( state, action ),
			state,
			'ABANDON_END should NOOP if the user is dwelling on the preview.'
		);
	} );

	QUnit.test( 'FETCH_END', function ( assert ) {
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

	QUnit.test( 'PREVIEW_DWELL', function ( assert ) {
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

	QUnit.test( 'ABANDON_START', function ( assert ) {
		var action = {
			type: 'ABANDON_START'
		};

		assert.deepEqual(
			mw.popups.reducers.preview( {}, action ),
			{
				isUserDwelling: false
			},
			'ABANDON_START should mark the preview having been abandoned.'
		);
	} );

}( mediaWiki, jQuery ) );
