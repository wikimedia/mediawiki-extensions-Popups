( function ( $, mw ) {
	QUnit.module( 'ext.popups.renderer.desktopRenderer', {
		setup: function () {
			mw.popups.$popup = $( '<div>' );
			mw.popups.render.cache[ '/wiki/Kittens' ] = {
				settings: {
					title: 'Kittens'
				},
				popup: $( '<div>hello</div>' ),
				getClasses: function () {
					return [ 'foo' ];
				},
				process: $.noop,
				getOffset: function () {
					return {};
				}
			};
		}
	} );

	QUnit.test( 'mw.popups.render.openPopup (T68496)', 1, function ( assert ) {
		mw.popups.render.openPopup( $( '<a href="/wiki/Kittens">' ) );
		mw.popups.render.openPopup( $( '<a href="/wiki/Kittens">' ) );
		assert.strictEqual( mw.popups.render.cache[ '/wiki/Kittens' ].popup.text(), 'hello' );
	} );

} )( jQuery, mediaWiki );
