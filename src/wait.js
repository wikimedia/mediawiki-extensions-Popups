/**
 * @module wait
 */

var $ = jQuery;

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
	var result = $.Deferred();

	setTimeout( () => {
		result.resolve();
	}, delay );

	return result.promise();
}
