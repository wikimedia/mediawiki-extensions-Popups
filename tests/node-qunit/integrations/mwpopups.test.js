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
				enabled: { page: false }
			}
		},
		store = mockStore( state ),
		popups = createMwPopups( store );

	this.sandbox.spy( store, 'getState' );

	assert.strictEqual( popups.isEnabled(), false, 'Popups are disabled.' );
	assert.strictEqual( store.getState.callCount, 1, 'The store was checked.' );
} );

QUnit.test( '#isEnabled returns correct value when enabled', function ( assert ) {
	const state = {
			preview: {
				enabled: { page: true }
			}
		},
		store = mockStore( state ),
		popups = createMwPopups( store );

	this.sandbox.spy( store, 'getState' );

	assert.strictEqual( popups.isEnabled(), true, 'Popups are enabled.' );
	assert.strictEqual( store.getState.callCount, 1, 'The store was checked.' );
} );
