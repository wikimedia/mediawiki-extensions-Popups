import pageviews from '../../../src/changeListeners/pageviews';

const REFERRER = 'https://en.m.wikipedia.org/wiki/Kittens',
	page = {
		namespaceId: 1,
		id: 42,
		title: 'Kittens',
		url: REFERRER
	};

QUnit.module( 'ext.popups/pageviews', {
	beforeEach() {
		this.boundActions = {
			pageviewLogged: this.sandbox.spy()
		};

		this.pageviewTracker = this.sandbox.spy();
		this.changeListener = pageviews(
			this.boundActions,
			this.pageviewTracker
		);
	}
} );
function createState( title ) {
	return title ? {
		pageviews: {
			page,
			pageview: {
				page_title: title // eslint-disable-line camelcase
			}
		}
	} : {
		pageviews: {
			page,
			pageview: undefined
		}
	};
}

QUnit.test( 'it should log the queued event', function ( assert ) {
	const state = createState( 'Rainbows' );

	this.changeListener( undefined, state );

	assert.ok(
		this.pageviewTracker.calledWith(
			'event.VirtualPageView',
			{
				/* eslint-disable camelcase */
				page_title: 'Rainbows',
				source_url: REFERRER,
				source_page_id: 42,
				source_namespace: 1,
				source_title: 'Kittens'
				/* eslint-enable camelcase */
			}
		),
		'Event is logged with the current page context'
	);
	assert.ok(
		this.boundActions.pageviewLogged.called,
		'When logged an action is taken to unqueue the pageview'
	);
} );

QUnit.test( 'it should not log something that is not a pageview', function ( assert ) {
	const state = createState();

	this.changeListener( undefined, state );

	assert.notOk(
		this.pageviewTracker.called,
		'No pageview tracked'
	);
	assert.notOk(
		this.boundActions.pageviewLogged.called,
		'No action taken'
	);
} );
