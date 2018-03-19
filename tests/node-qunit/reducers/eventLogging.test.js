import * as counts from '../../../src/counts';
import { createModel } from '../../../src/preview/model';
import eventLogging from '../../../src/reducers/eventLogging';

QUnit.module( 'ext.popups/reducers#eventLogging', {
	beforeEach() {
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
	const action = {
		type: 'BOOT',
		isEnabled: true,
		isNavPopupsEnabled: false,
		sessionToken: '0123456789',
		pageToken: '9876543210',
		page: {
			title: 'Foo',
			namespaceId: 1,
			id: 2
		},
		user: {
			isAnon: false,
			editCount: 11,
			previewCount: 22
		}
	};

	const expectedEditCountBucket =
		counts.getEditCountBucket( action.user.editCount );
	const expectedPreviewCountBucket =
		counts.getPreviewCountBucket( action.user.previewCount );

	let state = eventLogging( this.initialState, action );

	assert.deepEqual(
		state,
		{
			previewCount: action.user.previewCount,
			baseData: {
				pageTitleSource: action.page.title,
				namespaceIdSource: action.page.namespaceId,
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

QUnit.test( 'EVENT_LOGGED', ( assert ) => {
	let state = {
		event: {}
	};

	let action = {
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

QUnit.test( 'PREVIEW_SHOW', ( assert ) => {
	const count = 22,
		expectedCount = count + 1,
		token = '1234567890';

	let state = {
		previewCount: count,
		baseData: {
			previewCountBucket: counts.getPreviewCountBucket( count )
		},
		event: undefined,

		// state.interaction.started is used in this part of the reducer.
		interaction: {
			token
		}
	};

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token
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
	beforeEach() {
		this.link = $( '<a>' );
	}
} );

QUnit.test( 'LINK_DWELL starts an interaction', function ( assert ) {
	const state = {
		interaction: undefined
	};

	const action = {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token: '0987654321',
		timestamp: Date.now()
	};

	assert.deepEqual(
		eventLogging( state, action ),
		{
			interaction: {
				link: action.el,
				title: 'Foo',
				namespaceId: 1,
				token: action.token,
				started: action.timestamp,

				isUserDwelling: true
			},
			event: undefined
		}
	);
} );

QUnit.test( 'LINK_DWELL doesn\'t start a new interaction under certain conditions', function ( assert ) {
	const now = Date.now();

	let state = {
		interaction: undefined
	};

	const action = {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
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
			namespaceId: 1,
			token: '0987654321',
			started: now,

			isUserDwelling: true
		}
	);
} );

QUnit.test( 'LINK_DWELL should enqueue a "dismissed" or "dwelledButAbandoned" event under certain conditions', function ( assert ) {
	const token = '0987654321',
		now = Date.now();

	// Read: The user dwells on link A, abandons it, and dwells on link B fewer
	// than 300 ms after (before the ABANDON_END action is reduced).
	let state = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
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
		namespaceId: 1,
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
		namespaceId: 1,
		token,
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
		namespaceId: 1,
		token: 'banana',
		timestamp: now + 500
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue either event if the interaction is finalized.'
	);
} );

QUnit.test( 'LINK_CLICK should enqueue an "opened" event', function ( assert ) {
	const token = '0987654321',
		now = Date.now();

	let state = {
		interaction: undefined
	};

	const expectedState = state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
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
	const now = Date.now(),
		token = '1234567890';

	let state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token,
		timestamp: now + 500
	} );

	assert.deepEqual( state.interaction, {
		link: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
		started: now,

		isUserDwelling: true,

		timeToPreviewShow: 500
	} );
} );

QUnit.test( 'LINK_CLICK should include perceivedWait if the preview has been shown', function ( assert ) {
	const token = '0987654321',
		now = Date.now();

	let state = {
		interaction: undefined
	};

	state = eventLogging( state, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
		timestamp: now
	} );

	state = eventLogging( state, {
		type: 'PREVIEW_SHOW',
		token,
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

QUnit.test( 'FETCH_COMPLETE', ( assert ) => {
	const token = '1234567890',
		initialState = {
			interaction: {
				token
			}
		},
		model = createModel(
			'Foo',
			'https://en.wikipedia.org/wiki/Foo',
			'en',
			'ltr',
			'',
			{}
		);
	let state = eventLogging( initialState, {
		type: 'FETCH_COMPLETE',
		result: model,
		token
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
	let state = {
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
	let action = {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token: '1234567890',
		timestamp: Date.now()
	};

	const state = eventLogging( state, action );

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

QUnit.test( 'PREVIEW_DWELL', ( assert ) => {
	let state = {
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
	const initialState = {
			interaction: {}
		},
		token = '0123456789';

	let state = eventLogging( initialState, {
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
		namespaceId: 1,
		token,
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

QUnit.test( 'SETTINGS_CHANGE should enqueue disabled event', ( assert ) => {
	let state = eventLogging( undefined, {
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
	const token = '0987654321',
		now = Date.now();

	const dwelledState = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
		timestamp: now
	} );

	let state = eventLogging( dwelledState, {
		type: 'ABANDON_START',
		token,
		timestamp: now + 500
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token
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
		token,
		timestamp: now + 700
	} );

	state = eventLogging( state, {
		type: 'ABANDON_START',
		token,
		timestamp: now + 850
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token
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
	const token = '0987654321',
		now = Date.now();

	const dwelledState = eventLogging( undefined, {
		type: 'LINK_DWELL',
		el: this.link,
		title: 'Foo',
		namespaceId: 1,
		token,
		timestamp: now
	} );

	let state = eventLogging( dwelledState, {
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
		token
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
		token,
		timestamp: now + 700
	} );

	state = eventLogging( state, {
		type: 'ABANDON_END',
		token,
		timestamp: now + 1000 // ABANDON_END_DELAY is 300 ms.
	} );

	assert.strictEqual(
		state.event,
		undefined,
		'It shouldn\'t enqueue an event if the interaction is finalized.'
	);
} );
