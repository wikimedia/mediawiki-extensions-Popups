( function ( mw, $ ) {

	// Since mw.popups.changeListeners.footerLink manipulates the DOM, this test
	// is, by necessity, an integration test.
	QUnit.module( 'ext.popups/changeListeners/footerLink @integration', {
		setup: function () {
			var that = this;

			that.$link = $( '<a>' )
				.attr( 'title', 'Foo' );

			that.linkTitleChangeListener = mw.popups.changeListeners.linkTitle();

			that.state = {
				preview: {
					activeLink: that.$link
				}
			};

			// A helper method, which should make the following tests more easily
			// readable.
			that.whenTheLinkIsDwelledUpon = function () {
				that.linkTitleChangeListener( undefined, that.state );
			};
		}
	} );

	QUnit.test( 'it should remove the title', function ( assert ) {
		assert.expect( 1 );

		this.whenTheLinkIsDwelledUpon();

		assert.strictEqual( this.$link.attr( 'title' ), '' );
	} );

	QUnit.test( 'it should restore the title', function ( assert ) {
		var nextState;

		assert.expect( 1 );

		this.whenTheLinkIsDwelledUpon();

		// Does the change listener guard against receiving many state tree updates
		// with the same activeLink property?
		nextState = $.extend( {}, this.state, {
			isDelayingFetch: false
		} );

		this.linkTitleChangeListener( this.state, nextState );

		this.state = nextState;

		nextState = $.extend( {}, this.state );
		delete nextState.preview.activeLink;

		this.linkTitleChangeListener( this.state, nextState );

		assert.strictEqual( this.$link.attr( 'title' ), 'Foo' );
	} );

}( mediaWiki, jQuery ) );
