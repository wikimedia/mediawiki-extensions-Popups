/**
 * Creates an instance of the statsv change listener.
 *
 * The listener will log events to a statsv endpoint by delegating the work
 * to the `ext.wikimediaEvents` module which is added to the output page
 * by the WikimediaEvents extension.
 *
 * @param {Object} boundActions
 * @param {bool} isLoggingEnabled
 * @param {Function} track mw.track
 * @return {ext.popups.ChangeListener}
 */
module.exports = function ( boundActions, isLoggingEnabled, track ) {
	return function ( _, state ) {
		var statsv = state.statsv;

		if ( isLoggingEnabled && statsv.action ) {
			track( statsv.action, statsv.data );

			boundActions.statsvLogged();
		}
	};
};
