import selectInitialGateway from '../../../src/gateway/index';
import { createStubTitle } from '../stubs';
import { previewTypes } from '../../../src/preview/model';

QUnit.module( 'gateway/index.js', {
	beforeEach() {
		this.config = new Map(); /* global Map */
		this.config.set( 'wgPopupsReferencePreviews', true );
		this.config.set( 'wgPageName', 'Foo' );
		this.fragmentLink = createStubTitle( 1, 'Foo', 'Bar' );
		this.validEl = $( '<a>' ).appendTo( $( '<span>' ).addClass( 'reference' ) );
	}
} );

QUnit.test( 'it uses the reference gateway with wgPopupsReferencePreviews == true and valid element', function ( assert ) {
	assert.strictEqual(
		selectInitialGateway( this.validEl, this.config, this.fragmentLink ),
		previewTypes.TYPE_REFERENCE
	);
} );

QUnit.test( 'it uses the page gateway with wgPopupsReferencePreviews == false', function ( assert ) {
	this.config.set( 'wgPopupsReferencePreviews', false );

	assert.strictEqual(
		selectInitialGateway( this.validEl, this.config, this.fragmentLink ),
		previewTypes.TYPE_PAGE
	);
} );

QUnit.test( 'it uses the page gateway when on links to a different page', function ( assert ) {
	this.config.set( 'wgPageName', 'NotFoo' );

	assert.strictEqual(
		selectInitialGateway( this.validEl, this.config, this.fragmentLink ),
		previewTypes.TYPE_PAGE
	);
} );

QUnit.test( 'it uses the page gateway when there is no fragment', function ( assert ) {
	assert.strictEqual(
		selectInitialGateway(
			this.validEl,
			this.config,
			createStubTitle( 1, 'Foo' )
		),
		previewTypes.TYPE_PAGE
	);
} );

QUnit.test( 'it uses the page gateway for links not having a parent with reference class', function ( assert ) {
	const el = $( '<a>' ).appendTo( $( '<span>' ) );

	assert.strictEqual(
		selectInitialGateway( el, this.config, this.fragmentLink ),
		previewTypes.TYPE_PAGE
	);
} );
