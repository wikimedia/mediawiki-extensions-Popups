var counts = require( '../../../src/counts' ),
	createModel = require( '../../../src/preview/model' ).createModel,
	eventLogging = require( '../../../src/reducers/eventLogging' );

QUnit.module( 'ext.popups/reducers#eventLogging', {
	setup: function () {
		this.initialState = eventLogging( undefined, {
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
		expectedPreviewCountBucket,
		state;

	expectedEditCountBucket = counts.getEditCountBucket( action.user.editCount );
	expectedPreviewCountBucket = counts.getPreviewCountBucket( action.user.previewCount );

	state = eventLogging( this.initialState, action );

	assert.deepEqual(
		state,
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

	// ---

	// And when the user is logged out...
	action.user.isAnon = true;

	state = eventLogging( this.initialState, action );

	assert.strictEqual( state.baseData.isAnon, true );
	assert.strictEqual(
		state.baseData.editCountBucket,
		undefined,
		'It shouldn\'t add the editCountBucket property when the user is logged out.'
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
		eventLogging( state, action ),
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

	state = eventLogging( state, {
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

QUnit.module( 'ext.popups/reducers#eventLogging @integration', {
	setUp: function () {
		this.link = $( '<a>' );
	}
} );

QUnit.test( 'LINK_DWELL starts an interaction', function ( assert ) {
	var state,
		action;

	state = {
		interaction: undefined
	};

	action = {
		type: 'LINK_DWELL',
		el: this.link,
		token: '0987654321',
		timestamp: Date.now()
	};

	assert.deepEqual(
		eventLogging( state, action ),
		{
			interaction: {
				link: action.el,
				token: action.token,
				started: action.timestamp,

				isUserDwelling: true
			}
		}
	);
} );

QUnit.test( 'LINK_DWELL doesn\'t start a new interaction under certain conditions', function ( assert ) {
	var state,
		now = Date.now(),
		action;

	state = {
		interaction: undefined
	};

	action = {
		type: 'LINK_DWELL',
		el: this.link,
		token: '0987654321',
		timestamp: now
	};

	state = eventLogging( state, action );

	action.token = '1234567890';
	action.timestamp = now + 200;

	state = eventLogging( state, action );

	assert.deepEqual(
		state.interaction,
		{
			link: action.el,
			token: '0987654321',
			started: now,

			isUserDwelling: true
		}
	);
} );

QUnit.test( 'LINK_CLICK should enqueue an "opened" event', function ( assert ) {
	var state,
		now = Date.now();

	state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		token: '0987654321',
		timestamp: now
	} );

	state = eventLogging( state, {
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
		'The event is enqueued and the totalInteractionTime property is an integer.'
	);
} );

QUnit.test( 'PREVIEW_SHOW should update the perceived wait time of the interaction', function ( assert ) {
	var state,
		now = Date.now();

	state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		token: '0987654321',
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		timestamp: now + 500
	} );

	assert.deepEqual( state.interaction, {
		link: this.link,
		token: '0987654321',
		started: now,

		isUserDwelling: true,

		timeToPreviewShow: 500
	} );
} );

QUnit.test( 'FETCH_END', function ( assert ) {
	var model,
		state = {
			interaction: {}
		};

	model = createModel(
		'Foo',
		'https://en.wikipedia.org/wiki/Foo',
		'en',
		'ltr',
		'',
		{}
	);

	state = eventLogging( state, {
		type: 'FETCH_END',
		result: model
	} );

	assert.deepEqual(
		state,
		{
			interaction: {
				previewType: model.type
			}
		},
		'It mixes in the preview type to the interaction state.'
	);

	QUnit.test( 'ABANDON_START', function ( assert ) {
		var state = {
				interaction: {}
			};

		state = eventLogging( state, {
			type: 'ABANDON_START',
			timestamp: Date.now()
		} );

		assert.notOk(
			state.interaction.isUserDwelling,
			'It should mark the link or preview as having been abandoned.'
		);
	} );
} );

QUnit.test( 'ABANDON_END', function ( assert ) {
	var state,
		action;

	action = {
		type: 'LINK_DWELL',
		el: this.link,
		token: '1234567890'
	};

	state = eventLogging( state, action );

	action = {
		type: 'ABANDON_END',
		token: '1234567890'
	};

	assert.deepEqual(
		eventLogging( state, action ),
		state,
		'ABANDON_END should NOOP if the user is dwelling on the preview or the link.'
	);

	// ---

	action.token = '0987654321';

	assert.deepEqual(
		eventLogging( state, action ),
		state,
		'ABANDON_END should NOOP if the current interaction has changed.'
	);
} );

QUnit.test( 'PREVIEW_DWELL', function ( assert ) {
	var state = {
			interaction: {}
		};

	state = eventLogging( state, {
		type: 'PREVIEW_DWELL'
	} );

	assert.ok(
		state.interaction.isUserDwelling,
		'It should mark the link or preview as being dwelled on.'
	);
} );

QUnit.test( 'SETTINGS_SHOW should enqueue a "tapped settings cog" event', function ( assert ) {
	var state = {
		interaction: {}
	};

	state = eventLogging( state, {
		type: 'SETTINGS_SHOW'
	} );

	assert.deepEqual(
		state.event,
		{
			action: 'tapped settings cog'
		}
	);
} );

QUnit.test( 'ABANDON_END should enqueue an event', function ( assert ) {
	var dwelledState,
		token = '0987654321',
		now = Date.now(),
		state;

	dwelledState = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		token: token,
		timestamp: now
	} );

	state = eventLogging( dwelledState, {
		type: 'ABANDON_START',
		token: token,
		timestamp: now + 500
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token: token,
	} );

	assert.deepEqual(
		state.event,
		{
			linkInteractionToken: token,
			totalInteractionTime: 500,
			action: 'dwelledButAbandoned'
		},
		'It should enqueue a "dwelledButAbandoned" event when the preview hasn\'t been shown.'
	);

	// ---

	state = eventLogging( dwelledState, {
		type: 'PREVIEW_SHOW',
		timestamp: now + 700
	} );

	state = eventLogging( state, {
		type: 'ABANDON_START',
		token: token,
		timestamp: now + 850
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token: token,
	} );

	assert.deepEqual(
		state.event,
		{
			linkInteractionToken: token,
			totalInteractionTime: 850,
			action: 'dismissed',

			// N.B. that the FETCH_* actions have been skipped.
			previewType: undefined
		},
		'It should enqueue a "dismissed" event when the preview has been shown.'
	);
} );

QUnit.test( 'ABANDON_END doesn\'t enqueue an event under certain conditions', function ( assert ) {
	var dwelledState,
		state;

	dwelledState = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		token: '0987654321',
		timestamp: Date.now()
	} );

	state = eventLogging( dwelledState, {
		type: 'ABANDON_END',
		token: '1234567890'
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue an event if there\'s a new interaction.'
	);

	// ---

	state = eventLogging( dwelledState, {
		type: 'ABANDON_END',
		token: '0987654321'
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue an event if the use is dwelling on the preview or the link.'
	);
} );
