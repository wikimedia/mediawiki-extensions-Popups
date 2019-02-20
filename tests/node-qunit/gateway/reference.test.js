import { createStubTitle } from '../stubs';
import createReferenceGateway from '../../../src/gateway/reference';

QUnit.module( 'ext.popups/gateway/reference', {
	beforeEach() {
		mediaWiki.msg = ( key ) => `<${key}>`;

		this.$sourceElement = $( '<a>' ).appendTo(
			$( '<sup>' ).attr( 'id', 'cite_ref-1' ).appendTo( document.body )
		);

		this.$references = $( '<ul>' ).append(
			$( '<li>' ).attr( 'id', 'cite_note--1' ).append(
				$( '<span>' ).addClass( 'mw-reference-text' ).text( 'Footnote 1' )
			),
			$( '<li>' ).attr( 'id', 'cite_note--2' ).append(
				$( '<span>' ).addClass( 'reference-text' ).text( 'Footnote 2' )
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
				extract: 'Footnote 1',
				type: 'reference',
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway accepts alternative text node class name', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note--2' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note--2',
				extract: 'Footnote 2',
				type: 'reference',
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway returns source element id', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note--1' );

	return gateway.fetchPreviewForTitle( title, this.$sourceElement[ 0 ] ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note--1',
				extract: 'Footnote 1',
				type: 'reference',
				sourceElementId: 'cite_ref-1'
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
