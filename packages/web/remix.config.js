/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  serverModuleFormat: 'cjs',
  browserNodeBuiltinsPolyfill: { modules: { fs: true, crypto: true } },
  serverDependenciesToBundle: [
    'crypto-random-string',
    'lowdb',
    'steno',
    '@iresucito/translations',
    '@iresucito/core',
    'i18n-js',
  ],
};
