// @flow

declare type SongPatchData = {
  file?: string,
  rename?: string,
  lines?: string
};

declare type SongPatch = {
  [locale: string]: SongPatchData
};

declare type SongIndexPatch = {
  [key: string]: SongPatch
};

declare type SongRating = {
  [locale: string]: number
};

declare type SongRatingFile = {
  [key: string]: SongRating
};

declare type SongStyles = {
  titulo: any,
  fuente: any,
  lineaNotas: any,
  lineaTituloNotaEspecial: any,
  lineaNotaEspecial: any,
  lineaNotasConMargen: any,
  lineaNormal: any,
  prefijo: any
};

declare type SongLine = {
  texto: string,
  style: any,
  prefijo: string,
  prefijoStyle: any,
  sufijo: string,
  sufijoStyle: any,
  canto: boolean,
  cantoConIndicador: boolean,
  notas: boolean,
  inicioParrafo: boolean,
  notaEspecial: boolean,
  tituloEspecial: boolean,
  textoEspecial: boolean
};

// nombre: el nombre completo del archivo, sin la extension .txt
// titulo: el titulo del anto
// fuente: el origen del canto (salmo, palabra, etc)
declare type SongFile = {
  nombre: string,
  titulo: string,
  fuente: string
};

// key: la clave única del canto dentro del indice global de cantos
// nombre: el nombre completo del archivo, sin la extension .txt
// titulo: el titulo del anto
// fuente: el origen del canto (salmo, palabra, etc)
// path: el path completo al canto, incluyendo el locale, el nombre del archivo con la extension
// locale: el idioma del canto
// files: diccionario con todos los idiomas del canto
// fullText: el texto completo del canto
// lines: array de las lineas del canto
declare type Song = {
  key: string,
  stage: string,
  advent: boolean,
  christmas: boolean,
  lent: boolean,
  easter: boolean,
  pentecost: boolean,
  nombre: string,
  titulo: string,
  fuente: string,
  path: string,
  locale: string,
  files: any,
  fullText: string,
  lines: Array<string>,
  patchable?: boolean,
  patched?: boolean,
  patchedTitle?: string,
  error?: any,
  rating: number
};

declare type ExportToPdfOptions = {
  createIndex: boolean,
  pageNumbers: boolean
};

declare type ExportToPdfCoord = {
  x: number,
  y: number
};

declare type SongToPdf = {
  canto: Song,
  lines: Array<SongLine>
};

declare type SongRef = Song | SongFile;

declare type SearchParams = {
  filter: any,
  title_key?: string
};

declare type SearchItem = {
  title_key: string,
  divider?: boolean,
  note?: string,
  route?: string,
  params?: SearchParams,
  badge?: any,
  chooser?: string
};

declare type ListType = 'eucaristia' | 'palabra' | 'libre';
