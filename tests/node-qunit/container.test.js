import createContainer from '../../src/container';

QUnit.module( 'container', {
	beforeEach() {
		this.container = createContainer();
		this.factory = this.sandbox.stub();
	}
} );

QUnit.test( '#has', function ( assert ) {
	this.container.set( 'foo', this.factory );

	assert.ok( this.container.has( 'foo' ) );
} );

QUnit.test( '#get', function ( assert ) {
	const service = {};

	this.factory.returns( service );

	this.container.set( 'foo', this.factory );

	assert.strictEqual( service, this.container.get( 'foo' ) );
	assert.strictEqual(
		this.container,
		this.factory.getCall( 0 ).args[ 0 ]
	);

	// ---

	this.container.get( 'foo' );

	assert.ok(
		this.factory.calledOnce,
		'It should memoize the result of the factory.'
	);

	// ---

	assert.throws(
		() => { this.container.get( 'bar' ); },
		/The service "bar" hasn't been defined./
	);
} );

QUnit.test( '#get should handle values, not just functions', function ( assert ) {
	this.container.set( 'foo', 'bar' );

	assert.strictEqual( 'bar', this.container.get( 'foo' ) );
} );
