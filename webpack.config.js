/* global __dirname, process */
const path = require( 'path' ),
	webpack = require( 'webpack' ),
	CleanPlugin = require( 'clean-webpack-plugin' ),
	PUBLIC_PATH = '/w/extensions/Popups',
	isProduction = process.env.NODE_ENV === 'production';

const reduxPath = isProduction ?
	'node_modules/redux/dist/redux.min.js' :
	'node_modules/redux/dist/redux.js';

const reduxThunkPath = isProduction ?
	'node_modules/redux-thunk/dist/redux-thunk.min.js' :
	'node_modules/redux-thunk/dist/redux-thunk.js';

const distDir = path.resolve( __dirname, 'resources/dist' );

// The extension used for source map files.
const srcMapExt = '.map.json';

const conf = {
	// Apply the rule of silence: https://wikipedia.org/wiki/Unix_philosophy.
	stats: {
		all: false,
		errors: true,
		warnings: true
	},

	// Fail on the first build error instead of tolerating it for prod builds. This seems to
	// correspond to optimization.noEmitOnErrors.
	bail: isProduction,

	// Specify that all paths are relative the Webpack configuration directory not the current
	// working directory.
	context: __dirname,

	entry: { index: './src' },

	optimization: {
		// Don't produce production output when a build error occurs.
		noEmitOnErrors: isProduction
	},

	output: {
		// The absolute path to the output directory.
		path: distDir,
		devtoolModuleFilenameTemplate: `${PUBLIC_PATH}/[resource-path]`,

		// Write each chunk (entries, here) to a file named after the entry, e.g.
		// the "index" entry gets written to index.js.
		filename: '[name].js',

		// Rename source map extensions. Per T173491 files with a .map extension cannot be served
		// from prod.
		sourceMapFilename: `[file]${srcMapExt}`
	},

	// Accurate source maps at the expense of build time. The source map is intentionally exposed
	// to users via sourceMapFilename for prod debugging. This goes against convention as source
	// code is publicly distributed.
	devtool: 'source-map',

	plugins: [
		new CleanPlugin( distDir, { verbose: false } ),

		// To generate identifiers that are preserved over builds, webpack supplies
		// the NamedModulesPlugin (generates comments with file names on bundle)
		// https://webpack.js.org/guides/caching/#deterministic-hashes
		new webpack.NamedModulesPlugin()
	],

	performance: {
		// Size violations for prod builds fail; development builds are unchecked.
		hints: isProduction ? 'error' : false,

		// Minified uncompressed size limits for chunks / assets and entrypoints. Keep these numbers
		// up-to-date and rounded to the nearest 10th of a kibibyte so that code sizing costs are
		// well understood. Related to bundlesize minified, gzipped compressed file size tests.
		// Note: entrypoint size implicitly includes the mobile.startup.runtime entry.
		maxAssetSize: 40 * 1024,
		maxEntrypointSize: 40 * 1024,

		// The default filter excludes map files but we rename ours.
		assetFilter: ( filename ) => !filename.endsWith( srcMapExt )
	},

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
					options: {
						cacheDirectory: true
					}
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
	}
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
