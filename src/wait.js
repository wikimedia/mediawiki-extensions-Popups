/**
 * @module wait
 * @private
 */

/**
 * Sugar around `window.setTimeout`.
 *
 * @example
 * import wait from './wait';
 *
 * wait( 150 )
 *   .then( () => {
 *     // Continue processing...
 *   } );
 *
 * @param {number} delay The number of milliseconds to wait
 * @return {Promise}
 */
function wait( delay ) {
	return new Promise( ( resolve ) => {
		setTimeout( () => {
			resolve();
		}, delay );
	} );
}

module.exports = {
	wait
};
