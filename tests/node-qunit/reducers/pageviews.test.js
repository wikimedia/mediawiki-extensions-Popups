import pageviews from '../../../src/reducers/pageviews';

var PAGE_VIEW = {
	title: 'Bears',
	namespace: 0
};

QUnit.module( 'ext.popups/reducers#pageviews', {
	beforeEach: function () {
		this.initialState = pageviews( undefined, {
			type: '@@INIT'
		} );
	}
} );

QUnit.test( 'PREVIEW_SEEN', function ( assert ) {
	var action = {
		type: 'PREVIEW_SEEN',
		title: 'Bears',
		namespace: 0
	};

	assert.expect( 1 );

	assert.deepEqual(
		pageviews( this.initialState, action ),
		{
			pageview: PAGE_VIEW
		},
		'It should set a flag requesting a page view is recorded.'
	);
} );

QUnit.test( 'PAGEVIEW_LOGGED', function ( assert ) {
	var action = {
		type: 'PAGEVIEW_LOGGED'
	};

	assert.expect( 1 );

	assert.deepEqual(
		pageviews( { pageview: PAGE_VIEW }, action ),
		{
			pageview: undefined
		},
		'When complete it should remove the pageview record.'
	);
} );
