/* eslint-env node */
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const path = require( 'path' );

const PUBLIC_PATH = '/w/extensions/Popups';

const distDir = path.resolve( __dirname, 'resources/dist' );

// The extension used for source map files.
const srcMapExt = '.map.json';

module.exports = ( env, argv ) => ( {
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
	bail: argv.mode === 'production',

	// Specify that all paths are relative the Webpack configuration directory not the current
	// working directory.
	context: __dirname,

	entry: { index: './src' },

	resolve: {
		alias: {
			redux: path.resolve(
				__dirname,
				argv.mode === 'production' ?
					'node_modules/redux/dist/redux.min.js' :
					'node_modules/redux/dist/redux.js'
			),
			'redux-thunk': path.resolve(
				__dirname,
				argv.mode === 'production' ?
					'node_modules/redux-thunk/dist/redux-thunk.min.js' :
					'node_modules/redux-thunk/dist/redux-thunk.js'
			)
		}
	},
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					// Beware of https://github.com/babel/babel-loader/issues/690. Changes to browsers require
					// manual invalidation.
					cacheDirectory: true
				}
			}
		}, {
			test: /\.svg$/,
			loader: 'svg-inline-loader',
			options: {
				removeSVGTagAttrs: false // Keep width and height attributes.
			}
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		} ]
	},
	optimization: {
		// Don't produce production output when a build error occurs.
		noEmitOnErrors: argv.mode === 'production',

		// Use filenames instead of unstable numerical identifiers for file references. This
		// increases the gzipped bundle size some but makes the build products easier to debug and
		// appear deterministic. I.e., code changes will only alter the bundle they're packed in
		// instead of shifting the identifiers in other bundles.
		// https://webpack.js.org/guides/caching/#deterministic-hashes (namedModules replaces NamedModulesPlugin.)
		namedModules: true
	},

	output: {
		// Specify the destination of all build products.
		path: distDir,

		// Store outputs per module in files named after the modules. For the JavaScript entry
		// itself, append .js to each ResourceLoader module entry name. This value is tightly
		// coupled to sourceMapFilename.
		filename: '[name].js',

		// Rename source map extensions. Per T173491 files with a .map extension cannot be served
		// from prod.
		sourceMapFilename: `[file]${srcMapExt}`,

		devtoolModuleFilenameTemplate: `${PUBLIC_PATH}/[resource-path]`
	},

	// Accurate source maps at the expense of build time. The source map is intentionally exposed
	// to users via sourceMapFilename for prod debugging. This goes against convention as source
	// code is publicly distributed.
	devtool: 'source-map',

	plugins: [
		// Delete the output directory on each build.
		new CleanWebpackPlugin( {
			cleanOnceBeforeBuildPatterns: [ '**/*', '!.eslintrc.json' ]
		} )
	],

	performance: {
		// Size violations for prod builds fail; development builds are unchecked.
		hints: argv.mode === 'production' ? 'error' : false,

		// Minified uncompressed size limits for chunks / assets and entrypoints. Keep these numbers
		// up-to-date and rounded to the nearest 10th of a kibibyte so that code sizing costs are
		// well understood. Related to bundlesize minified, gzipped compressed file size tests.
		maxAssetSize: 46.9 * 1024,
		maxEntrypointSize: 46.9 * 1024,

		// The default filter excludes map files but we rename ours.
		assetFilter: ( filename ) => !filename.endsWith( srcMapExt )
	}
} );
