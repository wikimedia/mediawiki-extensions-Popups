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
	const gateway = createReferenceGateway();

	return gateway.fetchPreviewForTitle( createStubTitle( 1, '', 'cite_note--1' ) ).then( ( result ) => {
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
		promise = gateway.fetchPreviewForTitle( createStubTitle( 1, '' ) );

	assert.strictEqual( typeof promise.abort, 'function' );
} );
