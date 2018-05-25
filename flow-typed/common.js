// @flow

declare type SongLine = {
  texto: string,
  prefijo: string,
  style: any,
  prefijoStyle: any,
  canto: boolean,
  cantoConIndicador: boolean,
  notas: boolean,
  notasCantoConIndicador: boolean,
  notaEspecial: boolean,
  tituloEspecial: boolean
};

declare type Song = {
  titulo: string,
  fuente: string,
  path: string,
  nombre: string,
  fullText: string,
  lines: Array<SongLine>,
  locale: string
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
