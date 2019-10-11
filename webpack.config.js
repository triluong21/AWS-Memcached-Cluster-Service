const path = require('path');
const slsw = require('serverless-webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  externals: [nodeExternals()],
  mode: "development",
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      { test: /\.ts(x?)$/, exclude: /node_modules/, loader: 'ts-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
    ],
  },
};
