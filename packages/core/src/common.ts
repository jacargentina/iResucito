// Utilerias comunes (no atadas a react-native ni a NodeJS)
import langs from 'langs';
import countries from 'country-list';
import * as _ from 'lodash';
import i18n from '@iresucito/translations';

export type PickerLocale = {
  label: string;
  value: string;
};

export type SongItem = {
  stage: string;
  advent?: boolean;
  christmas?: boolean;
  lent?: boolean;
  easter?: boolean;
  pentecost?: boolean;
  'signing to the virgin'?: boolean;
  "children's songs"?: boolean;
  'lutes and vespers'?: boolean;
  entrance?: boolean;
  'peace and offerings'?: boolean;
  'fraction of bread'?: boolean;
  communion?: boolean;
  exit?: boolean;
  files: {
    [lang: string]: string;
  };
  stages?: {
    [lang: string]: string;
  };
};

export type SongsData = {
  [songKey: string]: SongItem;
};

export type SongLocaleItem = {
  name: string;
  source: string;
};

export type SongsLocaleData = {
  [index: string]: SongLocaleItem;
};

export type SongsSourceData = {
  [locale: string]: SongsLocaleData;
};

export type SongsChanges = {
  [songKey: string]: Array<SongChange>;
};

export type CollaboratorsData = {
  [localeKey: string]: Array<string>;
};

export type SongChange = {
  locale: string;
  author: string;
  date: number;
  linked?: {
    new: string;
  };
  rename?: {
    original?: string;
    new: string;
  };
  staged?: {
    original?: string;
    new: string;
  };
  created?: boolean;
  updated?: boolean;
};

export type SongChangesAndPatches = {
  changes: Array<SongChange>;
  pending: {
    author: string;
    date: number;
  } | null;
};

export type SongPatchData = {
  author: string;
  date: number;
  name: string;
  stage?: string;
  lines?: string;
};

export type SongPatch = {
  [locale: string]: SongPatchData;
};

export type SongIndexPatch = {
  [key: string]: SongPatch;
};

export type SongSettings = {
  rating: number;
  transportTo: string;
};

export type SongLocaleSettings = {
  [locale: string]: SongSettings;
};

export type SongSettingsFile = {
  [key: string]: SongLocaleSettings;
};

export type SongStyles<StyleType> = {
  title: StyleType;
  source: StyleType;
  clampLine: StyleType;
  indicator: StyleType;
  notesLine: StyleType;
  specialNoteTitle: StyleType;
  specialNote: StyleType;
  normalLine: StyleType;
  normalPrefix: StyleType;
  assemblyLine: StyleType;
  assemblyPrefix: StyleType;
  pageNumber: StyleType;
  pageFooter: StyleType;
  marginLeft: number;
  marginTop: number;
  widthHeightPixels: number;
  bookTitleSpacing: number;
  songIndicatorSpacing: number;
  indexMarginLeft: number;
  indexTitle: StyleType;
  bookSubtitle: StyleType;
  bookTitle: StyleType;
  indexText: StyleType;
  disablePageNumbers: boolean;
  empty: StyleType;
};

export type SongLineType =
  | 'posicionAbrazadera'
  | 'canto'
  | 'cantoConIndicador'
  | 'notas'
  | 'inicioParrafo'
  | 'notaEspecial'
  | 'tituloEspecial'
  | 'textoEspecial'
  | 'bloqueRepetir'
  | 'bloqueNotaAlPie'
  | 'comenzarColumna';

export type SongLine<StyleType> = {
  raw: string;
  texto: string;
  style: StyleType;
  prefijo: string;
  prefijoStyle: StyleType;
  sufijo: string;
  sufijoStyle: StyleType;
  type: SongLineType;
};

export type SongIndicator = {
  start: number;
  end: number;
  type: SongLineType;
};

export type SongRendering<T> = {
  items: Array<SongLine<T>>;
  indicators: Array<SongIndicator>;
};

// nombre: el nombre completo del canto
// titulo: el titulo del canto
// fuente: el origen del canto (salmo, palabra, etc)
export type SongDetails = {
  nombre: string;
  titulo: string;
  fuente: string;
};

// key: la clave única del canto dentro del indice global de cantos
// nombre: el nombre completo del archivo, sin la extension .txt
// titulo: el titulo del anto
// fuente: el origen del canto (salmo, palabra, etc)
// files: diccionario con todos los idiomas del canto
// fullText: el texto completo del canto
// lines: array de las lineas del canto
export type Song = {
  key: string;
  version: number;
  notTranslated: boolean;
  stage: string;
  advent: boolean;
  christmas: boolean;
  lent: boolean;
  easter: boolean;
  pentecost: boolean;
  'signing to the virgin': boolean;
  "children's songs": boolean;
  'lutes and vespers': boolean;
  entrance: boolean;
  'peace and offerings': boolean;
  'fraction of bread': boolean;
  communion: boolean;
  exit: boolean;
  nombre: string;
  titulo: string;
  fuente: string;
  files: { [key: string]: string };
  stages?: { [key: string]: string };
  fullText: string;
  patched?: boolean;
  patchedTitle?: string;
  added?: boolean;
  error?: any;
  rating: number;
  transportTo: string;
};

export type SongRef = Song | SongDetails;

export type SearchParams = {
  filter: any;
  title_key?: string;
  sort?: any;
};

export type SearchItem = {
  title_key: string;
  note_key?: string;
  divider?: boolean;
  note?: string;
  params?: SearchParams;
  badge?: any;
  chooser?: string;
  chooser_listKey?: string[];
};

export type ListType = 'eucaristia' | 'palabra' | 'libre';

export type ListAction = 'create' | 'rename';

export type LibreList = {
  type: 'libre';
  version: number;
  items: string[];
};

export type PalabraList = {
  type: 'palabra';
  version: number;
  ambiental: string | null;
  entrada: string | null;
  '1-monicion': string | null;
  '1': string | null;
  '1-salmo': string | null;
  '2-monicion': string | null;
  '2': string | null;
  '2-salmo': string | null;
  '3-monicion': string | null;
  '3': string | null;
  '3-salmo': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  salida: string | null;
  nota: string | null;
};

export type EucaristiaList = {
  type: 'eucaristia';
  version: number;
  ambiental: string | null;
  entrada: string | null;
  '1-monicion': string | null;
  '1': string | null;
  '2-monicion': string | null;
  '2': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  'oracion-universal': string | null;
  paz: string | null;
  'comunion-pan': string[] | null;
  'comunion-caliz': string[] | null;
  salida: string | null;
  'encargado-pan': string | null;
  'encargado-flores': string | null;
  nota: string | null;
};

export type Lists = {
  [listName: string]: LibreList | PalabraList | EucaristiaList;
};

export type LibreListForUI = {
  name: string;
  type: 'libre';
  localeType: string;
  version: number;
  items: Song[];
};

export type PalabraListForUI = {
  name: string;
  type: 'palabra';
  localeType: string;
  version: number;
  ambiental: string | null;
  entrada: Song | null;
  '1-monicion': string | null;
  '1': string | null;
  '1-salmo': Song | null;
  '2-monicion': string | null;
  '2': string | null;
  '2-salmo': Song | null;
  '3-monicion': string | null;
  '3': string | null;
  '3-salmo': Song | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  salida: Song | null;
  nota: string | null;
};

export type EucaristiaListForUI = {
  name: string;
  type: 'eucaristia';
  localeType: string;
  version: number;
  ambiental: string | null;
  entrada: Song | null;
  '1-monicion': string | null;
  '1': string | null;
  '2-monicion': string | null;
  '2': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  'oracion-universal': string | null;
  paz: Song | null;
  'comunion-pan': Song[] | null;
  'comunion-caliz': Song[] | null;
  salida: Song | null;
  'encargado-pan': string | null;
  'encargado-flores': string | null;
  nota: string | null;
};

export type ListForUI = LibreListForUI | PalabraListForUI | EucaristiaListForUI;

export type ListToPdf = ListForUI & {
  localeType: string;
};

export type ShareListType = 'native' | 'text' | 'pdf';

export type SongSetting = 'transportTo' | 'rating';

export const getLocalizedListType = (
  listType: ListType,
  localeValue: string
): string => {
  switch (listType) {
    case 'eucaristia':
      return i18n.t('list_type.eucharist', { locale: localeValue });
    case 'palabra':
      return i18n.t('list_type.word', { locale: localeValue });
    case 'libre':
      return i18n.t('list_type.other', { locale: localeValue });
    default:
      return '';
  }
};

export type ListTitleValue = {
  title: string;
  value: string[];
};

export const cleanChordsRegex: any =
  /\[|\]|\(|\)|\*|5|6|7|9|\+|\-|\/|aum|dim|sus|m/g;

export const cleanMultichord = (value: string) => {
  value = value.replace(/\^|\$/g, '');
  if (value.includes('|')) {
    value = value.substring(0, value.indexOf('|'));
  }
  return value;
};

export const getChordsScale = (locale: string): Array<RegExp> => {
  var chords = i18n.t('chords.scale', { locale }).split(' ');
  return chords.map((ch) => new RegExp(`^${ch}$`, 'i'));
};

export const getPropertyLocale = (obj: any, rawLoc: string): string => {
  if (obj.hasOwnProperty(rawLoc)) {
    return rawLoc;
  } else {
    const locale = rawLoc.split('-')[0];
    if (obj.hasOwnProperty(locale)) {
      return locale;
    }
    return '';
  }
};

export const getLocaleLabel = (code: string): string => {
  if (!code) {
    return 'code is empty';
  }
  const parts = code.split('-');
  const l = langs.where('1', parts[0]);
  if (!l) {
    return `Unknown code = "${code}"`;
  }
  var label = l.local;
  if (parts.length > 1) {
    const countryName = countries.getName(parts[1]);
    if (countryName) {
      label += ` (${countryName})`;
    }
  }
  return label;
};

export const getLocalesForPicker = (
  defaultLocale?: string
): Array<PickerLocale> => {
  var locales = [];
  if (defaultLocale) {
    locales.push({
      label: `${i18n.t('ui.default')} - ${getLocaleLabel(defaultLocale)}`,
      value: 'default',
    });
  }
  for (var code in i18n.translations) {
    locales.push({ label: getLocaleLabel(code), value: code });
  }
  locales.sort((a, b) => a.label.localeCompare(b.label));
  return locales;
};

export const getValidatedLocale = (
  availableLocales: Array<PickerLocale>,
  locale: string
): PickerLocale | undefined => {
  if (!locale) {
    return undefined;
  }
  const loc = locale.split('-')[0];
  const best = availableLocales.find(
    (l) => l.value === locale || l.value === loc
  );
  return best;
};

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const wayStages = [
  'precatechumenate',
  'liturgy',
  'catechumenate',
  'election',
];

export const liturgicTimes = [
  'advent',
  'christmas',
  'lent',
  'easter',
  'pentecost',
];

export const liturgicOrder = [
  'signing to the virgin',
  "children's songs",
  'lutes and vespers',
  'entrance',
  'peace and offerings',
  'fraction of bread',
  'communion',
  'exit',
];

export type AuthorStats = {
  author: string;
  count: number;
};

export type PatchStats = {
  locale: string;
  count: number;
  items: Array<AuthorStats>;
};

export const getPatchStats = (patch: SongIndexPatch): Array<PatchStats> => {
  const stats: Array<PatchStats> = [];
  const allItems: Array<{ locale: string; author: string }> = [];
  Object.keys(patch).forEach((key) => {
    const songPatch = patch[key];
    Object.keys(songPatch).forEach((rawLoc) => {
      allItems.push({ locale: rawLoc, author: songPatch[rawLoc].author });
    });
  });
  const byLocale = _.groupBy(allItems, (i) => i.locale);
  Object.keys(byLocale).forEach((locale) => {
    const byAuthor = _.groupBy(byLocale[locale], (p) => p.author);
    const items = Object.keys(byAuthor).map((author) => {
      return { author, count: byAuthor[author].length };
    });
    stats.push({ locale, count: byLocale[locale].length, items });
  });
  return stats;
};

export const loadAllLocales = (): SongsSourceData => {
  var allLocales: SongsSourceData = {};

  allLocales['es'] = require('../assets/songs/es.json');
  allLocales['en'] = require('../assets/songs/en.json');
  allLocales['it'] = require('../assets/songs/it.json');
  allLocales['de-AT'] = require('../assets/songs/de-AT.json');
  allLocales['de'] = require('../assets/songs/de.json');
  allLocales['fr'] = require('../assets/songs/fr.json');
  allLocales['lt-LT'] = require('../assets/songs/lt-LT.json');
  allLocales['pl'] = require('../assets/songs/pl.json');
  allLocales['pt-BR'] = require('../assets/songs/pt-BR.json');
  allLocales['pt-PT'] = require('../assets/songs/pt-PT.json');
  allLocales['ru'] = require('../assets/songs/ru.json');
  allLocales['sw-TZ'] = require('../assets/songs/sw-TZ.json');

  return allLocales;
};

export type PdfStyle = {
  color: PDFKit.Mixins.ColorValue;
  font: PDFKit.Mixins.PDFFontSource;
  fontSize: number;
};

export const PdfStyles: SongStyles<PdfStyle> = {
  empty: { color: 'transparent', font: 'none', fontSize: 0 },
  title: { color: '#ff0000', font: 'medium', fontSize: 16 },
  source: { color: '#777777', font: 'medium', fontSize: 9.8 },
  clampLine: { color: '#ff0000', font: 'regular', fontSize: 7 },
  indicator: { color: '#ff0000', font: 'medium', fontSize: 11 },
  notesLine: { color: '#ff0000', font: 'regular', fontSize: 7 },
  specialNoteTitle: { color: '#ff0000', font: 'medium', fontSize: 8 },
  specialNote: { color: '#444444', font: 'regular', fontSize: 8 },
  normalLine: { color: '#000000', font: 'regular', fontSize: 9 },
  normalPrefix: { color: '#777777', font: 'regular', fontSize: 11 },
  assemblyLine: { color: '#000000', font: 'medium', fontSize: 11 },
  assemblyPrefix: { color: '#777777', font: 'medium', fontSize: 11 },
  pageNumber: { color: '#000000', font: 'regular', fontSize: 11 },
  pageFooter: { color: '#777777', font: 'regular', fontSize: 10 },
  indexTitle: { color: '#000000', font: 'medium', fontSize: 16 },
  bookTitle: { color: '#ff0000', font: 'medium', fontSize: 80 },
  bookSubtitle: { color: '#000000', font: 'regular', fontSize: 14 },
  indexText: { color: '#ff0000', font: 'medium', fontSize: 11 },
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  bookTitleSpacing: 10,
  indexMarginLeft: 25,
  songIndicatorSpacing: 21,
  disablePageNumbers: false,
};
