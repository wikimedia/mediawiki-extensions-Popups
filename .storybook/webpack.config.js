const path = require("path");
const webpack = require('webpack');

module.exports = {
	module: {
		rules: 	[ {
				test: /\.less$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'less-loader',
					options: {
						paths: [
							/**
							 * Less files are resolved to this path,
							 * which contain less files that essentially
							 * just reach into mediawiki core fo the
							 * appropriate files.
							 * This path is also specified in stories/index.stories.less
							 * when importing '../../src/ui/index.less'.
							 */
							path.resolve(__dirname, './mocks/less')
						]
					}
				}],
			},
			{
				test: /\.svg$/,
				issuer: /\.less$/,
				loader: 'url-loader'
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
				issuer: /\.js$/,
				options: {
					removeSVGTagAttrs: false // Keep width and height attributes.
				}
			},
			{
				test: require.resolve('jquery'),
				use: [{
					loader: 'expose-loader',
					options: 'jQuery'
				}, {
					loader: 'expose-loader',
					options: '$'
				}]
			},
			{
				test: require.resolve('./mocks/js/mockMediaWiki.js'),
				use: [{
					loader: 'expose-loader',
					options: 'mw'
				}, {
					loader: 'expose-loader',
					options: 'mediaWiki'
				}]
			}
		]
	},
	resolve: {
		alias: {
			'mediaWiki': require.resolve('./mocks/js/mockMediaWiki.js'),
			'mw': require.resolve('./mocks/js/mockMediaWiki.js')
		},
		extensions: [ '.js' ]
	},
	plugins: [
		new webpack.ProvidePlugin({
			mw: 'mw',
			mediaWiki: 'mediaWiki'
		} )
	]
};
