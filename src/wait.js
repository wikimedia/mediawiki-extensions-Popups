/**
 * @module wait
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
 * @return {jQuery.Promise}
 */
export default function wait( delay ) {
	const deferred = $.Deferred();
	setTimeout( () => deferred.resolve(), delay );
	return deferred.promise();
}
