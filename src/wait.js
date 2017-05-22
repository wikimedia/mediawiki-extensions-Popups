/**
 * @module wait
 */

var $ = jQuery;

/**
 * Sugar around `window.setTimeout`.
 *
 * @example
 * var wait = require( './wait' );
 *
 * wait( 150 )
 *   .then( function () {
 *     // Continue processing...
 *   } );
 *
 * @param {Number} delay The number of milliseconds to wait
 * @return {jQuery.Promise}
 */
module.exports = function ( delay ) {
	var result = $.Deferred();

	setTimeout( function () {
		result.resolve();
	}, delay );

	return result.promise();
};
