( function ( mw ) {

	/**
	 * @typedef {Object} mw.popups.UserSettings
	 */

	var IS_ENABLED_KEY = 'mwe-popups-enabled';

	/**
	 * Given the global state of the application, creates an object whose methods
	 * encapsulate all interactions with the given User Agent's storage.
	 *
	 * @param {mw.storage} storage The `mw.storage` singleton instance
	 * @param {mw.user} user The `mw.user` singleton instance
	 *
	 * @return {mw.popups.UserSettings}
	 */
	mw.popups.createUserSettings = function ( storage, user ) {
		return {

			/**
			 * Gets whether or not the user has previously enabled Link Previews.
			 *
			 * N.B. that if the user hasn't previously enabled or disabled Link
			 * Previews, i.e. mw.popups.userSettings., then they are treated as if they have.
			 *
			 * @return {Boolean}
			 */
			getIsEnabled: function () {
				return storage.get( IS_ENABLED_KEY ) !== '0';
			},

			/**
			 * Sets whether or not the user has enabled Link Previews.
			 *
			 * @param {Boolean} isEnabled
			 */
			setIsEnabled: function ( isEnabled ) {
				storage.set( IS_ENABLED_KEY, isEnabled ? '1' : '0' );
			},

			/**
			 * Gets whether or not the user has previously enabled **or disabled**
			 * Link Previews.
			 *
			 * @return {Boolean}
			 */
			hasIsEnabled: function () {
				return storage.get( IS_ENABLED_KEY, undefined ) !== undefined;
			},

			/**
			 * Gets the user's Link Previews token.
			 *
			 * If the storage doesn't contain a token, then one is generated and
			 * persisted to the storage before being returned.
			 *
			 * @return {String}
			 */
			getToken: function () {
				var key = 'PopupsExperimentID',
					id = storage.get( key );

				if ( !id ) {
					id = user.generateRandomSessionId();

					storage.set( key, id );
				}

				return id;
			}
		};
	};

}( mediaWiki ) );
