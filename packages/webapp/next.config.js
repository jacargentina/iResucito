const path = require('path');
const fs = require('fs');
const plist = require('plist');

const ios_Info = plist.parse(
  fs.readFileSync(
    path.join(__dirname, '/../../ios/iResucito/Info.plist'),
    'utf8'
  )
);

const androidGradle = fs.readFileSync(
  path.join(__dirname, '/../../android/app/build.gradle'),
  'utf8'
);

const android_major = /def VERSION_MAJOR=(.*)/.exec(androidGradle)[1];
const android_minor = /def VERSION_MINOR=(.*)/.exec(androidGradle)[1];
const android_patch = /def VERSION_PATCH=(.*)/.exec(androidGradle)[1];
const android_build = /def VERSION_BUILD=(.*)/.exec(androidGradle)[1];

function resolve() {
  return path.resolve.apply(path, [__dirname, ...arguments]);
}

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { webpack }) => {
    config.module.rules[1].include.push(resolve('../..'));
    config.plugins.push(
      new webpack.DefinePlugin({
        API_PORT: JSON.stringify(process.env ? process.env.API_PORT : ''),
        IOS_VERSION: JSON.stringify(
          `${ios_Info.CFBundleShortVersionString}.${ios_Info.CFBundleVersion}`
        ),
        ANDROID_VERSION: JSON.stringify(
          `${android_major}.${android_minor}.${android_patch}.${android_build}`
        ),
      })
    );
    return config;
  },
};
