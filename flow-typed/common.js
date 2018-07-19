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

declare type Song = {
  titulo: string,
  fuente: string,
  path: string,
  nombre: string,
  fullText: string,
  lines: Array<string>,
  locale: string,
  error?: any
};

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
