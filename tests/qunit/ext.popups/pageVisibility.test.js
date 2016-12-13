( function ( mw, $ ) {
	var pageVisibility = mw.popups.pageVisibility;

	QUnit.module( 'ext.popups/pageVisibility', {
		setup: function () {
			pageVisibility.documentHiddenPropertyName = null;
			pageVisibility.documentVisibilityChangeEventName = null;
		}
	} );

	QUnit.test( 'browser specific `document.hidden` property name is correctly detected', function ( assert ) {
		var testCases = [
			[ { hidden: false }, 'hidden' ],
			[ { mozHidden: false }, 'mozHidden' ],
			[ { msHidden: false }, 'msHidden' ],
			[ { webkitHidden: false }, 'webkitHidden' ],
			[ { unsupportedHidden: false }, undefined ],
			[ {}, undefined ]
		];

		assert.expect( testCases.length );

		$.each( testCases, function ( i, testCase ) {
			// clear the cache so we get a fresh result
			pageVisibility.documentHiddenPropertyName = null;
			assert.equal(
				pageVisibility.getDocumentHiddenPropertyName( testCase[ 0 ] ), testCase[ 1 ] );
		} );
	} );

	QUnit.test( 'browser specific `document.visibilitychange` event name is correctly detected', function ( assert ) {
		var testCases = [
			[ { hidden: false }, 'visibilitychange' ],
			[ { mozHidden: false }, 'mozvisibilitychange' ],
			[ { msHidden: false }, 'msvisibilitychange' ],
			[ { webkitHidden: false }, 'webkitvisibilitychange' ],
			[ { unsupportedHidden: false }, undefined ],
			[ {}, undefined ]
		];

		assert.expect( testCases.length );

		$.each( testCases, function ( i, testCase ) {
			// clear the cache so we get a fresh result
			pageVisibility.documentVisibilityChangeEventName = null;
			assert.equal(
				pageVisibility.getDocumentVisibilitychangeEventName( testCase[ 0 ] ), testCase[ 1 ] );
		} );
	} );

	QUnit.test( 'document visibility is correctly detected', function ( assert ) {
		var testCases = [
			[ { hidden: false }, false ],
			[ { hidden: true }, true ],
			[ { mozHidden: false }, false ],
			[ { mozHidden: true }, true ],
			[ { msHidden: false }, false ],
			[ { msHidden: true }, true ],
			[ { webkitHidden: false }, false ],
			[ { webkitHidden: true }, true ],
			[ { unsupportedHidden: false }, undefined ],
			[ {}, undefined ]
		];

		assert.expect( testCases.length );

		$.each( testCases, function ( i, testCase ) {
			// clear the cache so we get a fresh result
			pageVisibility.documentHiddenPropertyName = null;
			assert.equal(
				pageVisibility.isDocumentHidden( testCase[ 0 ] ), testCase[ 1 ] );
		} );
	} );

}( mediaWiki, jQuery ) );
