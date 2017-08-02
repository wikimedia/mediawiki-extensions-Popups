import registerMwPopups from '../../../src/integrations/mwpopups';

var mw = mediaWiki,
	mockStore = function ( state ) {
		return {
			getState: function () {
				return state;
			}
		};
	};

QUnit.module( 'ext.popups/integrations', {
	beforeEach: function () {
		delete mw.popups;
	},
	afterEach: function () {
		delete mw.popups;
	}
} );

QUnit.test( '#isEnabled returns correct value when disabled', function ( assert ) {
	var state, store;

	state = {
		preview: {
			enabled: false
		}
	};
	store = mockStore( state );
	this.sandbox.spy( store, 'getState' );

	registerMwPopups( store );
	assert.equal( mw.popups.isEnabled(), false );
	assert.ok( store.getState.calledOnce );
} );

QUnit.test( '#isEnabled returns correct value when enabled', function ( assert ) {
	var state, store;

	state = {
		preview: {
			enabled: true
		}
	};
	store = mockStore( state );
	this.sandbox.spy( store, 'getState' );

	registerMwPopups( store );
	assert.equal( mw.popups.isEnabled(), true );
	assert.ok( store.getState.calledOnce );
} );
