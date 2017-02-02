( function ( mw, $ ) {

	/**
	 * Sugar around `window.setTimeout`.
	 *
	 * @example
	 * function continueProcessing() {
	 *   // ...
	 * }
	 *
	 * mw.popups.wait( 150 ).then( continueProcessing );
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

}( mediaWiki, jQuery ) );
