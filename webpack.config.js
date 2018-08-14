var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [path.resolve(__dirname, 'scripts/songToPdf.js')],
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-flow'],
            plugins: [
              new webpack.BannerPlugin({
                banner: '#!/usr/bin/env node',
                raw: true
              }),
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};

module.exports = config;
