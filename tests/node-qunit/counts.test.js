import * as counts from '../../src/counts';

QUnit.module( 'ext.popups/counts' );

QUnit.test( '#getEditCountBucket', ( assert ) => {
	const cases = [
		[ 0, '0 edits' ],
		[ 1, '1-4 edits' ],
		[ 2, '1-4 edits' ],
		[ 4, '1-4 edits' ],
		[ 5, '5-99 edits' ],
		[ 25, '5-99 edits' ],
		[ 50, '5-99 edits' ],
		[ 99, '5-99 edits' ],
		[ 100, '100-999 edits' ],
		[ 101, '100-999 edits' ],
		[ 500, '100-999 edits' ],
		[ 999, '100-999 edits' ],
		[ 1000, '1000+ edits' ],
		[ 1500, '1000+ edits' ]
	];

	assert.expect( cases.length );

	for ( let i = 0; i < cases.length; i++ ) {
		const count = cases[ i ][ 0 ];
		const bucket = counts.getEditCountBucket( count );
		assert.equal(
			bucket,
			cases[ i ][ 1 ],
			`Edit count bucket is "${ bucket }" when edit count is ${ count }.`
		);
	}
} );

QUnit.test( '#getPreviewCountBucket', ( assert ) => {
	const cases = [
		[ false, 'unknown' ],
		[ NaN, 'unknown' ],
		[ undefined, 'unknown' ],
		[ null, 'unknown' ],
		[ '', 'unknown' ],
		[ -1, 'unknown' ],
		[ 0, '0 previews' ],
		[ 1, '1-4 previews' ],
		[ 2, '1-4 previews' ],
		[ 4, '1-4 previews' ],
		[ 5, '5-20 previews' ],
		[ 10, '5-20 previews' ],
		[ 20, '5-20 previews' ],
		[ 21, '21+ previews' ],
		[ 100, '21+ previews' ],
		[ 1000, '21+ previews' ]
	];

	assert.expect( cases.length );

	for ( let i = 0; i < cases.length; i++ ) {
		const count = cases[ i ][ 0 ];
		const bucket = counts.getPreviewCountBucket( count );
		assert.equal(
			bucket,
			cases[ i ][ 1 ],
			`Preview count bucket is "${ bucket }" when preview count is ${ count }.`
		);
	}
} );
