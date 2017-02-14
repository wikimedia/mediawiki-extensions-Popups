( function ( mw, $ ) {

	// Since mw.popups.changeListeners.footerLink manipulates the DOM, this test
	// is, by necessity, an integration test.
	QUnit.module( 'ext.popups/changeListeners/footerLink @integration', {
		setup: function () {
			var boundActions = {},
				that = this;

			boundActions.showSettings = that.showSettingsSpy = that.sandbox.spy();

			that.$footer = $( '<ul>' )
				.attr( 'id', 'footer-places' )
				.appendTo( document.body );

			that.footerLinkChangeListener =
				mw.popups.changeListeners.footerLink( boundActions );

			that.state = {
				settings: {
					shouldShowFooterLink: true
				}
			};

			// A helper method, which should make the following tests more easily
			// readable.
			that.whenLinkPreviewsBoots = function () {
				that.footerLinkChangeListener( undefined, that.state );
			};
		},
		teardown: function () {
			this.$footer.remove();
		}
	} );

	QUnit.test( 'it should append the link to the footer menu', function ( assert ) {
		var $link;

		assert.expect( 2 );

		this.whenLinkPreviewsBoots();

		$link = this.$footer.find( 'li a' );

		assert.strictEqual( $link.length, 1 );
		assert.ok(
			$link.is( ':visible' ),
			'Creating the link and showing/hiding it aren\'t exclusive.'
		);
	} );

	QUnit.test( 'it should show and hide the link', function ( assert ) {
		var $link,
			prevState;

		assert.expect( 2 );

		this.whenLinkPreviewsBoots();

		$link = this.$footer.find( 'li a' );

		assert.ok( $link.is( ':visible' ) );

		// ---

		prevState = $.extend( true, {}, this.state );
		this.state.settings.shouldShowFooterLink = false;

		this.footerLinkChangeListener( prevState, this.state );

		assert.notOk( $link.is( ':visible' ) );
	} );

	QUnit.test( 'it should call the showSettings bound action creator', function ( assert ) {
		var $link;

		assert.expect( 1 );

		this.whenLinkPreviewsBoots();

		$link = this.$footer.find( 'li a' );
		$link.click();

		assert.ok( this.showSettingsSpy.called );
	} );

}( mediaWiki, jQuery ) );
