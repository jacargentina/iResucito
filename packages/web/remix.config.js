/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  serverDependenciesToBundle: [
    'crypto-random-string',
    'lowdb',
    'steno',
    '@iresucito/translations',
    '@iresucito/core',
    'i18n-js',
  ],
};
