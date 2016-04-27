( function ( $, mw ) {

	/**
	 * @class mw.popups.settings
	 * @singleton
	 */
	var settings = {};

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
		var
			$closeIcon = $( '<a>' ).html( '&times;' ),
			$titleText = $( '<h1>' ).text( mw.message( 'popups-settings-title' ).text() ),
			$title = $( '<header>' ).append( $closeIcon, $titleText ),
			$description = $( '<p>' ).text( mw.message( 'popups-settings-description' ).text() ),
			$radioGroup = $( '<radiogroup>' ),
			$cancelButton = $( '<button>' )
				.addClass( 'mw-ui-button mw-ui-quiet' )
				.text( mw.message( 'popups-settings-cancel' ).text() )
				.attr( 'type', 'button' ),
			$saveButton = $( '<button>' )
				.addClass( 'mw-ui-button mw-ui-constructive' )
				.text( mw.message( 'popups-settings-save' ).text() )
				.attr( 'type', 'button' ),
			$actions = $( '<div>' )
				.addClass( 'mwe-popups-settings-actions' )
				.append( $cancelButton, $saveButton ),
			$okayButton = $( '<button>' )
				.addClass( 'mw-ui-button mw-ui-constructive' )
				.text( mw.message( 'popups-settings-help-ok' ).text() )
				.attr( 'type', 'button' ),
			$help = $( '<div>' )
				.attr( 'id', 'mwe-popups-settings-help' )
				.append(
					$( '<p>' ).text( mw.message( 'popups-settings-help' ).text() ),
					$( '<div>' ).addClass( 'mwe-popups-settings-help-image' ),
					$( '<div>' ).addClass( 'mwe-popups-settings-actions' ).append( $okayButton )
				)
				.hide(),
			$form = $( '<form>' ).append( $radioGroup, $actions ),
			$main = $( '<main>' ).attr( 'id', 'mwe-popups-settings-form' ).append( $description, $form ),
			options = {
				simple: [
					mw.message( 'popups-settings-option-simple' ).text(),
					mw.message( 'popups-settings-option-simple-description' ).text(),
					'images/hovercard.svg'
				],
				advanced: [
					mw.message( 'popups-settings-option-advanced' ).text(),
					mw.message( 'popups-settings-option-advanced-description' ).text(),
					'images/navpop.svg'
				],
				off: [
					mw.message( 'popups-settings-option-off' ).text(),
					mw.message( 'popups-settings-option-off-description' ).text()
				]
			};

		$( $closeIcon ).add( $cancelButton ).click( settings.close );
		$saveButton.click( settings.save );
		$okayButton.click( function () {
			settings.close();
			settings.reloadPage();
		} );

		$radioGroup.append( settings.renderOption( 'simple', options.simple, true ) );

		// Check if NavigationPopups is enabled
		/*global pg: false*/
		if ( typeof pg !== 'undefined' && pg.fn.disablePopups !== undefined ) {
			$radioGroup.append( settings.renderOption( 'advanced', options.advanced ) );
		}
		$radioGroup.append( settings.renderOption( 'off', options.off ) );

		settings.$element = $( '<section> ' ).attr( 'id', 'mwe-popups-settings' );
		settings.$element
			.hide()
			.append( $title, $main, $help );

		$( 'body' ).append( settings.$element );
	};

	/**
	 * Renders an option with its input[type='radio'], label and image
	 *
	 * @method renderOption
	 * @param {string} id
	 * @param {Array} content
	 * @param {boolean} checked
	 * @return {jQuery} The paragraph that holds the above mentioned elements
	 */
	settings.renderOption = function ( id, content, checked ) {
		var
			title = content[ 0 ].toLowerCase().split( ' ' ).join( '_' ),
			domId = 'mwe-popups-settings-' + title,
			$input = $( '<input>' )
				.attr( {
					name: 'mwe-popups-setting',
					value: id,
					type: 'radio',
					id: domId
				} ),
			$label = $( '<label>' )
				.attr( 'for', domId )
				.text( content[ 1 ] )
				.prepend( $( '<span>' ).text( content[ 0 ] ) ),
			$p = $( '<p>' ).append( $input, $label );

		if ( checked ) {
			$input.prop( 'checked', true );
		}

		if ( content.length === 3 ) {
			$p.append(
				$( '<img>' ).attr( 'src', mw.config.get( 'wgExtensionAssetsPath' ) + '/Popups/resources/' + content[ 2 ] )
			);
		}

		return $p;
	};

	/**
	 * Save the setting to localStorage (jStorage) and close the dialog
	 *
	 * @method save
	 */
	settings.save = function () {
		var v =  $( 'input[name=mwe-popups-setting]:checked', '#mwe-popups-settings' ).val();
		if ( v === 'simple' ) {
			$.jStorage.set( 'mwe-popups-enabled', 'true' );
			settings.reloadPage();
			settings.close();
		} else {
			$.jStorage.set( 'mwe-popups-enabled', 'false' );
			$( '#mwe-popups-settings-form' ).hide();
			$( '#mwe-popups-settings-help' ).show();
		}
	};

	/**
	 * Show the settings element and position it correctly
	 *
	 * @method open
	 */
	settings.open = function () {
		var
			h = $( window ).height(),
			w = $( window ).width();

		$( 'body' ).append( $( '<div>' ).addClass( 'mwe-popups-overlay' ) );

		if ( !settings.$element ) {
			settings.render();
		}

		settings.$element
			.show()
			.css( 'left', ( w - 600 ) / 2 )
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
