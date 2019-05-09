var path = require('path');
var webpack = require('webpack');

module.exports = (env, argv) => {
  return {
    devtool: argv.mode === 'development' ? 'source-map' : ' none',
    entry: __dirname + '/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '*.css']
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'clientBundle.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, '../dist')
    },
    plugins: [
      new webpack.DefinePlugin({
        API_PORT: JSON.stringify(env ? env.API_PORT : '')
      })
    ]
  };
};
