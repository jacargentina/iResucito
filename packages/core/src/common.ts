// Utilerias comunes (no atadas a react-native ni a NodeJS)
import langs from 'langs';
import countries from 'country-list';
import normalize from 'normalize-strings';
import type PDFDocument from 'pdfkit';
import _ from 'lodash';
import i18n from '@iresucito/translations';
import esLocale from '../assets/songs/es.json';
import enLocale from '../assets/songs/en.json';
import itLocale from '../assets/songs/it.json';
import deATLocale from '../assets/songs/de-AT.json';
import deLocale from '../assets/songs/de.json';
import frLocale from '../assets/songs/fr.json';
import ltLTLocale from '../assets/songs/lt-LT.json';
import plLocale from '../assets/songs/pl.json';
import ptBRLocale from '../assets/songs/pt-BR.json';
import ptPTLocale from '../assets/songs/pt-PT.json';
import ruLocale from '../assets/songs/ru.json';
import swTZLocale from '../assets/songs/sw-TZ.json';
import esAudios from '../assets/audios/es.json';

export type SongAudioItem = {
  id: string;
  name: string;
};

export type SongsAudioData = {
  [songKey: string]: SongAudioItem | null;
};

export const esAudiosData: SongsAudioData = esAudios;

export type SongToPdf<T> = {
  song: Song;
  render: SongRendering<T>;
};

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

  allLocales['es'] = esLocale;
  allLocales['en'] = enLocale;
  allLocales['it'] = itLocale;
  allLocales['de-AT'] = deATLocale;
  allLocales['de'] = deLocale;
  allLocales['fr'] = frLocale;
  allLocales['lt-LT'] = ltLTLocale;
  allLocales['pl'] = plLocale;
  allLocales['pt-BR'] = ptBRLocale;
  allLocales['pt-PT'] = ptPTLocale;
  allLocales['ru'] = ruLocale;
  allLocales['sw-TZ'] = swTZLocale;

  return allLocales;
};

declare global {
  namespace PDFKit {
    interface PDFDocument {
      _pageBuffer: [];
      _registeredFonts: { [name: string]: {} };
    }

    interface PDFPage {
      pageNumber: number;
    }
  }
}

var DEBUG_RECTS = false;

export type ListSongGroup = {
  [key: string]: Array<ListSongItem>;
};

export type ListSongItem = {
  songKey: string;
  str: string;
};

export const getAlphaWithSeparators = (
  songsToPdf: Array<SongToPdf<any>>
): Array<ListSongItem> => {
  // Alfabetico
  var items: Array<ListSongItem> = songsToPdf.map((data) => {
    const sameName = songsToPdf.filter(
      (d) => d.song.titulo === data.song.titulo
    );
    const str = sameName.length > 1 ? data.song.nombre : data.song.titulo;
    return { songKey: data.song.key, str };
  });
  var i = 0;
  var letter = items.length > 0 ? normalize(items[i].str[0]) : '';
  while (i < items.length) {
    const curLetter = normalize(items[i].str[0]);
    if (curLetter !== letter) {
      letter = curLetter;
      items.splice(i, 0, { songKey: '', str: '' });
    }
    i++;
  }
  return items;
};

export const getGroupedByStage = (
  songsToPdf: Array<SongToPdf<PdfStyle>>
): ListSongGroup => {
  // Agrupados por stage
  var initial: ListSongGroup = {};
  return songsToPdf.reduce((groups, data) => {
    const groupKey = data.song.stage;
    groups[groupKey] = groups[groupKey] || [];
    const sameName = songsToPdf.filter(
      (d) => d.song.titulo === data.song.titulo
    );
    const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
    groups[groupKey].push({ songKey: data.song.key, str: title });
    return groups;
  }, initial);
};

export const getGroupedByLiturgicTime = (
  songsToPdf: Array<SongToPdf<PdfStyle>>
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  var initial: ListSongGroup = {};
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicTimes.filter((t) => (data.song as any)[t] === true);
    times.forEach((t) => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        (d) => d.song.titulo === data.song.titulo
      );
      const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
      groups[t].push({ songKey: data.song.key, str: title });
    });
    return groups;
  }, initial);
};

export const getGroupedByLiturgicOrder = (
  songsToPdf: Array<SongToPdf<PdfStyle>>
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  var initial: ListSongGroup = {};
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicOrder.filter((t) => (data.song as any)[t] === true);
    times.forEach((t) => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        (d) => d.song.titulo === data.song.titulo
      );
      const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
      groups[t].push({ songKey: data.song.key, str: title });
    });
    return groups;
  }, initial);
};

export type ExportToPdfLimits = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ExportToPdfLineText = {
  page: number;
  x: number;
  startY: number;
  endY: number;
  text: string;
  color: any;
};

export type ListSongPos = {
  page: number;
  songKey: string;
  x: number;
  y: number;
  value: number;
};

export class PdfWriter {
  opts: SongStyles<PdfStyle>;
  doc: PDFKit.PDFDocument;
  base64Transform: any;
  addExtraMargin: boolean;
  listing: Array<ListSongPos>;
  resetY: number;
  disablePageNumbers: boolean;
  limits: ExportToPdfLimits;
  pageNumberLimits: ExportToPdfLimits;
  firstColLimits: ExportToPdfLimits;
  secondColLimits: ExportToPdfLimits;
  widthOfIndexPageNumbers: number;
  heightOfPageNumbers: number;
  widthOfIndexSpacing: number;

  // classRef: se recibe el tipo especifico a ser instanciado
  // desde Node/Remix: PDFDocument desde pdfkit
  // desde Expo/React-Native: PDFDocument desde pdfkit-standalone
  constructor(
    classRef: typeof PDFDocument,
    regularFont: PDFKit.Mixins.PDFFontSource | null,
    mediumFont: PDFKit.Mixins.PDFFontSource | null,
    base64Transform: any,
    opts: SongStyles<PdfStyle>
  ) {
    this.base64Transform = base64Transform;
    this.opts = opts;
    this.resetY = 0;
    this.disablePageNumbers = false;
    this.limits = { x: 0, y: 0, w: 0, h: 0 };
    this.pageNumberLimits = { x: 0, y: 0, w: 0, h: 0 };
    this.firstColLimits = { x: 0, y: 0, w: 0, h: 0 };
    this.secondColLimits = { x: 0, y: 0, w: 0, h: 0 };
    this.widthOfIndexPageNumbers = 0;
    this.heightOfPageNumbers = 0;
    this.widthOfIndexSpacing = 0;
    this.addExtraMargin = false;
    this.doc = new classRef({
      bufferPages: true,
      autoFirstPage: false,
      margins: {
        top: this.opts.marginTop,
        bottom: this.opts.marginTop,
        left:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0),
        right:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0),
      },
      size: [this.opts.widthHeightPixels, this.opts.widthHeightPixels],
      info: {
        Title: 'iResucitó',
        Author: 'iResucitó app',
        Subject: 'iResucitó Song Book',
        Keywords: 'Neocatechumenal songs',
      },
    });
    this.doc.on('pageAdded', () => {
      this.widthOfIndexPageNumbers = this.doc
        .fontSize(this.opts.indexText.fontSize as number)
        .widthOfString('000');
      this.heightOfPageNumbers = this.doc
        .fontSize(this.opts.pageNumber.fontSize as number)
        .heightOfString('000');
      this.widthOfIndexSpacing = this.doc
        .fontSize(this.opts.indexText.fontSize as number)
        .widthOfString('  ');
      this.resetY = this.opts.marginTop;
      this.limits = {
        x: this.doc.page.margins.left,
        y: this.doc.page.margins.top,
        w:
          this.opts.widthHeightPixels -
          this.doc.page.margins.right -
          this.doc.page.margins.left,
        h:
          this.opts.widthHeightPixels -
          this.doc.page.margins.bottom -
          this.doc.page.margins.top,
      };
      this.pageNumberLimits = {
        x: this.limits.x,
        y:
          this.opts.widthHeightPixels -
          this.doc.page.margins.bottom -
          this.heightOfPageNumbers,
        w: this.limits.w,
        h: this.heightOfPageNumbers,
      };
      this.firstColLimits = {
        x: this.limits.x,
        y: this.limits.y,
        w: this.limits.w / 2,
        h: this.limits.h,
      };
      this.secondColLimits = {
        x: this.firstColLimits.x + this.firstColLimits.w,
        y: this.limits.y,
        w: this.firstColLimits.w,
        h: this.limits.h,
      };
      if (DEBUG_RECTS === true) {
        const drawLimits = (
          limits: ExportToPdfLimits,
          color: PDFKit.Mixins.ColorValue
        ) => {
          const { x, y, w, h } = limits;
          this.doc.rect(x, y, w, h).stroke(color);
        };
        drawLimits(this.limits, '#888');
        drawLimits(this.pageNumberLimits, '#666');
        drawLimits(this.firstColLimits, '#3333aa');
        drawLimits(this.secondColLimits, '#aa3333');
      }
    });
    if (regularFont) {
      this.doc.registerFont('regular', regularFont);
    }
    if (mediumFont) {
      this.doc.registerFont('medium', mediumFont);
    }
    if (!this.doc._registeredFonts['regular']) {
      this.doc.font('regular', 'Times-Roman');
    }
    if (!this.doc._registeredFonts['medium']) {
      this.doc.font('medium', 'Times-Roman');
    }
    this.listing = [];
  }

  writePageNumber() {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y;
    if (!this.disablePageNumbers) {
      this.writeText(
        this.doc.page.pageNumber.toString(),
        this.opts.pageNumber.color,
        this.opts.pageNumber.font,
        this.opts.pageNumber.fontSize,
        {
          lineBreak: false,
          align: 'center',
          width:
            this.opts.widthHeightPixels -
            this.doc.page.margins.left -
            this.doc.page.margins.right,
          height: this.heightOfPageNumbers,
        }
      );
    }
  }

  writePageFooterText(text: string) {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y;
    this.writeText(
      text,
      this.opts.pageFooter.color,
      this.opts.pageFooter.font,
      this.opts.pageFooter.fontSize,
      {
        lineBreak: false,
        align: 'center',
        width:
          this.opts.widthHeightPixels -
          this.doc.page.margins.left -
          this.doc.page.margins.right,
        height: this.heightOfPageNumbers,
      }
    );
  }

  checkLimits(lineCount: number = 1, nextHeight: number = 0): boolean {
    var pageWasAdded = false;
    if (
      this.doc.y + this.doc.currentLineHeight(false) * lineCount + nextHeight >
      this.pageNumberLimits.y
    ) {
      if (this.doc.x === this.secondColLimits.x) {
        const pn = this.doc.page.pageNumber;
        this.writePageNumber();
        this.doc.addPage();
        this.doc.page.pageNumber = pn + 1;
        pageWasAdded = true;
      } else {
        this.doc.x = this.secondColLimits.x;
      }
      this.doc.y = this.resetY;
    }
    return pageWasAdded;
  }

  startColumn() {
    if (this.doc.x !== this.secondColLimits.x) {
      this.doc.x = this.secondColLimits.x;
      this.doc.y = this.resetY;
    }
  }

  getCenteringY(text: string, size: number): number {
    const height = this.doc.fontSize(size).heightOfString(text);
    return (this.opts.widthHeightPixels - height) / 2;
  }

  writeText(
    text: string,
    color: PDFKit.Mixins.ColorValue,
    font: PDFKit.Mixins.PDFFontSource,
    fontSize: number,
    opts?: PDFKit.Mixins.TextOptions
  ): number {
    this.doc.fillColor(color).font(font, fontSize).text(text, opts);
    return (
      this.doc.fontSize(fontSize).widthOfString(text) +
      (opts && opts.indent ? opts.indent : 0)
    );
  }

  drawLineText(line: ExportToPdfLineText, size: number) {
    this.doc.switchToPage(line.page);
    this.doc
      .moveTo(line.x, line.startY)
      .lineTo(line.x, line.endY)
      .stroke(line.color);
    const middle = (line.endY - line.startY) / 2;
    this.doc
      .fillColor(line.color)
      .fontSize(size)
      .text(line.text, line.x + 10, line.startY + middle - size, {
        lineBreak: false,
      });
  }

  async save(): Promise<string> {
    return new Promise((resolve, reject) => {
      var stream = this.doc.pipe(this.base64Transform);
      var str = '';
      stream.on('error', (err: any) => {
        reject(err);
      });
      stream.on('data', (data: any) => {
        str += data;
      });
      stream.on('finish', () => {
        resolve(str);
      });
      this.doc.end();
    });
  }

  generateListing(title: string, items: Array<ListSongItem>) {
    this.checkLimits(2);
    this.writeText(
      title.toUpperCase(),
      this.opts.indexTitle.color,
      this.opts.indexText.font,
      this.opts.indexText.fontSize
    );
    if (items) {
      items.forEach((item: ListSongItem) => {
        if (item.str === '') {
          this.doc.moveDown();
        } else {
          const txtOpts = {
            width:
              this.firstColLimits.w -
              this.widthOfIndexPageNumbers -
              this.widthOfIndexSpacing,
          };
          const txtHeight = this.doc
            .fontSize(this.opts.indexText.fontSize)
            .heightOfString(item.str, txtOpts);
          this.checkLimits(0, txtHeight);
          this.writeText(
            item.str,
            this.opts.indexText.color,
            this.opts.indexText.font,
            this.opts.indexText.fontSize,
            txtOpts
          );
          this.listing.push({
            page: this.doc.page.pageNumber,
            songKey: item.songKey,
            x:
              this.doc.x < this.secondColLimits.x
                ? this.firstColLimits.x + this.firstColLimits.w
                : this.secondColLimits.x + this.secondColLimits.w,
            y: this.doc.y - this.doc.currentLineHeight(false),
            value: 0,
          });
        }
      });
    }
  }

  finalizeListing() {
    if (this.listing.length > 0) {
      for (var i = 0; i < this.doc._pageBuffer.length; i++) {
        this.doc.switchToPage(i);
        var items = this.listing.filter((l) => l.page === i);
        items.forEach((l: ListSongPos) => {
          this.doc.x =
            l.x - this.widthOfIndexPageNumbers - this.widthOfIndexSpacing * 2;
          this.doc.y = l.y;
          this.writeText(
            l.value.toString(),
            this.opts.indexText.color,
            this.opts.indexText.font,
            this.opts.indexText.fontSize,
            {
              width: this.widthOfIndexPageNumbers + this.widthOfIndexSpacing,
              align: 'right',
            }
          );
        });
      }
    }
  }
}

export const SongPDFGenerator = async (
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  writer: PdfWriter,
  addIndex: boolean
): Promise<string> => {
  try {
    if (songsToPdf.length === 0) {
      console.log('SongPDFGenerator lista vacia');
      return '';
    }
    writer.disablePageNumbers = opts.disablePageNumbers;
    if (addIndex) {
      // Portada
      writer.addExtraMargin = true;
      writer.doc.addPage();
      const title = i18n.t('ui.export.songs book title').toUpperCase();
      const subtitle = i18n.t('ui.export.songs book subtitle').toUpperCase();

      // Escalar titulo - en español "Resucitó" (9 letras) (A) => pdfValues.bookTitle.FontSize (B)
      // Para otra longitud, cual seria el font size? "Er ist auferstanden" (19 letras) (C) => (X)
      // Regla de 3 inversa X = A * B / C

      const A = i18n.t('ui.export.songs book title', {
        locale: 'es',
      }).length;
      const B = writer.opts.bookTitle.fontSize;
      const C = title.length;
      const X = (A * B) / C;

      const titleFontSize = Math.trunc(X);

      // Titulo
      writer.doc.y = writer.getCenteringY(
        title,
        titleFontSize +
          writer.opts.bookTitleSpacing +
          writer.opts.bookSubtitle.fontSize
      );
      writer.writeText(
        title,
        opts.title.color,
        opts.title.font,
        titleFontSize,
        {
          align: 'center',
        }
      );

      // Subtitulo
      writer.writeText(
        subtitle,
        writer.opts.bookSubtitle.color,
        writer.opts.bookSubtitle.font,
        writer.opts.bookSubtitle.fontSize,
        {
          align: 'center',
        }
      );

      //Indice
      writer.doc.addPage();
      writer.doc.page.pageNumber = 1;
      writer.writeText(
        i18n.t('ui.export.songs index').toUpperCase(),
        writer.opts.indexTitle.color,
        writer.opts.indexTitle.font,
        writer.opts.indexTitle.fontSize,
        { align: 'center' }
      );

      // Linea de espacio antes del primer item listado
      writer.doc.moveDown();
      // Posicion de reset para segunda columna
      writer.resetY = writer.doc.y;

      // Alfabetico
      var alphaItems = getAlphaWithSeparators(songsToPdf);
      writer.generateListing(i18n.t('search_title.alpha'), alphaItems);

      writer.doc.moveDown();

      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      wayStages.forEach((stage) => {
        writer.generateListing(i18n.t(`search_title.${stage}`), byStage[stage]);
        writer.doc.moveDown();
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      liturgicTimes.forEach((time, i) => {
        var titleTime = i18n.t(`search_title.${time}`);
        if (i === 0) {
          titleTime =
            i18n.t('search_title.liturgical time') + ` - ${titleTime}`;
        }
        writer.generateListing(titleTime, byTime[time]);
        writer.doc.moveDown();
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      liturgicOrder.forEach((order) => {
        var titleOrder = i18n.t(`search_title.${order}`);
        writer.generateListing(titleOrder, byOrder[order]);
        writer.doc.moveDown();
      });

      writer.writePageNumber();
    }

    writer.addExtraMargin = false;
    // Cantos
    songsToPdf.forEach((data) => {
      const { song, render } = data;
      const { items, indicators } = render;

      const next = writer.doc.page ? writer.doc.page.pageNumber + 1 : 0;
      writer.doc.addPage();
      writer.doc.page.pageNumber = next;

      // Titulo del canto
      writer.writeText(
        song.titulo.toUpperCase(),
        writer.opts.title.color,
        writer.opts.title.font,
        writer.opts.title.fontSize,
        { align: 'center' }
      );

      // Fuente
      writer.writeText(
        song.fuente,
        writer.opts.source.color,
        writer.opts.source.font,
        writer.opts.source.fontSize,
        { align: 'center' }
      );

      // Linea de espacio antes de las primeras notas
      writer.doc.moveDown();
      // Posicion de reset para segunda columna
      writer.resetY = writer.doc.y;

      var lines: Array<ExportToPdfLineText> = [];
      var blockIndicator: SongIndicator | undefined;
      var blockY: number;
      var maxX = 0;
      items.forEach((it: SongLine<PdfStyle>, i: number) => {
        var lastWidth: number = 0;
        if (i > 0 && it.type === 'inicioParrafo') {
          writer.doc.moveDown(0.4);
        }
        if (i > 0 && it.type === 'tituloEspecial') {
          writer.doc.moveDown();
          writer.doc.moveDown();
        }
        if (indicators.find((r) => r.start === i)) {
          blockIndicator = indicators.find((r) => r.start === i);
          blockY = writer.doc.y;
        }
        if (blockIndicator && blockIndicator.end === i) {
          var text = '';
          var color = opts.indicator.color;
          if (blockIndicator.type === 'bloqueRepetir') {
            text = i18n.t('songs.repeat');
          } else if (blockIndicator.type === 'bloqueNotaAlPie') {
            text = '*';
          }
          lines.push({
            page: writer.doc._pageBuffer.length - 1,
            startY: blockY,
            endY: writer.doc.y - writer.doc.currentLineHeight(false),
            x: maxX + 10,
            text,
            color,
          });
          blockIndicator = undefined;
          blockY = 0;
        }
        if (it.type === 'comenzarColumna') {
          writer.startColumn();
        }
        // Sólo verificar limites para agregar nueva pagina
        // cuando no es el último item. Por ej. un "inicioParrafo" al final
        // generaría una pagina final en blanco indeseada
        if (i !== items.length - 1) {
          writer.checkLimits(it.type === 'notas' ? 2 : 1);
        }
        if (it.type === 'notas') {
          if (it.texto.trim() == '') {
            writer.doc.moveDown();
          } else {
            lastWidth = writer.writeText(
              it.texto,
              it.style.color,
              it.style.font,
              it.style.fontSize,
              { indent: writer.opts.songIndicatorSpacing }
            );
          }
        } else if (it.type === 'canto') {
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'cantoConIndicador') {
          maxX = 0;
          lastWidth = writer.writeText(
            it.prefijo,
            it.style.color,
            it.style.font,
            it.style.fontSize
          );
          writer.doc.moveUp();
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'tituloEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'textoEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'notaEspecial') {
          lastWidth = writer.writeText(
            it.prefijo,
            it.style.color,
            it.style.font,
            it.style.fontSize
          );
          writer.doc.moveUp();
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'posicionAbrazadera') {
          lastWidth = writer.writeText(
            it.texto,
            it.style.color,
            it.style.font,
            it.style.fontSize
          );
          writer.doc.moveDown();
          // Posicion de reset para segunda columna
          // el texto debe comenzar al mismo nivel
          writer.resetY = writer.doc.y;
        }
        if (it.sufijo) {
          writer.doc.moveUp();
          const lastX = writer.doc.x;
          writer.doc.x = writer.doc.x + lastWidth;
          lastWidth = writer.writeText(
            it.sufijo,
            it.style.color,
            it.style.font,
            it.style.fontSize
          );
          writer.doc.x = lastX;
        }
        maxX = Math.trunc(Math.max(writer.doc.x + lastWidth, maxX));
      });
      lines.forEach((line: ExportToPdfLineText) => {
        writer.drawLineText(line, writer.opts.normalLine.fontSize);
      });
      // Ir al final
      writer.doc.switchToPage(writer.doc._pageBuffer.length - 1);
      writer.writePageNumber();
      const assignItems = writer.listing.filter((l) => l.songKey === song.key);
      assignItems.forEach((i) => {
        i.value = writer.doc.page.pageNumber;
      });
    });
    writer.finalizeListing();
    return await writer.save();
  } catch (err) {
    console.log('SongPDFGenerator ERROR', err);
  }
  return '';
};

const PdfNewLine = 'NEWLINE';
const PdfNewCol = 'NEWCOL';

export type PdfItem = 'NEWLINE' | 'NEWCOL' | ListTitleValue | null;

export const ListPDFGenerator = async (
  list: ListToPdf,
  opts: SongStyles<PdfStyle>,
  writer: PdfWriter
): Promise<string> => {
  try {
    writer.disablePageNumbers = true;
    writer.addExtraMargin = true;
    writer.doc.addPage();

    const title = list.name.toUpperCase();
    const subtitle = list.localeType.toUpperCase();

    // Titulo
    writer.writeText(
      title,
      opts.title.color,
      opts.title.font,
      opts.title.fontSize,
      {
        align: 'center',
      }
    );

    // Subtitulo
    writer.writeText(
      subtitle,
      opts.source.color,
      opts.source.font,
      opts.source.fontSize,
      {
        align: 'center',
      }
    );

    writer.doc.moveDown();
    // Posicion de reset para segunda columna
    writer.resetY = writer.doc.y;

    if (list.type === 'libre') {
      var cantos = list.items;
      cantos.forEach((canto, i) => {
        const lastX = writer.doc.x;
        writer.writeText(
          `${i + 1}.`,
          opts.normalLine.color,
          opts.normalLine.font,
          opts.normalLine.fontSize,
          {
            lineBreak: false,
            align: 'left',
          }
        );
        writer.doc.x += 10;
        writer.writeText(
          canto.titulo,
          opts.normalLine.color,
          opts.normalLine.font,
          opts.normalLine.fontSize,
          {
            align: 'left',
          }
        );
        writer.doc.x = lastX;
      });
    } else {
      var items: PdfItem[] = [];
      items.push(getListTitleValue(list, 'ambiental'));
      items.push(getListTitleValue(list, 'entrada'));
      items.push(PdfNewLine);
      items.push(getListTitleValue(list, '1-monicion'));
      items.push(getListTitleValue(list, '1'));
      items.push(getListTitleValue(list, '1-salmo'));
      items.push(PdfNewLine);
      items.push(getListTitleValue(list, '2-monicion'));
      items.push(getListTitleValue(list, '2'));
      items.push(getListTitleValue(list, '2-salmo'));
      items.push(PdfNewLine);
      if (list.type === 'palabra') {
        items.push(PdfNewCol);
      }
      items.push(getListTitleValue(list, '3-monicion'));
      items.push(getListTitleValue(list, '3'));
      items.push(getListTitleValue(list, '3-salmo'));
      items.push(PdfNewLine);
      items.push(getListTitleValue(list, 'evangelio-monicion'));
      items.push(getListTitleValue(list, 'evangelio'));
      if (list.type === 'eucaristia') {
        items.push(PdfNewCol);
      }
      items.push(getListTitleValue(list, 'oracion-universal'));
      items.push(getListTitleValue(list, 'paz'));
      items.push(getListTitleValue(list, 'comunion-pan'));
      items.push(getListTitleValue(list, 'comunion-caliz'));
      items.push(getListTitleValue(list, 'salida'));
      items.push(PdfNewLine);
      items.push(getListTitleValue(list, 'encargado-pan', true));
      items.push(getListTitleValue(list, 'encargado-flores', true));
      items.push(getListTitleValue(list, 'nota', true));

      var movedDown = false;
      items.forEach((item, i) => {
        // cuando el anterior es un NEWLINE, no moverse de nuevo!
        if (typeof item === 'string') {
          if (item === PdfNewLine && !movedDown) {
            writer.doc.moveDown();
            movedDown = true;
          } else if (item === PdfNewCol) {
            writer.startColumn();
            movedDown = false;
          }
        } else if (item !== null) {
          const lastX = writer.doc.x;
          writer.writeText(
            `${item.title}:`,
            opts.source.color,
            opts.source.font,
            opts.source.fontSize,
            {
              align: 'left',
            }
          );
          writer.doc.x += 20;
          item.value.forEach((text) => {
            writer.writeText(
              text,
              opts.normalLine.color,
              opts.normalLine.font,
              opts.normalLine.fontSize + 2,
              {
                align: 'left',
              }
            );
          });
          writer.doc.moveDown();
          writer.doc.x = lastX;
          movedDown = false;
        }
      });
      writer.writePageFooterText('iResucitó');
    }

    return await writer.save();
  } catch (err) {
    console.log('ListPDFGenerator ERROR', err);
  }
  return '';
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
  bookTitle: { color: '#ff0000', font: 'medium', fontSize: 80 },
  bookSubtitle: { color: '#000000', font: 'regular', fontSize: 14 },
  indexTitle: { color: '#ff0000', font: 'medium', fontSize: 16 },
  indexText: { color: '#000000', font: 'regular', fontSize: 9.4 },
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  bookTitleSpacing: 10,
  indexMarginLeft: 25,
  songIndicatorSpacing: 21,
  disablePageNumbers: false,
};

export const getLocalizedListItem = (listKey: string): string => {
  return i18n.t(`list_item.${listKey}`);
};

export const getEsSalmoList = (
  listKey:
    | keyof LibreListForUI
    | keyof PalabraListForUI
    | keyof EucaristiaListForUI
): boolean => {
  return listKey === 'comunion-pan' || listKey === 'comunion-caliz';
};

export const getEsSalmo = (
  listKey:
    | keyof LibreListForUI
    | keyof PalabraListForUI
    | keyof EucaristiaListForUI
): boolean => {
  return (
    listKey === 'entrada' ||
    listKey === '1-salmo' ||
    listKey === '2-salmo' ||
    listKey === '3-salmo' ||
    listKey === 'paz' ||
    listKey === 'salida'
  );
};

export const getListTitleValue = (
  list: ListForUI,
  key:
    | keyof LibreListForUI
    | keyof PalabraListForUI
    | keyof EucaristiaListForUI,
  removeIfEmpty: boolean = false
): ListTitleValue | null => {
  if (list.hasOwnProperty(key)) {
    var valor = (list as any)[key];
    if (valor && getEsSalmo(key)) {
      valor = [valor.titulo];
    } else if (valor && getEsSalmoList(key)) {
      valor = valor.map((song: Song) => song.titulo);
    } else if (valor) {
      valor = [valor];
    } else {
      valor = ['-'];
    }
    if (!valor && removeIfEmpty) {
      return null;
    }
    return {
      title: getLocalizedListItem(key),
      value: valor,
    };
  }
  return null;
};
