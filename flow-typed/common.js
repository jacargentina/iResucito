// @flow

declare var __DEV__: string;

declare type PickerLocale = {
  label: string,
  value: string,
};

declare type SongPatchLogData = {
  date: number,
  author: string,
  locale: string,
  linked?: {
    new: string,
  },
  rename?: {
    original?: string,
    new?: string,
  },
  created: boolean,
  updated: boolean,
};

declare type SongPatchLog = {
  [key: string]: Array<SongPatchLogData>,
};

declare type SongPatchData = {
  author: string,
  date: number,
  file?: string,
  rename?: string,
  stage?: string,
  lines?: string,
};

declare type SongPatch = {
  [locale: string]: SongPatchData,
};

declare type SongIndexPatch = {
  [key: string]: SongPatch,
};

declare type SongRating = {
  [locale: string]: number,
};

declare type SongRatingFile = {
  [key: string]: SongRating,
};

declare type SongStyles = {
  title: any,
  source: any,
  clampLine: any,
  indicator: any,
  notesLine: any,
  specialNoteTitle: any,
  specialNote: any,
  normalLine: any,
  pageNumber: any,
  prefix: any,
};

declare type SongLineType =
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

declare type SongLine = {
  raw: string,
  texto: string,
  style: any,
  prefijo: string,
  prefijoStyle: any,
  sufijo: string,
  sufijoStyle: any,
  type: SongLineType,
};

declare type SongIndicator = {
  start: number,
  end: number,
  type: SongLineType,
};

declare type SongRendering = {
  items: Array<SongLine>,
  indicators: Array<SongIndicator>,
};

// nombre: el nombre completo del archivo, sin la extension .txt
// titulo: el titulo del anto
// fuente: el origen del canto (salmo, palabra, etc)
declare type SongFile = {
  nombre: string,
  titulo: string,
  fuente: string,
};

// key: la clave única del canto dentro del indice global de cantos
// nombre: el nombre completo del archivo, sin la extension .txt
// titulo: el titulo del anto
// fuente: el origen del canto (salmo, palabra, etc)
// path: el path completo al canto, incluyendo el locale, el nombre del archivo con la extension
// files: diccionario con todos los idiomas del canto
// fullText: el texto completo del canto
// lines: array de las lineas del canto
declare type Song = {
  key: string,
  version: number,
  notTranslated: boolean,
  stage: string,
  advent: boolean,
  christmas: boolean,
  lent: boolean,
  easter: boolean,
  pentecost: boolean,
  'signing to the virgin': boolean,
  "children's songs": boolean,
  'lutes and vespers': boolean,
  entrance: boolean,
  'peace and offerings': boolean,
  'fraction of bread': boolean,
  communion: boolean,
  exit: boolean,
  nombre: string,
  titulo: string,
  fuente: string,
  path: string,
  files: { [string]: string },
  stages?: { [string]: string },
  fullText: string,
  patched?: boolean,
  patchedTitle?: string,
  added?: boolean,
  error?: any,
  rating: number,
};

declare type ExportToPdfOptions = {
  useTimesRomanFont: boolean,
  marginLeft: number,
  marginTop: number,
  widthHeightPixels: number,
  songTitle: { FontSize: number },
  songSource: { FontSize: number },
  songText: { FontSize: number },
  songNote: { FontSize: number },
  songIndicatorSpacing: number,
  songParagraphSpacing: number,
  indexTitle: { FontSize: number },
  bookTitle: { FontSize: number, Spacing: number },
  bookSubtitle: { FontSize: number },
  indexText: { FontSize: number },
  indexMarginLeft: number,
  disablePageNumbers: boolean,
};

declare type ListSongGroup = {
  [string]: Array<ListSongItem>,
};

declare type ListSongItem = {
  songKey: string,
  str: string,
};

declare type ListSongPos = {
  page: number,
  songKey: string,
  x: number,
  y: number,
  value: number,
};

declare type ExportToPdfLimits = {
  x: number,
  y: number,
  w: number,
  h: number,
};

declare type ExportToPdfLineText = {
  page: number,
  x: number,
  startY: number,
  endY: number,
  text: string,
  color: any,
};

declare type SongToPdf = {
  song: Song,
  render: SongRendering,
};

declare type SongRef = Song | SongFile;

declare type SearchParams = {
  filter: any,
  title_key?: string,
};

declare type SearchItem = {
  title_key: string,
  divider?: boolean,
  note?: string,
  route?: string,
  params?: SearchParams,
  badge?: any,
  chooser?: string,
};

declare type ListType = 'eucaristia' | 'palabra' | 'libre';

declare type ListToPdf = {
  name: string,
  type: ListType,
  localeType: string,
  items: Array<any>,
};
