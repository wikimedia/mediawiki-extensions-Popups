import footerLink from '../../../src/changeListeners/footerLink';

// Since footerLink manipulates the DOM, this test is, by necessity, an
// integration test.
QUnit.module( 'ext.popups/changeListeners/footerLink @integration', {
	beforeEach() {
		const boundActions = {};

		// Stub internal usage of mw.message
		mw.message = ( str ) =>
			( {
				text() { return str; }
			} );

		boundActions.showSettings = this.showSettingsSpy = this.sandbox.spy();

		this.$footer = $( '<ul>' )
			.attr( 'id', 'footer-places' )
			.appendTo( document.body );

		this.footerLinkChangeListener = footerLink( boundActions );

		// A helper method, which should make the following tests more easily
		// readable.
		this.whenLinkPreviewsBoots = function () {
			const newState = { settings: { shouldShowFooterLink: true } };
			this.footerLinkChangeListener( undefined, newState );
		};

		this.getLink = () => this.$footer.find( 'li:last-child' );
	},
	afterEach() {
		this.$footer.remove();
	}
} );

QUnit.test( 'it should append the link to the footer menu', function ( assert ) {
	this.whenLinkPreviewsBoots();

	const $link = this.getLink();

	assert.strictEqual( $link.length, 1, 'The link is singular.' );
	assert.strictEqual(
		$link.css( 'display' ),
		'list-item',
		'Creating the link and showing/hiding it aren\'t exclusive.'
	);
} );

QUnit.test( 'it should show and hide the link', function ( assert ) {
	this.whenLinkPreviewsBoots();

	const $link = this.getLink();

	assert.strictEqual(
		$link.css( 'display' ),
		'list-item',
		'Link is visible'
	);

	const oldState = { settings: { shouldShowFooterLink: true } },
		newState = { settings: { shouldShowFooterLink: false } };
	this.footerLinkChangeListener( oldState, newState );

	assert.strictEqual(
		$link.css( 'display' ),
		'none',
		'Link is NOT visible'
	);
} );

QUnit.test( 'it should call the showSettings bound action creator', function ( assert ) {
	this.whenLinkPreviewsBoots();

	const $link = this.getLink();
	$link.trigger( 'click' );

	assert.true( this.showSettingsSpy.called, 'Show settings is called.' );
} );
