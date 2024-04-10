module.exports = {
  skip: {
    changelog: true,
  },
  bumpFiles: [
    {
      filename: 'package.json',
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo'),
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/android/increment'),
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/ios/increment'),
    },
  ],
};
