// @flow

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

declare type SongFile = {
  nombre: string,
  titulo: string,
  fuente: string
};

declare type Song = {
  key: string,
  titulo: string,
  fuente: string,
  path: string,
  nombre: string,
  files: any,
  fullText: string,
  lines: Array<string>,
  patchable?: boolean,
  patched?: boolean,
  patchedTitle?: string,
  error?: any
};

declare type SongRef = Song | SongFile;

declare type SearchParams = {
  filter: any,
  title?: string
};

declare type SearchItem = {
  title: string,
  divider?: boolean,
  note?: string,
  route?: string,
  params?: SearchParams,
  badge?: any,
  chooser?: string
};

declare type ListType = 'eucaristia' | 'palabra' | 'libre';
