import createMwPopups from '../../../src/integrations/mwpopups';

/**
 * @private
 * @param {*} state
 * @return {Object}
 */
function mockStore( state ) {
	return {
		getState() {
			return state;
		}
	};
}

QUnit.module( 'ext.popups/integrations' );

QUnit.test( '#isEnabled returns correct value when disabled', function ( assert ) {
	const state = {
			preview: {
				enabled: false
			}
		},
		store = mockStore( state ),
		popups = createMwPopups( store );

	this.sandbox.spy( store, 'getState' );

	assert.equal( popups.isEnabled(), false );
	assert.ok( store.getState.calledOnce );
} );

QUnit.test( '#isEnabled returns correct value when enabled', function ( assert ) {
	const state = {
			preview: {
				enabled: true
			}
		},
		store = mockStore( state ),
		popups = createMwPopups( store );

	this.sandbox.spy( store, 'getState' );

	assert.equal( popups.isEnabled(), true );
	assert.ok( store.getState.calledOnce );
} );
