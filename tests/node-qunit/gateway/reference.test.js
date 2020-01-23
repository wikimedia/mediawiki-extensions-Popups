import { createStubTitle } from '../stubs';
import createReferenceGateway from '../../../src/gateway/reference';

QUnit.module( 'ext.popups/gateway/reference', {
	beforeEach() {
		mw.msg = ( key ) => `<${key}>`;

		this.$sourceElement = $( '<a>' ).appendTo(
			$( '<sup>' ).attr( 'id', 'cite_ref-1' ).appendTo( document.body )
		);

		this.$references = $( '<ul>' ).append(
			$( '<li>' ).attr( 'id', 'cite_note-1' ).append(
				$( '<span>' ).addClass( 'mw-reference-text' ).text( 'Footnote 1' )
			),
			$( '<li>' ).attr( 'id', 'cite_note-2' ).append(
				$( '<span>' ).addClass( 'reference-text' ).append(
					$( '<cite>' ).addClass( 'citation web unknown' ).text( 'Footnote 2' )
				)
			),
			$( '<li>' ).attr( 'id', 'cite_note-3' ).append(
				$( '<span>' ).addClass( 'reference-text' ).append(
					$( '<cite>' ).addClass( 'news' ).text( 'Footnote 3' ),
					$( '<cite>' ).addClass( 'news citation' ),
					$( '<cite>' ).addClass( 'citation' )
				)
			),
			$( '<li>' ).attr( 'id', 'cite_note-4' ).append(
				$( '<span>' ).addClass( 'reference-text' ).append(
					$( '<cite>' ).addClass( 'news' ).text( 'Footnote 4' ),
					$( '<cite>' ).addClass( 'web' )
				)
			)
		).appendTo( document.body );
	},
	afterEach() {
		mw.msg = null;

		this.$references.remove();
	}
} );

QUnit.test( 'Reference preview gateway returns the correct data', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note-1' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note-1',
				extract: 'Footnote 1',
				type: 'reference',
				referenceType: null,
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway accepts alternative text node class name', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note-2' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note-2',
				extract: '<cite class="citation web unknown">Footnote 2</cite>',
				type: 'reference',
				referenceType: 'web unknown',
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway accepts duplicated types', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note-3' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note-3',
				extract: '<cite class="news">Footnote 3</cite><cite class="news citation"></cite><cite class="citation"></cite>',
				type: 'reference',
				referenceType: 'news',
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway rejects conflicting types', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note-4' );

	return gateway.fetchPreviewForTitle( title ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note-4',
				extract: '<cite class="news">Footnote 4</cite><cite class="web"></cite>',
				type: 'reference',
				referenceType: null,
				sourceElementId: undefined
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway returns source element id', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note-1' );

	return gateway.fetchPreviewForTitle( title, this.$sourceElement[ 0 ] ).then( ( result ) => {
		assert.propEqual(
			result,
			{
				url: '#cite_note-1',
				extract: 'Footnote 1',
				type: 'reference',
				referenceType: null,
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
		title = createStubTitle( 1, 'Foo', 'cite note-1' ),
		promise = gateway.fetchPreviewForTitle( title );

	assert.strictEqual( typeof promise.abort, 'function' );
} );
