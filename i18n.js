import I18n from 'react-native-i18n';

I18n.fallbacks = true;

// Lenguajes disponibles
I18n.translations = {
  es: require('./translations/es'),
  en: require('./translations/en'),
  it: require('./translations/it')
};

export default I18n;
