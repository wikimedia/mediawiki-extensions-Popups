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
		sourceMapFilename: '[file].json'
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
	module: {
		rules: [
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
			// Preserve @nomin comments that disable ResourceLoader minification if
			// present. Right now a banner with @nomin is not being added since in
			// production mode the source-map comment will end up in a compound
			// bundle (as load.php will bundle a many modules in a single request)
			// thus breaking source-maps for other sources than the Popups ones. We
			// should add the @nomin banner in the future if ResourceLoader supports
			// combining/merging source-maps from different modules. For the moment,
			// the source map comment will be stripped in ResourceLoader's production
			// mode to not interfere with debugging other sources loaded alongside
			// Popups.
			//
			// See https://phabricator.wikimedia.org/T188081 for more info
			comments: /@nomin/
		} )
	] );
}

module.exports = conf;
