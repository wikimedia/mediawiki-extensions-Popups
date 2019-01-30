import { createStubTitle } from '../stubs';
import createReferenceGateway from '../../../src/gateway/reference';

QUnit.module( 'ext.popups/gateway/reference', {
	beforeEach() {
		mediaWiki.msg = ( key ) => `<${key}>`;
	},
	afterEach() {
		mediaWiki.msg = null;
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
				// FIXME: The test should be set up in a way so this contains something.
				extract: undefined,
				type: 'reference'
			}
		);
	} );
} );

QUnit.test( 'Reference preview gateway is abortable', function ( assert ) {
	const gateway = createReferenceGateway(),
		title = createStubTitle( 1, 'Foo', 'cite note--1' ),
		promise = gateway.fetchPreviewForTitle( title );

	assert.strictEqual( typeof promise.abort, 'function' );
} );
