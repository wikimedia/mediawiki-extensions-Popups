/**
 * Mocks out various mediawiki.js functionality to avoid the mw dependency.
 */
const messages = require( '../../../i18n/en.json');
module.exports = {
	msg: function ( key ) {
		return messages[ key ];
	},
	Title: function( string ) {
		return {
			getUrl: function(){ return string }
		};
	},
	html: {
		escape: function( str ){
			return str
		}
	}
};
