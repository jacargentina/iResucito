import { I18n } from 'i18n-js';
import en from './langs/en.json';
import enPH from './langs/en-PH.json';
import es from './langs/es.json';
import it from './langs/it.json';
import ptBR from './langs/pt-BR.json';
import ptPT from './langs/pt-PT.json';
import deAT from './langs/de-AT.json';
import ltLT from './langs/lt-LT.json';
import swTZ from './langs/sw-TZ.json';
import fr from './langs/fr.json';
import de from './langs/de.json';
import pl from './langs/pl.json';
import ru from './langs/ru.json';

// Lenguajes disponibles
const i18n = new I18n({
  en: en,
  'en-PH': enPH,
  es: es,
  it: it,
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  'de-AT': deAT,
  'lt-LT': ltLT,
  'sw-TZ': swTZ,
  fr: fr,
  de: de,
  pl: pl,
  ru: ru
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
