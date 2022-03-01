import pageviews from '../../../src/changeListeners/pageviews';

const REFERRER = 'https://en.m.wikipedia.org/wiki/Kittens',
	newState = {
		pageviews: {
			page: {
				id: 42,
				namespaceId: 1,
				title: 'Kittens',
				url: REFERRER
			},
			pageview: {
				/* eslint-disable camelcase */
				page_id: 43,
				page_namespace: 1,
				page_title: 'Rainbows'
				/* eslint-enable camelcase */
			}
		}
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

		// Stub internal usage of mw.Title.newFromText
		mw.Title.newFromText = ( str ) => {
			return {
				getPrefixedDb: () => { return str; }
			};
		};
	}
} );

QUnit.test( 'it should log the queued event', function ( assert ) {
	this.changeListener( undefined, newState );

	assert.true(
		this.pageviewTracker.calledWith(
			'event.VirtualPageView',
			{
				/* eslint-disable camelcase */
				source_page_id: 42,
				source_namespace: 1,
				source_title: 'Kittens',
				source_url: REFERRER,
				page_id: 43,
				page_namespace: 1,
				page_title: 'Rainbows'
				/* eslint-enable camelcase */
			}
		),
		'Event is logged with the current page context'
	);
	assert.true(
		this.boundActions.pageviewLogged.called,
		'When logged an action is taken to unqueue the pageview'
	);
} );

QUnit.test( 'it should not log something that is not a pageview', function ( assert ) {
	const noPageviewState = $.extend( {}, newState );
	delete noPageviewState.pageviews.pageview;

	this.changeListener( undefined, newState );

	assert.false(
		this.pageviewTracker.called,
		'No pageview tracked'
	);
	assert.false(
		this.boundActions.pageviewLogged.called,
		'No action taken'
	);
} );
