var footerLink = require( '../../../src/changeListeners/footerLink' );

// Since footerLink manipulates the DOM, this test is, by necessity, an
// integration test.
QUnit.module( 'ext.popups/changeListeners/footerLink @integration', {
	beforeEach: function () {
		var boundActions = {};

		// Stub internal usage of mw.message
		mediaWiki.message = function ( str ) {
			return {
				text: function () { return str; }
			};
		};

		boundActions.showSettings = this.showSettingsSpy = this.sandbox.spy();

		this.$footer = $( '<ul>' )
			.attr( 'id', 'footer-places' )
			.appendTo( document.body );

		this.footerLinkChangeListener = footerLink( boundActions );

		this.state = {
			settings: {
				shouldShowFooterLink: true
			}
		};

		// A helper method, which should make the following tests more easily
		// readable.
		this.whenLinkPreviewsBoots = function () {
			this.footerLinkChangeListener( undefined, this.state );
		};

		this.getLink = function () {
			return this.$footer.find( 'li' );
		};
	},
	afterEach: function () {
		this.$footer.remove();
	}
} );

QUnit.test( 'it should append the link to the footer menu', function ( assert ) {
	var $link;

	assert.expect( 2 );

	this.whenLinkPreviewsBoots();

	$link = this.getLink();

	assert.strictEqual( $link.length, 1 );
	assert.equal(
		$link.css( 'display' ),
		'list-item',
		'Creating the link and showing/hiding it aren\'t exclusive.'
	);
} );

QUnit.test( 'it should show and hide the link', function ( assert ) {
	var $link,
		prevState;

	assert.expect( 2 );

	this.whenLinkPreviewsBoots();

	$link = this.getLink();

	assert.equal(
		$link.css( 'display' ),
		'list-item',
		'Link is visible'
	);

	// ---

	prevState = $.extend( true, {}, this.state );
	this.state.settings.shouldShowFooterLink = false;

	this.footerLinkChangeListener( prevState, this.state );

	assert.equal(
		$link.css( 'display' ),
		'none',
		'Link is NOT visible'
	);
} );

QUnit.test( 'it should call the showSettings bound action creator', function ( assert ) {
	var $link;

	assert.expect( 1 );

	this.whenLinkPreviewsBoots();

	$link = this.getLink();
	$link.click();

	assert.ok( this.showSettingsSpy.called );
} );
