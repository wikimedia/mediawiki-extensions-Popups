import registerChangeListener from '../../src/changeListener';

const stubStore = ( () => {
	let state;

	return {
		getState() {
			return state;
		},
		setState( value ) {
			state = value;
		}
	};
} )();

QUnit.module( 'ext.popups/changeListener' );

QUnit.test( 'it should only call the callback when the state has changed', function ( assert ) {
	const spy = this.sandbox.spy();
	let boundChangeListener;

	stubStore.subscribe = ( changeListener ) => {
		boundChangeListener = changeListener;
	};

	registerChangeListener( stubStore, spy );

	stubStore.setState( {} );

	if ( !boundChangeListener ) {
		assert.true( false, 'The change listener was not bound.' );
	}
	boundChangeListener();
	boundChangeListener();

	assert.strictEqual( spy.callCount, 1, 'The spy was called once.' );
	assert.true(
		spy.calledWith(
			undefined, // The initial internal state of the change listener.
			{}
		),
		'The spy was called with the correct arguments.'
	);

	stubStore.setState( {
		foo: 'bar'
	} );

	boundChangeListener();

	assert.strictEqual( spy.callCount, 2, 'The spy was called twice.' );
	assert.true(
		spy.calledWith(
			{},
			{
				foo: 'bar'
			}
		),
		'The spy was called with the correct arguments.'
	);
} );
