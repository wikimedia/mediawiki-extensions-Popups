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

	assert.expect( 4 );

	stubStore.setState( {} );

	boundChangeListener();
	boundChangeListener();

	assert.strictEqual( spy.callCount, 1 );
	assert.ok( spy.calledWith(
		undefined, // The initial internal state of the change listener.
		{}
	) );

	stubStore.setState( {
		foo: 'bar'
	} );

	boundChangeListener();

	assert.strictEqual( spy.callCount, 2 );
	assert.ok( spy.calledWith(
		{},
		{
			foo: 'bar'
		}
	) );
} );
