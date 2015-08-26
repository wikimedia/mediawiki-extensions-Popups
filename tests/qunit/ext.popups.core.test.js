( function ( $, mw ) {

	QUnit.module( 'ext.popups.core', QUnit.newMwEnvironment( {
		config: {
			wgArticlePath: '/wiki/$1'
		}
	} ) );

	QUnit.test( 'getTitle', function ( assert ) {
		var cases, i, expected, actual;

		QUnit.expect( 11 );
		cases = [
			[ '/wiki/Foo', 'Foo' ],
			[ '/wiki/Foo#Bar', 'Foo' ],
			[ '/wiki/Foo?oldid=1', undefined ],
			[ '/wiki/%E6%B8%AC%E8%A9%A6', '測試' ],
			[ '/w/index.php?title=Foo', 'Foo' ],
			[ '/w/index.php?title=Foo#Bar', 'Foo' ],
			[ '/w/Foo?title=Foo&action=edit', undefined ],
			[ '/w/index.php?title=%E6%B8%AC%E8%A9%A6', '測試' ],
			[ '/w/index.php?oldid=1', undefined ],
			[ '/Foo', undefined ],
			/*jshint  -W107 */
			[ 'javascript:void(0);', undefined ]
			/*jshint +W107 */
		];

		for ( i = 0; i < cases.length; i++ ) {
			expected = cases[ i ][ 1 ];
			actual = mw.popups.getTitle( cases[ i ][ 0 ] );
			assert.equal( actual, expected );
		}
	} );

} )( jQuery, mediaWiki );
