import nextState from '../../../src/reducers/nextState';

QUnit.module( 'reducers/nextState' );

QUnit.test( 'with scalar values', ( assert ) => {
	const tests = [
		{
			before: {},
			updates: {},
			after: {}
		},
		{
			before: { unchanged: true, changed: false },
			updates: { new: true, changed: true },
			after: { unchanged: true, changed: true, new: true }
		},
		{
			before: { a: { b: { unchanged: true, changed: false } } },
			updates: { a: { b: { new: true, changed: true } } },
			after: { a: { b: { unchanged: true, changed: true, new: true } } }
		}
	];
	for ( const i in tests ) {
		const test = tests[ i ];
		assert.deepEqual(
			nextState( test.before, test.updates ),
			test.after,
			'Test case #' + i
		);
	}
} );

QUnit.test( 'original state object should not change', ( assert ) => {
	const state = {},
		after = nextState( state, { changed: true } );
	assert.deepEqual(
		state,
		{},
		'original state is unchanged'
	);
	assert.deepEqual(
		after,
		{ changed: true },
		'new state is different'
	);
} );

QUnit.test( 'Element instances should not be cloned', ( assert ) => {
	const element = document.createElement( 'a' ),
		newElement = document.createElement( 'b' ),
		state = { element },
		after = nextState( state, { element: newElement } );
	assert.strictEqual(
		state.element, element,
		'original state is unchanged'
	);
	assert.strictEqual(
		after.element, newElement,
		'Element instance was not cloned'
	);
} );
