import I18n from 'react-native-i18n';

I18n.fallbacks = true;
I18n.defaultLocale = 'en';

// Lenguajes disponibles
I18n.translations = {
  en: require('./en'),
  es: require('./es'),
  it: require('./it'),
  pt: require('./pt'),
  'de-AT': require('./de-AT')
};

export default I18n;
