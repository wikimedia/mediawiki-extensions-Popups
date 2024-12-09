/**
 * @module canSaveToUserPreferences
 * @private
 */

/**
 * Can the current user save to user preferences?
 *
 * @param {User} user
 * @return {boolean}
 */
const canSaveToUserPreferences = ( user ) => !user.isAnon() && user.isNamed();

module.exports = canSaveToUserPreferences;
