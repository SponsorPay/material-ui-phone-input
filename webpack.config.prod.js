const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');

module.exports = {
  entry: {
    phone: ["./lib/example.js"],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: "[name].js"
  },
  watchOptions: {
    poll: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'public/index.html'),
      template: path.resolve(__dirname, 'index.html'),
    }),
    new DynamicCdnWebpackPlugin({
      env: 'production'
    }),
    new BundleAnalyzerPlugin()
  ]
}
