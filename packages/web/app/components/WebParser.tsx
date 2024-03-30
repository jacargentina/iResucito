import { SongStyles, SongsParser } from '@iresucito/core';

const FontSizes = {
  Notas: '10pt',
  Texto: '12pt',
  Titulo: '19pt',
  Fuente: '10pt',
};

export class WebStyle {
  color?: string;
  fontSize?: string;
  marginBottom?: number;
}

export const WebStyles: SongStyles<WebStyle> = {
  empty: {},
  title: { color: '#ff0000', fontSize: FontSizes.Titulo },
  source: { color: '#777777', fontSize: FontSizes.Fuente, marginBottom: 16 },
  clampLine: { color: '#ff0000', fontSize: FontSizes.Notas, marginBottom: 16 },
  indicator: { color: '#ff0000', fontSize: FontSizes.Texto },
  notesLine: { color: '#ff0000', fontSize: FontSizes.Notas },
  specialNoteTitle: { color: '#ff0000', fontSize: FontSizes.Texto },
  specialNote: { color: '#444444', fontSize: FontSizes.Texto },
  normalLine: { color: '#000000', fontSize: FontSizes.Texto },
  pageNumber: { color: '#000000' },
  normalPrefix: { color: '#777777', fontSize: FontSizes.Texto },
  assemblyLine: { color: '#777777', fontSize: FontSizes.Texto },
  assemblyPrefix: { color: '#777777', fontSize: FontSizes.Texto },
  pageFooter: { color: '#777777', fontSize: FontSizes.Texto },
  indexTitle: { color: '#777777', fontSize: FontSizes.Texto },
  bookSubtitle: { color: '#777777', fontSize: FontSizes.Texto },
  bookTitle: { color: '#777777', fontSize: FontSizes.Texto },
  indexText: { color: '#777777', fontSize: FontSizes.Texto },
  disablePageNumbers: false,
  marginLeft: 0,
  marginTop: 0,
  widthHeightPixels: 0,
  bookTitleSpacing: 0,
  songIndicatorSpacing: 0,
  indexMarginLeft: 0,
};

export const WebParser = new SongsParser(WebStyles);
