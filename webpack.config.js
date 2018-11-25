const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, 'src')],
        exclude: /(node_modules|bower_components)/,

        use: {
          loader: 'babel-loader',

          options: {
            plugins: ["@babel/plugin-syntax-dynamic-import"],
            presets: ['@babel/preset-env']
          }
        }
			},
			{
				test: /\.css$/,

				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',

						options: {
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',

						options: {
							plugins: function() {
								return [precss, autoprefixer];
							}
						}
					}
				]
			}
		]
	},

	mode: 'development',

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: false
		}
	},

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
