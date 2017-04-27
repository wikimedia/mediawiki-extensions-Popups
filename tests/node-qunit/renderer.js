var renderer = require( '../../src/renderer' );

QUnit.module( 'ext.popups#renderer', {} );

QUnit.test( 'getClosestYPosition', function ( assert ) {
	assert.equal( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	] ), 119, 'Correct lower Y.' );

	assert.equal( renderer.getClosestYPosition( 100, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	], true ), 99, 'Correct upper Y.' );

	assert.equal( renderer.getClosestYPosition( 135, [
		{
			top: 99,
			bottom: 119
		},
		{
			top: 120,
			bottom: 140
		}
	], true ), 120, 'Correct upper Y 2.' );
} );
