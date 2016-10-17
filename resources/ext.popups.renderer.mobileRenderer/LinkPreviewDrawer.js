( function ( mw, M, $, OO ) {
	var Drawer = M.require( 'mobile.drawers/Drawer' ),
		Button = M.require( 'mobile.startup/Button' ),
		icons = M.require( 'mobile.startup/icons' );

	/**
	 * Drawer for the link preview feature on a mobile device
	 *
	 * @class LinkPreviewDrawer
	 * @extends Drawer
	 */
	function LinkPreviewDrawer() {
		Drawer.apply( this, arguments );
	}

	OO.mfExtend( LinkPreviewDrawer, Drawer, {
		/**
		 * @cfg {Object} defaults Default options hash.
		 * @cfg {string} defaults.spinner html of spinner icon
		 * @cfg {Object} defaults.continueButton HTML of the continue button.
		 */
		defaults: {
			spinner: icons.spinner().toHtmlString(),
			continueButton: new Button( {
				progressive: true,
				label: mw.msg( 'popups-mobile-continue-to-page' ),
				additionalClassNames: 'linkpreview-continue'
			} ).options,
			dismissButton: new Button( {
				label: mw.msg( 'popups-mobile-dismiss' ),
				additionalClassNames: 'linkpreview-dismiss'
			} ).options
		},

		/**
		 * @inheritdoc
		 */
		template: mw.template.get( 'ext.popups.renderer.mobileRenderer', 'LinkPreviewDrawer.hogan' ),

		/**
		 * @inheritdoc
		 */
		templatePartials: {
			Button: Button.prototype.template
		},

		/**
		 * @inheritdoc
		 */
		events: $.extend( {}, Drawer.prototype.events, {
			'click .linkpreview-continue, .linkpreview-title': 'onContinueClick',
			'click .linkpreview-dismiss': 'hide'
		} ),

		/**
		 * @inheritdoc
		 */
		className: 'drawer linkpreview',

		/**
		 * @inheritdoc
		 */
		closeOnScroll: false,

		/**
		 * Cache for the api queries.
		 *
		 * @property {Object}
		 */
		cache: {},

		/**
		 * @inheritdoc
		 */
		postRender: function () {
			var $linkpreviewOverlay;

			Drawer.prototype.postRender.apply( this, arguments );

			$linkpreviewOverlay = $( '<div>' )
				.addClass( 'linkpreview-overlay hidden' );
			this.$el.before( $linkpreviewOverlay );
			this.$linkpreview = this.$( '.linkpreview' );
			this.$spinner = this.$( '.spinner' );
		},

		/**
		 * @inheritdoc
		 */
		show: function () {
			$( '.linkpreview-overlay' ).removeClass( 'hidden' );
			Drawer.prototype.show.apply( this, arguments );
		},

		/**
		 * @inheritdoc
		 */
		hide: function () {
			Drawer.prototype.hide.apply( this, arguments );
			$( '.linkpreview-overlay' ).addClass( 'hidden' );
		},

		/**
		 * Show the drawer with the initial spinner (and hide the content,
		 * that was (maybe) already added.
		 *
		 * @return {Object} this
		 */
		showWithSpinner: function () {
			this.$spinner.removeClass( 'hidden' );
			this.$el.addClass( 'loading' );
			this.$linkpreview.addClass( 'hidden' );
			this.show();

			return this;
		},

		/**
		 * Hide the spinner (if any) and show the content of the drawer.
		 *
		 * @return {Object} this
		 */
		showContent: function () {
			this.$spinner.addClass( 'hidden' );
			this.$el.removeClass( 'loading' );
			this.$linkpreview.removeClass( 'hidden' );

			return this;
		},

		/**
		 * Load content from a given title, show it or redirect to this
		 * title if something went wrong.
		 *
		 * @param {string} title The target title
		 */
		loadNew: function ( title ) {
			var self = this;

			this.showWithSpinner();
			this.title = title;

			if ( !this.cache[ title ] ) {
				mw.popups.api.get( {
					action: 'query',
					titles: title,
					prop: 'extracts',
					explaintext: true,
					exintro: true,
					exchars: 140,
					formatversion: 2
				}, {
					headers: {
						'X-Analytics': 'preview=1'
					}
				} ).done( function ( result ) {
					var data;

					if ( result.query.pages[ 0 ] ) {
						data = result.query.pages[ 0 ];
						self
							.setTitle( data.title )
							.setContent( data.extract )
							.showContent();

						self.cache[ title ] = data;
					} else {
						self.onContinueClick();
					}
				} ).fail( function () {
					self.onContinueClick();
				} );
			} else {
				self
					.setTitle( this.cache[ title ].title )
					.setContent( this.cache[ title ].extract )
					.showContent();
			}
		},

		/**
		 * Replace the current visible title with the given one.
		 *
		 * @param {string} title The new title (HTML isn't supported)
		 * @return {Object} this
		 */
		setTitle: function ( title ) {
			this.$( '.linkpreview-title' ).text( title );

			return this;
		},

		/**
		 * Replace the current visible content with the given one.
		 *
		 * @param {string} content The new content (HTML isn't supported)
		 * @return {Object} this
		 */
		setContent: function ( content ) {
			this.$( '.linkpreview-content' ).text( content );

			return this;
		},

		/**
		 * Handle the click on the "continue to article" button and redirect to the
		 * title (this.title).
		 */
		onContinueClick: function () {
			window.location.href = mw.util.getUrl( this.title );
		}
	} );

	M.define( 'ext.popups.mobilelinkpreview/LinkPreviewDrawer', LinkPreviewDrawer );
}( mediaWiki, mediaWiki.mobileFrontend, jQuery, OO ) );
