/**
 * Creates the next state tree from the current state tree and some updates.
 *
 * N.B. OO.copy doesn't copy Element instances, whereas $.extend does.
 * However, OO.copy does copy properties whose values are undefined or null,
 * whereas $.extend doesn't. Since the state tree contains an Element instance
 * - the preview.activeLink property - and we want to copy undefined/null into
 * the state we need to manually iterate over updates and check with
 * hasOwnProperty to copy over to the new state.
 *
 * In [change listeners](/docs/change_listener.md), for example, we talk about
 * the previous state and the current state (the `prevState` and `state`
 * parameters, respectively). Since
 * [reducers](http://redux.js.org/docs/basics/Reducers.html) take the current
 * state and an action and make updates, "next state" seems appropriate.
 *
 * @param {Object} state
 * @param {Object} updates
 * @return {Object}
 */
export default function nextState( state, updates ) {
	const result = {};
	const hasOwn = Object.prototype.hasOwnProperty;

	for ( const key in state ) {
		if ( hasOwn.call( state, key ) && !hasOwn.call( updates, key ) ) {
			result[ key ] = state[ key ];
		}
	}

	for ( const key in updates ) {
		if ( hasOwn.call( updates, key ) ) {
			result[ key ] = updates[ key ];
		}
	}

	return result;
}
