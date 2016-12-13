( function ( mw, $ ) {

	/**
	 * Creates a render function that will create the settings dialog and return
	 * a set of methods to operate on it
	 */
	mw.popups.createSettingsDialogRenderer = function () {

		/**
		 * Cached settings dialog
		 *
		 * @type {jQuery}
		 */
		var $dialog,
			/**
			 * Cached settings overlay
			 *
			 * @type {jQuery}
			 */
			$overlay;

		/**
		 * Renders the relevant form and labels in the settings dialog
		 */
		return function ( boundActions ) {

			if ( !$dialog ) {
				$dialog = createSettingsDialog();
				$overlay = $( '<div>' ).addClass( 'mwe-popups-overlay' );

				// Setup event bindings

				$dialog.find( '.save' ).click( function () {
					// Find the selected value (simple|advanced|off)
					var selected = getSelectedSetting( $dialog ),
						// Only simple means enabled, advanced is disabled in favor of
						// NavPops and off means disabled.
						enabled = selected === 'simple';

					boundActions.saveSettings( enabled );
				} );
				$dialog.find( '.close, .okay' ).click( boundActions.hideSettings );
			}

			return {
				/**
				 * Append the dialog and overlay to a DOM element
				 * @param {HTMLElement} el
				 */
				appendTo: function ( el ) {
					$overlay.appendTo( el );
					$dialog.appendTo( el );
				},

				/**
				 * Show the settings element and position it correctly
				 */
				show: function () {
					var h = $( window ).height(),
						w = $( window ).width();

					$overlay.show();

					// FIXME: Should recalc on browser resize
					$dialog
						.show()
						.css( 'left', ( w - $dialog.outerWidth( true ) ) / 2 )
						.css( 'top', ( h - $dialog.outerHeight( true ) ) / 2 );
				},

				/**
				 * Hide the settings dialog.
				 */
				hide: function () {
					$overlay.hide();
					$dialog.hide();
				},

				/**
				 * Toggle the help dialog on or off
				 */
				toggleHelp: function ( visible ) {
					toggleHelp( $dialog, visible );
				}
			};
		};
	};

	/**
	 * Create the settings dialog
	 *
	 * @return {jQuery} settings dialog
	 */
	function createSettingsDialog() {
		var $el,
			path = mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/ext.popups/images/',
			choices = [
				{
					id: 'simple',
					name: mw.msg( 'popups-settings-option-simple' ),
					description: mw.msg( 'popups-settings-option-simple-description' ),
					image: path + 'hovercard.svg',
					isChecked: true
				},
				{
					id: 'advanced',
					name: mw.msg( 'popups-settings-option-advanced' ),
					description: mw.msg( 'popups-settings-option-advanced-description' ),
					image: path + 'navpop.svg'
				},
				{
					id: 'off',
					name: mw.msg( 'popups-settings-option-off' )
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
			heading: mw.msg( 'popups-settings-title' ),
			closeLabel: mw.msg( 'popups-settings-cancel' ),
			saveLabel: mw.msg( 'popups-settings-save' ),
			helpText: mw.msg( 'popups-settings-help' ),
			okLabel: mw.msg( 'popups-settings-help-ok' ),
			descriptionText: mw.msg( 'popups-settings-description' ),
			choices: choices
		} );

		return $el;
	}

	/**
	 * Get the selected value on the radio button
	 *
	 * @param {jQuery.Object} $el the element to extract the setting from
	 */
	function getSelectedSetting( $el ) {
		return $el.find(
			'input[name=mwe-popups-setting]:checked, #mwe-popups-settings'
		).val();
	}

	/**
	 * Toggles the visibility between a form and the help
	 * @param {jQuery.Object} $el element that contains form and help
	 * @param {Boolean} visible if the help should be visible, or the form
	 */
	function toggleHelp( $el, visible ) {
		var formSelectors = '#mwe-popups-settings-form, #mwe-popups-settings .save',
			helpSelectors = '#mwe-popups-settings-help, #mwe-popups-settings .okay';

		if ( visible ) {
			$( formSelectors ).hide();
			$( helpSelectors ).show();
		} else {
			$( formSelectors ).show();
			$( helpSelectors ).hide();
		}
	}

} )( mediaWiki, jQuery );
