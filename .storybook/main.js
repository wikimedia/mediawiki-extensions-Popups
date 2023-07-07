const path = require("path");
const webpack = require( "webpack" );

module.exports = {
	stories: ['./stories/*.stories.js' ],
	webpackFinal: async (config, { configType }) => {
		config.module.rules.push({
			test: /\.less$/,
			use: ['style-loader', 'css-loader', {
				loader: 'less-loader',
					options: {
						paths: [
							path.resolve( __dirname, 'mocks' )
						]
					}
				}]
			});

			config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.less$/,
			loader: 'url-loader'
		});

		config.module.rules.push({
			test: /\.svg$/,
			loader: 'svg-inline-loader',
			issuer: /\.js$/,
			options: {
				removeSVGTagAttrs: false // Keep width and height attributes.
			}
		});

		config.module.rules.push({
			test: /\.jpg$/,
			loader: 'url-loader'
		});

		config.resolve.extensions.push( '.js' );

		config.plugins.push(
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery"
			})
		);

		return config;
	}
};
