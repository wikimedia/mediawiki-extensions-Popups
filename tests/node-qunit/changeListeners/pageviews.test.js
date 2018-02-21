import pageviews from '../../../src/changeListeners/pageviews';

var REFERRER = 'https://en.m.wikipedia.org/wiki/Kittens';

QUnit.module( 'ext.popups/pageviews', {
	beforeEach: function () {
		this.boundActions = {
			pageviewLogged: this.sandbox.spy()
		};

		this.pageviewTracker = this.sandbox.spy();
		this.changeListener = pageviews(
			this.boundActions,
			this.pageviewTracker,
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
		this.pageviewTracker.calledWith(
			'event.VirtualPageView',
			{
				title: 'Rainbows',
				referrer: REFERRER
			}
		),
		'Event is logged verbatim'
	);
	assert.ok(
		this.boundActions.pageviewLogged.called,
		'When logged an action is taken to unqueue the pageview'
	);
} );

QUnit.test( 'it should not log something that is not a pageview', function ( assert ) {
	var state = createState();

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
