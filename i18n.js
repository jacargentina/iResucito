import I18n, { getLanguages } from 'react-native-i18n';

I18n.fallbacks = true;

// Lenguajes disponibles
I18n.translations = {
  es: require('./translations/es'),
  en: require('./translations/en'),
  it: require('./translations/it')
};

getLanguages().then(langs => {
  console.log('i18n languages', langs);
});

export default I18n;
