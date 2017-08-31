/* global __dirname, process */

var path = require( 'path' ),
	webpack = require( 'webpack' ),
	PUBLIC_PATH = '/w/extensions/Popups',
	isProduction = process.env.NODE_ENV === 'production',
	reduxPath,
	reduxThunkPath,
	conf;

reduxPath = isProduction ?
	'node_modules/redux/dist/redux.min.js' :
	'node_modules/redux/dist/redux.js';

reduxThunkPath = isProduction ?
	'node_modules/redux-thunk/dist/redux-thunk.min.js' :
	'node_modules/redux-thunk/dist/redux-thunk.js';

conf = {
	output: {
		// The absolute path to the output directory.
		path: path.resolve( __dirname, 'resources/dist' ),
		devtoolModuleFilenameTemplate: PUBLIC_PATH + '/[resource-path]',

		// Write each chunk (entries, here) to a file named after the entry, e.g.
		// the "index" entry gets written to index.js.
		filename: '[name].js',
		// as we cannot serve .map files from production servers store map files
		// with .json extension
		sourceMapFilename: "[file].json"
	},
	entry: {
		index: './src/index.js'
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			redux: path.resolve( __dirname, reduxPath ),
			'redux-thunk': path.resolve( __dirname, reduxThunkPath )
		}
	},
	plugins: [
		// To generate identifiers that are preserved over builds, webpack supplies
		// the NamedModulesPlugin (generates comments with file names on bundle)
		// https://webpack.js.org/guides/caching/#deterministic-hashes
		new webpack.NamedModulesPlugin(),

		// Disable ResourceLoader minification since we're going to be minifying
		// with uglify
		new webpack.BannerPlugin( {
			banner: '/*@nomin*/', // ResourceLoader::FILTER_NOMIN
			// Don't wrap the banner in a comment. It's easier to keep the banner in
			// sync with ResourceLoader::FILTER_NOMIN this way
			raw: true
		} )
	]
};

// Production settings.
// Enable minification and dead code elimination with uglify. Define the
// global process.env.NODE_ENV so that libraries like redux and redux-thunk get
// development code trimmed.
// Enable minimize flags for webpack loaders and disable debug.
if ( isProduction ) {
	conf.plugins = conf.plugins.concat( [
		new webpack.LoaderOptionsPlugin( {
			minimize: true,
			debug: false
		} ),
		new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( 'production' )
			}
		} ),
		new webpack.optimize.UglifyJsPlugin( {
			sourceMap: true,
			comments: /@nomin/
		} )
	] );
}

module.exports = conf;
