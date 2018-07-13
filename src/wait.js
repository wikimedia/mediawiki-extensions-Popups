/**
 * @module wait
 */

const $ = jQuery;

/**
 * A Promise usually for a long running or costly request that is abortable.
 * @template T
 * @typedef {JQuery.Promise<T>} AbortPromise
 * @prop {Function(): void} abort
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
 * @return {AbortPromise<void>}
 */
export default function wait( delay ) {
	const deferred = $.Deferred();

	const timer = setTimeout( () => {
		deferred.resolve();
	}, delay );
	deferred.catch( () => clearTimeout( timer ) );

	return deferred.promise( {
		abort() {
			deferred.reject();
		}
	} );
}
