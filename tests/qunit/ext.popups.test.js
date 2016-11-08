( function () {

	QUnit.module( 'ext.popups', QUnit.newMwEnvironment( {
		config: {
			wgArticlePath: '/wiki/$1'
		}
	} ) );

	QUnit.test( 'it should pass when true is true', function ( assert ) {
		QUnit.expect( 1 );
		assert.ok( true );
	} );
} )();
