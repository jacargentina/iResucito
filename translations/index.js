import I18n from 'i18n-js';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';

// Lenguajes disponibles
I18n.translations = {
  en: require('./en'),
  es: require('./es'),
  it: require('./it'),
  'pt-BR': require('./pt-BR'),
  'pt-PT': require('./pt-PT'),
  'de-AT': require('./de-AT'),
  'lt-LT': require('./lt-LT'),
  'sw-TZ': require('./sw-TZ'),
  fr: require('./fr'),
  de: require('./de'),
};

export default I18n;
