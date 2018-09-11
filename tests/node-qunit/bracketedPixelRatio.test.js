import bracketedPixelRatio from '../../src/bracketedPixelRatio';

QUnit.module( 'ext.popups.bracketedPixelRatio' );

QUnit.test( 'returns a bracketed pixel ratio', ( assert ) => {
	const cases = [
		[ undefined, 1, 'when undefined returns 1' ],
		[ 0.75, 1, 'when 0.75 returns 1' ],
		[ 1, 1, 'when 1 returns 1' ],
		[ 1.25, 1.5, 'when 1.25 returns 1.5' ],
		[ 1.5, 1.5, 'when 1.5 returns 1.5' ],
		[ 1.75, 2, 'when 1.75 returns 2' ],
		[ 2, 2, 'when 2 returns 2' ],
		[ 2.2, 2, 'when 2.2 returns 2' ],
		[ 2.5, 2, 'when 2.5 returns 2' ],
		[ 2.75, 2, 'when 2.75 returns 2' ],
		[ 3, 2, 'when 3 returns 2' ]
	];

	function runTest( given, expected, msg ) {
		assert.strictEqual( bracketedPixelRatio( given ), expected, msg );
	}

	cases.forEach( ( case_ ) => {
		runTest( case_[ 0 ], case_[ 1 ], case_[ 2 ] );
	} );
} );
