/**
 * @module reducers/index
 * @private
 */

const pageviews = require( './pageviews.js' );
const preview = require( './preview.js' );
const settings = require( './settings.js' );
const statsv = require( './statsv.js' );

module.exports = {
	pageviews,
	preview,
	settings,
	statsv
};
