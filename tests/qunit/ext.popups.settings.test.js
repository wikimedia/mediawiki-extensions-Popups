// render, renderOption, and addFooterLink are already covered in the browser tests

( function ( $, mw ) {
	QUnit.module( 'ext.popups.settings' );

	QUnit.test( 'save', function ( assert ) {
		var jQueryInit = this.sandbox.stub( jQuery.fn, 'init' ),
			radioButtonValue;

		QUnit.expect( 2 );

		this.sandbox.stub( mw.popups.settings, 'reloadPage' );
		this.sandbox.stub( mw.popups.settings, 'close' );
		jQueryInit.withArgs( 'input[name=mwe-popups-setting]:checked', '#mwe-popups-settings' )
			.returns( {
				val: function () {
					return radioButtonValue;
				}
			} );
		jQueryInit.withArgs( '#mwe-popups-settings-form' )
			.returns( {
				hide: $.noop
			} );
		jQueryInit.withArgs( '#mwe-popups-settings-help' )
			.returns( {
				show: $.noop
			} );

		radioButtonValue = 'simple';
		mw.popups.settings.save();
		assert.equal(
			$.jStorage.get( 'mwe-popups-enabled' ),
			'true',
			'Popups are enabled when the `simple` radio button is checked.'
		);

		radioButtonValue = 'off';
		mw.popups.settings.save();
		assert.equal(
			$.jStorage.get( 'mwe-popups-enabled' ),
			'false',
			'Popups are disabled when the `off` radio button is checked.'
		);

		jQueryInit.restore();
		mw.popups.settings.reloadPage.restore();
		mw.popups.settings.close.restore();
	} );

	QUnit.test( 'open', function ( assert ) {
		QUnit.expect( 2 );

		mw.popups.settings.open();
		assert.equal(
			// 600 is defined in styles
			( $( window ).width() - 600 ) / 2 + 'px',
			mw.popups.settings.$element.css( 'left' ),
			'Settings dialog is horizontally aligned in the middle.'
		);
		assert.equal(
			( $( window ).height() - mw.popups.settings.$element.outerHeight( true ) ) / 2 + 'px',
			mw.popups.settings.$element.css( 'top' ),
			'Settings dialog is vertically aligned in the middle.'
		);
		mw.popups.settings.close();
	} );

	QUnit.test( 'close', function ( assert ) {
		QUnit.expect( 2 );

		mw.popups.settings.open();
		assert.equal(
			mw.popups.settings.$element.is( ':visible' ),
			true,
			'Settings dialog is visible when settings are opened.'
		);
		mw.popups.settings.close();
		assert.equal(
			mw.popups.settings.$element.is( ':visible' ),
			false,
			'Settings dialog is not visible when settings are closed.'
		);
	} );
} )( jQuery, mediaWiki );
