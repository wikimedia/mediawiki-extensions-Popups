/**
 * @module changeListeners/index
 * @private
 */

const footerLink = require( './footerLink.js' );
const linkTitle = require( './linkTitle.js' );
const pageviews = require( './pageviews.js' );
const render = require( './render.js' );
const settings = require( './settings.js' );
const statsv = require( './statsv.js' );
const syncUserSettings = require( './syncUserSettings.js' );

module.exports = {
	footerLink,
	linkTitle,
	pageviews,
	render,
	settings,
	statsv,
	syncUserSettings
};
