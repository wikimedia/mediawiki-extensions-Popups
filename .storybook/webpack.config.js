const path = require("path");

module.exports = {
	module: {
		rules: 	[
			{
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
			},
			{
				test: /\.css$/,
				use: [ {
						loader: 'style-loader'
				}, {
						loader: 'css-loader'
				} ]
			},
			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'less-loader',
					options: {
						paths: [
							path.resolve( __dirname, 'mocks' )
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
				test: /\.jpg$/,
				loader: 'url-loader'
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
				issuer: /\.js$/,
				options: {
					removeSVGTagAttrs: false // Keep width and height attributes.
				}
			}
		]
	},
	resolve: {
		extensions: [ '.js' ]
	}
};
