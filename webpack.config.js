var path = require( 'path' );
var webpack = require( 'webpack' );
var PUBLIC_PATH = '/w/extensions/Popups';

module.exports = {
	output: {
		// The absolute path to the output directory.
		path: path.resolve( __dirname, 'resources/dist' ),
		devtoolModuleFilenameTemplate: PUBLIC_PATH + '/[resource-path]',

		// Write each chunk (entries, here) to a file named after the entry, e.g.
		// the "index" entry gets written to index.js.
		filename: '/[name].js'
	},
	entry: {
		index: './build/ext.popups/index.js'
	},
	devtool: 'source-map'
};
