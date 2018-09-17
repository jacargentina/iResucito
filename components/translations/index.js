import I18n from 'react-native-i18n';

I18n.fallbacks = true;

// Lenguajes disponibles
I18n.translations = {
  es: require('./es'),
  en: require('./en'),
  it: require('./it')
  //pt: require('./pt')
};

export default I18n;
