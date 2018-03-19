import pageviews from '../../../src/reducers/pageviews';

/* eslint-disable camelcase */
const PAGEVIEW = {
		page_title: 'Bears',
		page_id: 1,
		page_namespace: 0
	}, PAGE = {
		url: 'http://localhost:8888/w/index.php?title=Bird_like_dinosaur',
		title: 'Bird like dinosaur',
		namespaceId: 0,
		id: 673
	};

/* eslint-enable camelcase */

QUnit.module( 'ext.popups/reducers#pageviews', {
	beforeEach() {
		this.initialState = pageviews( undefined, {
			type: '@@INIT'
		} );
	}
} );

QUnit.test( 'BOOT', function ( assert ) {
	const action = {
		type: 'BOOT',
		page: PAGE
	};

	assert.deepEqual(
		pageviews( this.initialState, action ),
		{
			page: PAGE,
			pageview: undefined
		},
		'It should set the current page.'
	);
} );

QUnit.test( 'PREVIEW_SEEN', ( assert ) => {
	const action = {
		type: 'PREVIEW_SEEN',
		title: 'Bears',
		pageId: 1,
		namespace: 0
	};

	assert.expect( 1 );

	assert.deepEqual(
		pageviews( { page: PAGE }, action ),
		{
			page: PAGE,
			pageview: PAGEVIEW
		},
		'It should set a flag requesting a pageview is recorded.'
	);
} );

QUnit.test( 'PAGEVIEW_LOGGED', ( assert ) => {
	const action = {
		type: 'PAGEVIEW_LOGGED'
	};

	assert.expect( 1 );

	assert.deepEqual(
		pageviews( { pageview: PAGEVIEW, page: PAGE }, action ),
		{
			page: PAGE,
			pageview: undefined
		},
		'When complete it should remove the pageview record.'
	);
} );
