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
  fr: require('./fr')
};

export default I18n;
