var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var plist = require('plist');

var ios_Info = plist.parse(
  fs.readFileSync(__dirname + '/../../ios/iResucito/Info.plist', 'utf8')
);

var androidGradle = fs.readFileSync(
  __dirname + '/../../android/app/build.gradle',
  'utf8'
);

var android_major = /def VERSION_MAJOR=(.*)/.exec(androidGradle)[1];
var android_minor = /def VERSION_MINOR=(.*)/.exec(androidGradle)[1];
var android_patch = /def VERSION_PATCH=(.*)/.exec(androidGradle)[1];
var android_build = /def VERSION_BUILD=(.*)/.exec(androidGradle)[1];

module.exports = (env, argv) => {
  return {
    devtool: argv.mode === 'development' ? 'source-map' : 'none',
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
        API_PORT: JSON.stringify(env ? env.API_PORT : ''),
        IOS_VERSION: JSON.stringify(
          `${ios_Info.CFBundleShortVersionString}.${ios_Info.CFBundleVersion}`
        ),
        ANDROID_VERSION: JSON.stringify(
          `${android_major}.${android_minor}.${android_patch}.${android_build}`
        )
      })
    ]
  };
};
