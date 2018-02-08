import pageviews from '../../../src/changeListeners/pageviews';

var REFERRER = 'https://en.m.wikipedia.org/wiki/Kittens';

QUnit.module( 'ext.popups/pageviews', {
	beforeEach: function () {
		this.boundActions = {
			pageViewLogged: this.sandbox.spy()
		};

		this.pageViewTracker = this.sandbox.spy();
		this.changeListener = pageviews(
			this.boundActions,
			this.pageViewTracker,
			REFERRER
		);
	}
} );

function createState( title ) {
	return title ? {
		pageviews: {
			pageview: {
				title: title
			}
		}
	} : {
		pageviews: {
			pageview: undefined
		}
	};
}

QUnit.test( 'it should log the queued event', function ( assert ) {
	var state = createState( 'Rainbows' );

	this.changeListener( undefined, state );

	assert.ok(
		this.pageViewTracker.calledWith(
			'event.VirtualPageView',
			{
				title: 'Rainbows',
				referrer: REFERRER
			}
		),
		'Event is logged verbatim'
	);
	assert.ok(
		this.boundActions.pageViewLogged.called,
		'When logged an action is taken to unqueue the page view'
	);
} );

QUnit.test( 'it should not log something that is not a pageview', function ( assert ) {
	var state = createState();

	this.changeListener( undefined, state );

	assert.notOk(
		this.pageViewTracker.called,
		'No page view tracked'
	);
	assert.notOk(
		this.boundActions.pageViewLogged.called,
		'No action taken'
	);
} );
