var path = require('path');
var webpack = require('webpack');

module.exports = env => {
  return {
    target: 'node',
    entry: __dirname + '/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.json']
    },
    output: {
      path: path.resolve(__dirname + '/../dist'),
      filename: 'serverBundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        PORT: JSON.stringify(env ? env.PORT : '')
      })
    ]
  };
};
