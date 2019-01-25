import { createStubTitle } from '../stubs';
import createReferenceGateway from '../../../src/gateway/reference';

QUnit.module( 'ext.popups/gateway/reference', {
	beforeEach() {
		mediaWiki.msg = ( key ) => `<${key}>`;

		this.$references = $( '<ul>' ).append(
			$( '<li id="cite_note--1">' ).append(
				$( '<span class="reference-text">' ).text( 'Footnote' )
			)
		).appendTo( document.body );
	},
	afterEach() {
		mediaWiki.msg = null;

		this.$references.remove();
	}
} );

QUnit.test( 'Reference preview gateway returns the correct data', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note--1' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note--1',
				extract: 'Footnote',
				type: 'reference'
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway rejects non-existing references', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'undefined' );

	return gateway.fetchPreviewForTitle( title ).then( () => {
		assert.ok( false, 'It should not resolve' );
	} ).catch( ( reason, result ) => {
		assert.propEqual( result, { textStatus: 'abort', xhr: { readyState: 0 } } );
	} );
} );

QUnit.test( 'Reference preview gateway is abortable', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note--1' ),
		promise = gateway.fetchPreviewForTitle( title );

	assert.strictEqual( typeof promise.abort, 'function' );
} );
