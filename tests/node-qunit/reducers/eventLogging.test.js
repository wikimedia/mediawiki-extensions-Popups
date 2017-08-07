import * as counts from '../../../src/counts';
import { createModel } from '../../../src/preview/model';
import eventLogging from '../../../src/reducers/eventLogging';

QUnit.module( 'ext.popups/reducers#eventLogging', {
	beforeEach: function () {
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
		type: 'EVENT_LOGGED',
		event: {}
	};

	assert.deepEqual(
		eventLogging( state, action ),
		{
			event: undefined
		},
		'It dequeues any event queued for logging.'
	);

	// ---

	state = {
		interaction: { token: 'asdf' },
		event: { linkInteractionToken: 'asdf' }
	};

	action = {
		type: 'EVENT_LOGGED',
		event: state.event
	};

	assert.deepEqual(
		eventLogging( state, action ),
		{
			event: undefined,
			interaction: undefined
		},
		'It destroys current interaction if an event for it was logged.'
	);

} );

QUnit.test( 'PREVIEW_SHOW', function ( assert ) {
	var state,
		count = 22,
		expectedCount = count + 1,
		token = '1234567890';

	state = {
		previewCount: count,
		baseData: {
			previewCountBucket: counts.getPreviewCountBucket( count )
		},
		event: undefined,

		// state.interaction.started is used in this part of the reducer.
		interaction: {
			token: token
		}
	};

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token: token
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
	beforeEach: function () {
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
		title: 'Foo',
		namespaceID: 1,
		token: '0987654321',
		timestamp: Date.now()
	};

	assert.deepEqual(
		eventLogging( state, action ),
		{
			interaction: {
				link: action.el,
				title: 'Foo',
				namespaceID: 1,
				token: action.token,
				started: action.timestamp,

				isUserDwelling: true
			},
			event: undefined
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
		title: 'Foo',
		namespaceID: 1,
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
			title: 'Foo',
			namespaceID: 1,
			token: '0987654321',
			started: now,

			isUserDwelling: true
		}
	);
} );

QUnit.test(
	'LINK_DWELL should enqueue a "dismissed" or "dwelledButAbandoned" event under certain conditions',
	function ( assert ) {
		var token = '0987654321',
			now = Date.now(),
			state;

		// Read: The user dwells on link A, abandons it, and dwells on link B fewer
		// than 300 ms after (before the ABANDON_END action is reduced).
		state = eventLogging( undefined, {
			type: 'LINK_DWELL',
			el: this.link,
			title: 'Foo',
			namespaceID: 1,
			token: token,
			timestamp: now
		} );

		state = eventLogging( state, {
			type: 'ABANDON_START',
			timestamp: now + 250
		} );

		state = eventLogging( state, {
			type: 'LINK_DWELL',
			el: $( '<a>' ),
			title: 'Bar',
			namespaceID: 1,
			token: '1234567890',
			timestamp: now + 500
		} );

		assert.deepEqual(
			state.event,
			{
				pageTitleHover: 'Foo',
				namespaceIdHover: 1,
				linkInteractionToken: '0987654321',
				totalInteractionTime: 250, // 250 - 0
				action: 'dwelledButAbandoned'
			}
		);

		// ---

		state = eventLogging( undefined, {
			type: 'LINK_DWELL',
			el: this.link,
			title: 'Foo',
			namespaceID: 1,
			token: token,
			timestamp: now
		} );

		state = eventLogging( state, {
			type: 'LINK_CLICK',
			el: this.link
		} );

		state = eventLogging( state, {
			type: 'LINK_DWELL',
			el: $( '<a>' ),
			title: 'Bar',
			namespaceID: 1,
			token: 'banana',
			timestamp: now + 500
		} );

		assert.strictEqual(
			state.event,
			undefined,
			'It shouldn\'t enqueue either event if the interaction is finalized.'
		);
	}
);

QUnit.test( 'LINK_CLICK should enqueue an "opened" event', function ( assert ) {
	var token = '0987654321',
		state,
		expectedState,
		now = Date.now();

	state = {
		interaction: undefined
	};

	expectedState = state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'LINK_CLICK',
		el: this.link,
		timestamp: now + 250
	} );

	assert.deepEqual(
		state.event,
		{
			action: 'opened',
			pageTitleHover: 'Foo',
			namespaceIdHover: 1,
			linkInteractionToken: token,
			totalInteractionTime: 250
		},
		'The event is enqueued and the totalInteractionTime property is an integer.'
	);

	expectedState.interaction.finalized = true;

	assert.deepEqual(
		state.interaction,
		expectedState.interaction,
		'It should finalize the interaction.'
	);
} );

QUnit.test( 'PREVIEW_SHOW should update the perceived wait time of the interaction', function ( assert ) {
	var state,
		now = Date.now(),
		token = '1234567890';

	state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token: token,
		timestamp: now + 500
	} );

	assert.deepEqual( state.interaction, {
		link: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		started: now,

		isUserDwelling: true,

		timeToPreviewShow: 500
	} );
} );

QUnit.test( 'LINK_CLICK should include perceivedWait if the preview has been shown', function ( assert ) {
	var token = '0987654321',
		state,
		now = Date.now();

	state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token: token,
		timestamp: now + 750
	} );

	state = eventLogging( state, {
		type: 'LINK_CLICK',
		el: this.link,
		timestamp: now + 1050
	} );

	assert.deepEqual(
		state.event,
		{
			action: 'opened',
			pageTitleHover: 'Foo',
			namespaceIdHover: 1,
			linkInteractionToken: token,
			totalInteractionTime: 1050,

			// N.B. that the FETCH_* actions have been skipped.
			previewType: undefined,
			perceivedWait: 750
		},
		'The prevewType and perceivedWait properties are set if the preview has been shown.'
	);
} );

QUnit.test( 'FETCH_COMPLETE', function ( assert ) {
	var model,
		token = '1234567890',
		initialState = {
			interaction: {
				token: token
			}
		},
		state;

	model = createModel(
		'Foo',
		'https://en.wikipedia.org/wiki/Foo',
		'en',
		'ltr',
		'',
		{}
	);

	state = eventLogging( initialState, {
		type: 'FETCH_COMPLETE',
		result: model,
		token: token
	} );

	assert.strictEqual(
		state.interaction.previewType,
		model.type,
		'It mixes in the preview type to the interaction state.'
	);

	// ---
	state = eventLogging( initialState, {
		type: 'FETCH_COMPLETE',
		result: model,
		token: 'banana'
	} );

	assert.strictEqual(
		initialState,
		state,
		'It should NOOP if there\'s a new interaction.'
	);

	// ---
	delete initialState.interaction;

	state = eventLogging( initialState, {
		type: 'FETCH_COMPLETE',
		result: model,
		token: '0123456789'
	} );

	assert.strictEqual(
		initialState,
		state,
		'It should NOOP if the interaction has been finalised.'
	);
} );

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

QUnit.test( 'ABANDON_END', function ( assert ) {
	var state,
		action;

	action = {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: '1234567890',
		timestamp: Date.now()
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
	var initialState = {
			interaction: {}
		},
		state,
		token = '0123456789';

	state = eventLogging( initialState, {
		type: 'SETTINGS_SHOW'
	} );

	// Note well that this is a valid event. The "tapped settings cog" event is
	// also logged as a result of clicking the footer link.
	assert.deepEqual(
		state.event,
		{
			action: 'tapped settings cog',
			linkInteractionToken: undefined,
			namespaceIdHover: undefined,
			pageTitleHover: undefined
		},
		'It shouldn\'t fail if there\'s no interaction.'
	);

	// ---

	state = eventLogging( initialState, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		timestamp: Date.now()
	} );

	state = eventLogging( state, {
		type: 'SETTINGS_SHOW'
	} );

	assert.deepEqual(
		state.event,
		{
			action: 'tapped settings cog',
			linkInteractionToken: token,
			namespaceIdHover: 1,
			pageTitleHover: 'Foo'
		},
		'It should include the interaction information if there\'s an interaction.'
	);
} );

QUnit.test( 'SETTINGS_CHANGE should enqueue disabled event', function ( assert ) {
	var state = eventLogging( undefined, {
		type: 'SETTINGS_CHANGE',
		wasEnabled: false,
		enabled: false
	} );

	assert.equal(
		state.event,
		undefined,
		'It shouldn\'t enqueue a "disabled" event when there is no change'
	);

	state = eventLogging( state, {
		type: 'SETTINGS_CHANGE',
		wasEnabled: true,
		enabled: false
	} );

	assert.deepEqual(
		state.event,
		{
			action: 'disabled',
			popupEnabled: false
		},
		'It should enqueue a "disabled" event when the previews has been disabled'
	);

	delete state.event;
	state = eventLogging( state, {
		type: 'SETTINGS_CHANGE',
		wasEnabled: false,
		enabled: true
	} );

	assert.equal(
		state.event,
		undefined,
		'It shouldn\'t enqueue a "disabled" event when page previews has been enabled'
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
		title: 'Foo',
		namespaceID: 1,
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
		token: token
	} );

	assert.deepEqual(
		state.event,
		{
			pageTitleHover: 'Foo',
			namespaceIdHover: 1,
			linkInteractionToken: token,
			totalInteractionTime: 500,
			action: 'dwelledButAbandoned'
		},
		'It should enqueue a "dwelledButAbandoned" event when the preview hasn\'t been shown.'
	);

	assert.strictEqual(
		state.interaction,
		undefined,
		'It should close the interaction.'
	);

	// ---

	state = eventLogging( dwelledState, {
		type: 'PREVIEW_SHOW',
		token: token,
		timestamp: now + 700
	} );

	state = eventLogging( state, {
		type: 'ABANDON_START',
		token: token,
		timestamp: now + 850
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token: token
	} );

	assert.deepEqual(
		state.event,
		{
			pageTitleHover: 'Foo',
			namespaceIdHover: 1,
			linkInteractionToken: token,
			totalInteractionTime: 850,
			action: 'dismissed',

			// N.B. that the FETCH_* actions have been skipped.
			previewType: undefined,

			perceivedWait: 700
		},
		'It should enqueue a "dismissed" event when the preview has been shown.'
	);
} );

QUnit.test( 'ABANDON_END doesn\'t enqueue an event under certain conditions', function ( assert ) {
	var token = '0987654321',
		now = Date.now(),
		dwelledState,
		state;

	dwelledState = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceID: 1,
		token: token,
		timestamp: now
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
		token: token
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue an event if the user is dwelling on the preview or the link.'
	);

	// ---

	state = eventLogging( dwelledState, {
		type: 'LINK_CLICK',
		timestamp: now + 500
	} );

	state = eventLogging( state, {
		type: 'EVENT_LOGGED',
		event: {}
	} );

	state = eventLogging( state, {
		type: 'ABANDON_START',
		token: token,
		timestamp: now + 700
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token: token,
		timestamp: now + 1000 // ABANDON_END_DELAY is 300 ms.
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue an event if the interaction is finalized.'
	);
} );
