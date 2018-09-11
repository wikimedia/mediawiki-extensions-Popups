import wait from '../../src/wait';

QUnit.module( 'ext.popups/wait' );

QUnit.test( 'it should resolve after waiting', function ( assert ) {
	const then = Date.now();
	return wait( 150 ).then( () => {
		assert.strictEqual(
			( Date.now() - then ) > 150,
			true,
			'It waits for the given duration'
		);
	} );
} );

QUnit.test( 'it should not catch after resolving', function ( assert ) {
	return wait( 0 ).catch( () => {
		assert.ok( false, 'It never calls a catchable after resolution' );
	} ).then( () => {
		assert.ok( true, 'It resolves' );
	} );
} );

QUnit.test( 'it should not resolve after aborting', function ( assert ) {
	const deferred = wait( 0 );

	const chain = deferred.then( () => {
		assert.ok( false, 'It never calls a thenable after rejection' );
	} ).catch( () => {
		assert.ok( true, 'It calls the catchable' );
	} );

	deferred.abort();

	return chain;
} );

QUnit.test( 'it should catch after resolving and aborting', function ( assert ) {
	const deferred = wait( 0 );

	const chain = deferred.catch( () => {
		assert.ok( true, 'It calls the catchable' );
	} );

	deferred.then( () => {
		assert.ok( true, 'It resolves' );
		deferred.abort();
	} );

	return chain;
} );
