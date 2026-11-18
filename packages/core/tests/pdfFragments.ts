// Test helper: generates a PDF with the production fonts and records every
// text fragment pdfkit draws (page, position and size).
import { readFileSync } from 'fs';
import { join } from 'path';
import { PassThrough } from 'stream';
import PDFDocument from 'pdfkit';
import i18n from '@iresucito/translations';
import {
  PdfStyles,
  PdfWriter,
  SongPDFGenerator,
  SongsParser,
  type PdfStyle,
  type Song,
  type SongToPdf,
} from '../src';

export type Fragment = {
  page: number;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PdfSongInput = {
  key: string;
  titulo: string;
  fuente: string;
  source: string;
};

const fontsDir = join(__dirname, '..', '..', 'web', 'public');

export const describeFragment = (f: Fragment) =>
  `p${f.page} (${Math.round(f.x)},${Math.round(f.y)}) w${Math.round(f.w)} "${f.text}"`;

export const renderPdfFragments = async (
  songs: PdfSongInput[],
  locale: string,
  addIndex = false
) => {
  i18n.locale = locale;
  const parser = new SongsParser(PdfStyles);
  const songsToPdf: SongToPdf<PdfStyle>[] = songs.map(
    ({ key, titulo, fuente, source }) => ({
      song: { key, titulo, fuente } as Song,
      render: parser.getForRender(source, locale),
    })
  );

  const writer = new PdfWriter(
    PDFDocument,
    readFileSync(join(fontsDir, 'FranklinGothicRegular.ttf')),
    readFileSync(join(fontsDir, 'FranklinGothicMedium.ttf')),
    new PassThrough(),
    PdfStyles
  );

  const fragments: Fragment[] = [];
  const doc = writer.doc as any;
  const original = doc._fragment;
  doc._fragment = function (text: string, x: number, y: number, options: any) {
    fragments.push({
      page: this._pageBuffer.indexOf(this.page),
      text,
      x,
      y,
      w: this.widthOfString(text, options),
      h: this.currentLineHeight(true),
    });
    return original.call(this, text, x, y, options);
  };

  const pdf = await SongPDFGenerator(songsToPdf, PdfStyles, writer, addIndex);
  return { pdf, writer, fragments };
};
