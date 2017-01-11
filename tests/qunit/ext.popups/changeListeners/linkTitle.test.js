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
		nextState = $.extend( true, {}, this.state );

		this.linkTitleChangeListener( this.state, nextState );

		this.state = nextState;

		nextState = $.extend( true, {}, this.state );
		delete nextState.preview.activeLink;

		this.linkTitleChangeListener( this.state, nextState );

		assert.strictEqual( this.$link.attr( 'title' ), 'Foo' );
	} );

	QUnit.test( 'it should restore the title when the user dwells on another link immediately', function ( assert ) {
		var nextState,
			$anotherLink = $( '<a title="Bar">' );

		assert.expect( 3 );

		this.whenTheLinkIsDwelledUpon();

		nextState = $.extend( true, {}, this.state, {
			preview: {
				activeLink: $anotherLink
			}
		} );

		this.linkTitleChangeListener( this.state, nextState );

		assert.strictEqual( this.$link.attr( 'title' ), 'Foo' );
		assert.strictEqual( $anotherLink.attr( 'title' ), '' );

		// ---

		this.state = nextState;

		nextState = $.extend( true, {}, nextState );
		delete nextState.preview.activeLink;

		this.linkTitleChangeListener( this.state, nextState );

		assert.strictEqual(
			$anotherLink.attr( 'title' ),
			'Bar',
			'It should restore the title of the other link.'
		);
	} );

}( mediaWiki, jQuery ) );
