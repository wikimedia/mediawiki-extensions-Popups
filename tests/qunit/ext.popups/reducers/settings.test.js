( function ( mw ) {

	QUnit.module( 'ext.popups/reducers#settings' );

	QUnit.test( '@@INIT', function ( assert ) {
		var state = mw.popups.reducers.settings( undefined, { type: '@@INIT' } );

		assert.deepEqual(
			state,
			{
				shouldShow: false
			}
		);
	} );

	QUnit.test( 'SETTINGS_SHOW', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.settings( {}, { type: 'SETTINGS_SHOW' } ),
			{
				shouldShow: true
			},
			'It should mark the settings dialog as ready to be shown.'
		);
	} );

	QUnit.test( 'SETTINGS_HIDE', function ( assert ) {
		assert.expect( 1 );

		assert.deepEqual(
			mw.popups.reducers.settings( {}, { type: 'SETTINGS_HIDE' } ),
			{
				shouldShow: false
			},
			'It should mark the settings dialog as ready to be closed.'
		);
	} );

}( mediaWiki ) );
