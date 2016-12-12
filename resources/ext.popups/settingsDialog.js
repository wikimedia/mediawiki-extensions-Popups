( function ( $, mw ) {

	/**
	 * Cached settings dialog
	 *
	 * @type {jQuery}
	 */
	var $dialog;

	/**
	 * @class mw.popups.settings
	 * @singleton
	 */
	mw.popups.settings = {};

	/**
	 * Renders the relevant form and labels in the settings dialog
	 */
	mw.popups.settings.render = function ( boundActions ) {
		if ( !$dialog ) {
			$dialog = createSettingsDialog();
			$dialog.appendTo( document.body );

			// setup event bindings
			$dialog.find( '.save' ).click( function () {
				save( boundActions );
			} );
			// `.find` doesn't allow comma-separated selectors for some reason
			$dialog.find( '.close' ).click( boundActions.settingsDialogClosed );
			$dialog.find( '.okay' ).click( boundActions.settingsDialogClosed );
		}

		return {
			/**
			 * Show the settings dialog.
			 */
			show: function () {
				show( $dialog );
			},

			/**
			 * Hide the settings dialog.
			 */
			hide: function () {
				hide( $dialog );
			}
		};
	};

	/**
	 * Create the settings dialog to be stored in cache.
	 *
	 * @return {jQuery} settings dialog
	 */
	function createSettingsDialog() {
		var $el,
			path = mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/ext.popups/images/',
			choices = [
				{
					id: 'simple',
					name: mw.message( 'popups-settings-option-simple' ).text(),
					description: mw.message( 'popups-settings-option-simple-description' ).text(),
					image: path + 'hovercard.svg',
					isChecked: true
				},
				{
					id: 'advanced',
					name: mw.message( 'popups-settings-option-advanced' ).text(),
					description: mw.message( 'popups-settings-option-advanced-description' ).text(),
					image: path + 'navpop.svg'
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
		$el = mw.template.get( 'ext.popups', 'settings.mustache' ).render( {
			heading: mw.message( 'popups-settings-title' ).text(),
			closeLabel: mw.message( 'popups-settings-cancel' ).text(),
			saveLabel: mw.message( 'popups-settings-save' ).text(),
			helpText: mw.message( 'popups-settings-help' ).text(),
			okLabel: mw.message( 'popups-settings-help-ok' ).text(),
			descriptionText: mw.message( 'popups-settings-description' ).text(),
			choices: choices
		} );

		return $el;
	}

	/**
	 * Save the setting to the device and close the dialog
	 *
	 * @method save
	 */
	function save( boundActions ) {
		var v = $( 'input[name=mwe-popups-setting]:checked', '#mwe-popups-settings' ).val(),
			userSettings = mw.popups.createUserSettings( mw.storage, mw.user );

		if ( v === 'simple' ) {
			// Avoid a refresh if 'enabled' -> 'enabled'
			if ( !userSettings.getIsEnabled() ) {
				userSettings.setIsEnabled( true );
				reloadPage();
			}
			boundActions.settingsDialogClosed();
		} else {
			userSettings.setIsEnabled( false );
			$( '#mwe-popups-settings-form, #mwe-popups-settings .save' ).hide();
			$( '#mwe-popups-settings-help, #mwe-popups-settings .okay' ).show();
		}
	}

	/**
	 * Show the settings element and position it correctly
	 *
	 * @method open
	 */
	function show( $el ) {
		var h = $( window ).height(),
			w = $( window ).width();

		$( 'body' ).append( $( '<div>' ).addClass( 'mwe-popups-overlay' ) );

		// FIXME: Should recalc on browser resize
		$el
			.show()
			.css( 'left', ( w - $el.outerWidth( true ) ) / 2 )
			.css( 'top', ( h - $el.outerHeight( true ) ) / 2 );
	}

	/**
	 * Close the setting dialog and remove the overlay.
	 * If the close button is clicked on the help dialog
	 * save the setting and reload the page.
	 */
	function hide( $el ) {
		if ( $( '#mwe-popups-settings-help' ).is( ':visible' ) ) {
			reloadPage();
		} else {
			$( '.mwe-popups-overlay' ).remove();
			$el.hide();
		}
	}

	/**
	 * Wrapper around window.location.reload. Exposed for testing purposes only.
	 *
	 * @private
	 * @ignore
	 */
	function reloadPage() {
		location.reload();
	}

} )( jQuery, mediaWiki );
