/**
 * @module wait
 */

let $ = jQuery;

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
 * @param {Number} delay The number of milliseconds to wait
 * @return {jQuery.Promise}
 */
export default function wait( delay ) {
	let result = $.Deferred();

	setTimeout( () => {
		result.resolve();
	}, delay );

	return result.promise();
}
