var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [path.resolve(__dirname, 'scripts/songToPdf.js')],
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: '[name].js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-flow']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true
    })
  ]
};

module.exports = config;
