import { SongStyles, SongsParser } from '@iresucito/core';

const FontSizes = {
  Notas: '7.8pt',
  TextoNormal: '12pt',
  TextoAsamblea: '16pt',
  Titulo: '19pt',
  Fuente: '10pt',
};

export type WebStyle = {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  letterSpacing?: string;
  marginBottom?: number;
};

export const WebStyles: SongStyles<WebStyle> = {
  empty: {},
  title: {
    color: '#ff0000',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.Titulo,
  },
  source: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.Fuente,
    marginBottom: 16,
  },
  clampLine: {
    color: '#ff0000',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.Notas,
    marginBottom: 16,
  },
  indicator: {
    color: '#ff0000',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoNormal,
  },
  notesLine: {
    color: '#ff0000',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.Notas,
    letterSpacing: '-1px',
  },
  specialNoteTitle: {
    color: '#ff0000',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoNormal,
  },
  specialNote: {
    color: '#444444',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.TextoNormal,
  },
  normalLine: {
    color: '#000000',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.TextoNormal,
  },
  pageNumber: { color: '#000000', fontFamily: 'Franklin Gothic Regular' },
  normalPrefix: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.TextoNormal,
  },
  assemblyLine: {
    color: '#333333',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoAsamblea,
  },
  assemblyPrefix: {
    color: '#333333',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoAsamblea,
  },
  pageFooter: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.TextoNormal,
  },
  indexTitle: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoNormal,
  },
  bookSubtitle: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Regular',
    fontSize: FontSizes.TextoNormal,
  },
  bookTitle: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoNormal,
  },
  indexText: {
    color: '#777777',
    fontFamily: 'Franklin Gothic Medium',
    fontSize: FontSizes.TextoNormal,
  },
  disablePageNumbers: false,
  marginLeft: 0,
  marginTop: 0,
  widthHeightPixels: 0,
  bookTitleSpacing: 0,
  songIndicatorSpacing: 0,
  indexMarginLeft: 0,
};

export const WebParser = new SongsParser(WebStyles);
