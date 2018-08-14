var path = require('path');
var webpack = require('webpack');

var config = {
  entry: { songToPdf: path.resolve(__dirname, 'scripts/songToPdf.js') },
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: '[name].js'
  },
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-flow']
          }
        }
      },
      {
        test: /fontkit[\/\\]index.js$/,
        enforce: 'post',
        loader: 'transform-loader?brfs'
      },
      {
        test: /unicode-properties[\/\\]index.js$/,
        enforce: 'post',
        loader: 'transform-loader?brfs'
      },
      {
        test: /linebreak[\/\\]src[\/\\]linebreaker.js/,
        enforce: 'post',
        loader: 'transform-loader?brfs'
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
