/* global __dirname, process */
const path = require( 'path' ),
	webpack = require( 'webpack' ),
	PUBLIC_PATH = '/w/extensions/Popups',
	isProduction = process.env.NODE_ENV === 'production';

let reduxPath,
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
		devtoolModuleFilenameTemplate: `${PUBLIC_PATH  }/[resource-path]`,

		// Write each chunk (entries, here) to a file named after the entry, e.g.
		// the "index" entry gets written to index.js.
		filename: '[name].js',
		// as we cannot serve .map files from production servers store map files
		// with .json extension
		sourceMapFilename: '[file].json'
	},
	entry: { index: './src' },
	performance: {
		hints: isProduction ? 'error' : false,
		maxAssetSize: 40 * 1024,
		maxEntrypointSize: 40 * 1024,
		assetFilter: function ( filename ) {
			// The default filter excludes map files but we rename ours to .filename.
			return filename.endsWith( '.js' );
		}
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			redux: path.resolve( __dirname, reduxPath ),
			'redux-thunk': path.resolve( __dirname, reduxThunkPath )
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: { cacheDirectory: true }
				}
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
				options: {
					removeSVGTagAttrs: false // Keep width and height attributes.
				}
			}
		]
	},
	plugins: [
		// To generate identifiers that are preserved over builds, webpack supplies
		// the NamedModulesPlugin (generates comments with file names on bundle)
		// https://webpack.js.org/guides/caching/#deterministic-hashes
		new webpack.NamedModulesPlugin()
	]
};

// Production settings.
// Define the global process.env.NODE_ENV so that libraries like redux and
// redux-thunk get development code trimmed.
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
		} )
	] );
}

module.exports = conf;
