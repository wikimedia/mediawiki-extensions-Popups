import * as formatter from '../../src/formatter';

QUnit.module( 'ext.popups.formatter', {
	beforeEach() {
		mw.util = {
			escapeRegExp: this.sandbox.spy( ( str ) => {
				return str.replace( /([\\{}()|.?*+\-^$[\]])/g, '\\$1' );
			} )
		};
	},
	afterEach() {
		mw.util = null;
	}
} );

QUnit.test( 'Title is bold', ( assert ) => {
	const cases = [
		[
			'Isaac Newton was born in', 'Isaac Newton',
			'<b>Isaac Newton</b> was born in',
			'Title as first word'
		],
		[
			'The C* language not to be confused with C# or C', 'C*',
			'The <b>C*</b> language not to be confused with C# or C',
			'Title containing *'
		],
		[
			'I like trains', 'Train',
			'I like <b>train</b>s',
			'Make the simple plural bold'
		],
		[
			'Foo\'s pub is a pub in Bar', 'Foo\'s pub',
			'<b>Foo\'s pub</b> is a pub in Bar',
			'Correct escaping'
		],
		[
			'"Heroes" is a David Bowie album', '"Heroes"',
			'<b>"Heroes"</b> is a David Bowie album',
			'Quotes in title'
		],
		[
			'*Testing if Things are correctly identified', 'Things',
			'*Testing if <b>Things</b> are correctly identified',
			'Article that begins with asterisk'
		],
		[
			'Testing if repeated words are not matched when repeated', 'Repeated',
			'Testing if <b>repeated</b> words are not matched when repeated',
			'Repeated title'
		]
	];

	function runTest( extract, title, expected, msg ) {
		const $div = $( '<div>' ).append(
			formatter.formatPlainTextExtract( extract, title )
		);
		assert.strictEqual( $div.html(), expected, msg );
	}

	cases.forEach( ( case_ ) => {
		runTest( case_[ 0 ], case_[ 1 ], case_[ 2 ], case_[ 3 ] );
	} );
} );
