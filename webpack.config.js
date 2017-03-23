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
		filename: '[name].js'
	},
	entry: {
		index: './src/index.js'
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			redux: path.resolve(__dirname, 'node_modules/redux/dist/redux.js'),
			'redux-thunk': path.resolve(__dirname, 'node_modules/redux-thunk/dist/redux-thunk.js')
		}
	},
	plugins: [
		// To generate identifiers that are preserved over builds, webpack supplies
		// the NamedModulesPlugin (generates comments with file names on bundle)
		// https://webpack.js.org/guides/caching/#deterministic-hashes
		new webpack.NamedModulesPlugin()
	]
};
