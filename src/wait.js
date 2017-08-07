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
 *   .then( function () {
 *     // Continue processing...
 *   } );
 *
 * @param {Number} delay The number of milliseconds to wait
 * @return {jQuery.Promise}
 */
export default function wait( delay ) {
	var result = $.Deferred();

	setTimeout( function () {
		result.resolve();
	}, delay );

	return result.promise();
}
