const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { baseConfig } = require('./webpack.config');

const root = path.resolve(__dirname, '..');

module.exports = merge(baseConfig('pc'), {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    port: 8000,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(root, 'index.html'),
    }),
  ],
});
