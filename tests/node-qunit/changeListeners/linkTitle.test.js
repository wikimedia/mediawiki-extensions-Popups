import linkTitle from '../../../src/changeListeners/linkTitle';

QUnit.module( 'ext.popups/changeListeners/linkTitle', {
	beforeEach() {
		this.$link = $( '<a>' )
			.attr( 'title', 'Foo' );

		this.linkTitleChangeListener = linkTitle();

		this.state = {
			preview: {
				enabled: { page: true },
				activeLink: this.$link[ 0 ],
				previewType: 'page'
			}
		};

		// A helper method, which should make the following tests more easily
		// readable.
		this.whenTheLinkIsDwelledUpon = function () {
			this.linkTitleChangeListener( undefined, this.state );
		};
	}
} );

QUnit.test( 'it should remove the title', function ( assert ) {
	this.whenTheLinkIsDwelledUpon();

	assert.strictEqual( this.$link.attr( 'title' ), '', 'The title is removed.' );
} );

QUnit.test( 'it shouldn\'t remove the title under certain conditions', function ( assert ) {
	this.state.preview.enabled = { page: false };

	this.whenTheLinkIsDwelledUpon();

	assert.strictEqual(
		this.$link.attr( 'title' ),
		'Foo',
		'The title is not removed.'
	);
} );

QUnit.test( 'it should restore the title', function ( assert ) {
	this.whenTheLinkIsDwelledUpon();

	// Does the change listener guard against receiving many state tree updates
	// with the same activeLink property?
	let nextState = $.extend( true, {}, this.state );

	this.linkTitleChangeListener( this.state, nextState );

	this.state = nextState;

	nextState = $.extend( true, {}, this.state );
	delete nextState.preview.activeLink;

	this.linkTitleChangeListener( this.state, nextState );

	assert.strictEqual(
		this.$link.attr( 'title' ),
		'Foo',
		'The title is restored.'
	);
} );

QUnit.test( 'it should restore the title when the user dwells on another link immediately', function ( assert ) {
	const $anotherLink = $( '<a>' ).attr( 'title', 'Bar' );

	this.whenTheLinkIsDwelledUpon();

	let nextState = $.extend( true, {}, this.state, {
		preview: {
			activeLink: $anotherLink[ 0 ]
		}
	} );

	this.linkTitleChangeListener( this.state, nextState );

	assert.strictEqual( this.$link.attr( 'title' ), 'Foo', 'The title is set.' );
	assert.strictEqual(
		$anotherLink.attr( 'title' ),
		'',
		'The title is removed.'
	);

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
