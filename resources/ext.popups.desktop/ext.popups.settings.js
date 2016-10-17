( function ( $, mw ) {

	var currentLinkLogData,
		/**
		 * @class mw.popups.settings
		 * @singleton
		 */
		settings = {};

	/**
	 * The settings' dialog's section element.
	 * Defined in settings.open
	 * @property $element
	 */
	settings.$element = null;

	/**
	 * Renders the relevant form and labels in the settings dialog
	 *
	 * @method render
	 */
	settings.render = function () {
		var path = mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/ext.popups.desktop/',
			choices = [
				{
					id: 'simple',
					name: mw.message( 'popups-settings-option-simple' ).text(),
					description: mw.message( 'popups-settings-option-simple-description' ).text(),
					image: path + 'images/hovercard.svg',
					isChecked: true
				},
				{
					id: 'advanced',
					name: mw.message( 'popups-settings-option-advanced' ).text(),
					description: mw.message( 'popups-settings-option-advanced-description' ).text(),
					image: path + 'images/navpop.svg'
				},
				{
					id: 'off',
					name: mw.message( 'popups-settings-option-off' ).text()
				}
			];

		// Check if NavigationPopups is enabled
		/*global pg: false*/
		if ( typeof pg === 'undefined' || pg.fn.disablePopups === undefined ) {
			// remove the advanced option
			choices.splice( 1, 1 );
		}

		// render the template
		settings.$element = mw.template.get( 'ext.popups.desktop', 'settings.mustache' ).render( {
			heading: mw.message( 'popups-settings-title' ).text(),
			closeLabel: mw.message( 'popups-settings-cancel' ).text(),
			saveLabel: mw.message( 'popups-settings-save' ).text(),
			helpText: mw.message( 'popups-settings-help' ).text(),
			okLabel: mw.message( 'popups-settings-help-ok' ).text(),
			descriptionText: mw.message( 'popups-settings-description' ).text(),
			choices: choices
		} );

		// setup event bindings
		settings.$element.find( '.save' ).click( settings.save );
		settings.$element.find( '.close' ).click( settings.close );
		settings.$element.find( '.okay' ).click( function () {
			settings.close();
			settings.reloadPage();
		} );

		$( 'body' ).append( settings.$element );
	};

	/**
	 * Save the setting to the device and close the dialog
	 *
	 * @method save
	 */
	settings.save = function () {
		var v =  $( 'input[name=mwe-popups-setting]:checked', '#mwe-popups-settings' ).val();
		if ( v === 'simple' ) {
			mw.popups.saveEnabledState( true );
			settings.reloadPage();
			settings.close();
		} else {
			mw.popups.saveEnabledState( false );
			$( '#mwe-popups-settings-form, #mwe-popups-settings .save' ).hide();
			$( '#mwe-popups-settings-help, #mwe-popups-settings .okay' ).show();
			mw.track( 'ext.popups.schemaPopups', $.extend( {}, currentLinkLogData, {
				action: 'disabled'
			} ) );
		}
	};

	/**
	 * Show the settings element and position it correctly
	 *
	 * @method open
	 * @param {Object} logData data to log
	 */
	settings.open = function ( logData ) {
		var
			h = $( window ).height(),
			w = $( window ).width();

		currentLinkLogData = logData;

		$( 'body' ).append( $( '<div>' ).addClass( 'mwe-popups-overlay' ) );

		if ( !settings.$element ) {
			settings.render();
		}

		// FIXME: Should recalc on browser resize
		settings.$element
			.show()
			.css( 'left', ( w - settings.$element.outerWidth( true ) ) / 2 )
			.css( 'top', ( h - settings.$element.outerHeight( true ) ) / 2 );

		return false;
	};

	/**
	 * Close the setting dialog and remove the overlay.
	 * If the close button is clicked on the help dialog
	 * save the setting and reload the page.
	 *
	 * @method close
	 */
	settings.close = function () {
		if ( $( '#mwe-popups-settings-help' ).is( ':visible' ) ) {
			settings.reloadPage();
		} else {
			$( '.mwe-popups-overlay' ).remove();
			settings.$element.hide();
		}
	};

	/**
	 * Adds a link to the footer to re-enable hovercards
	 *
	 * @method addFooterLink
	 */
	settings.addFooterLink = function () {
		var $setting, $footer;

		if ( mw.popups.enabled ) {
			return false;
		}

		$setting = $( '<li>' ).append(
			$( '<a>' )
				.attr( 'href', '#' )
				.text( mw.message( 'popups-settings-enable' ).text() )
				.click( function ( e ) {
					settings.open();
					e.preventDefault();
				} )
		);
		$footer = $( '#footer-places, #f-list' );

		// From https://en.wikipedia.org/wiki/MediaWiki:Gadget-ReferenceTooltips.js
		if ( $footer.length === 0 ) {
			$footer = $( '#footer li' ).parent();
		}
		$footer.append( $setting );
	};

	/**
	 * Wrapper around window.location.reload. Exposed for testing purposes only.
	 *
	 * @private
	 * @ignore
	 */
	settings.reloadPage = function () {
		location.reload();
	};

	$( function () {
		if ( !mw.popups.enabled ) {
			settings.addFooterLink();
		}
	} );

	mw.popups.settings = settings;

} )( jQuery, mediaWiki );
