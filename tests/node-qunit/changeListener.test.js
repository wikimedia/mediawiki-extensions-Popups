import registerChangeListener from '../../src/changeListener';

var stubStore = ( function () {
	var state;

	return {
		getState: function () {
			return state;
		},
		setState: function ( value ) {
			state = value;
		}
	};
}() );

QUnit.module( 'ext.popups/changeListener' );

QUnit.test( 'it should only call the callback when the state has changed', function ( assert ) {
	var spy = this.sandbox.spy(),
		boundChangeListener;

	stubStore.subscribe = function ( changeListener ) {
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
