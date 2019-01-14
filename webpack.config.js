/* global __dirname, process */
const
	path = require( 'path' ),
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
		// Output a timestamp when a build completes. Useful when watching files.
		builtAt: true,
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
		noEmitOnErrors: isProduction,

		// Use filenames instead of unstable numerical identifiers for file references. This
		// increases the gzipped bundle size some but makes the build products easier to debug and
		// appear deterministic. I.e., code changes will only alter the bundle they're packed in
		// instead of shifting the identifiers in other bundles.
		// https://webpack.js.org/guides/caching/#deterministic-hashes (namedModules replaces NamedModulesPlugin.)
		namedModules: true
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
		new CleanPlugin( distDir, { verbose: false } )
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

module.exports = conf;
