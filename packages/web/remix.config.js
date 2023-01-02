/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: [
    'crypto-random-string',
    'lowdb',
    'steno',
    '@iresucito/translations',
    '@iresucito/core',
    'i18n-js',
  ],
};
