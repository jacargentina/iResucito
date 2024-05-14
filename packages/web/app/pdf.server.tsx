// Codigo para Node y Web
// Invalido para React-Native / Expo
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Base64Encode } from 'base64-stream';
import {
  PdfWriter,
  SongPDFGenerator,
  PdfStyle,
  SongStyles,
  SongToPdf,
} from '@iresucito/core';
import PDFDocument from 'pdfkit';

function getPath(url: string) {
  let result = new URL(url);
  let pathname = result.pathname;
  let pathArray = pathname.split('/');
  let basename = pathArray.pop();
  let dirname = pathArray.join('/');

  return { pathname, dirname, basename };
}

export async function generatePDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const pdfPath = `${folder}/${filename}.pdf`;

  // packages/web/app
  const { dirname } = getPath(import.meta.url);

  // packages/web
  const base = path.dirname(dirname);

  const regular = path.resolve(`${base}/public/FranklinGothicRegular.ttf`);
  const medium = path.resolve(`${base}/public/FranklinGothicMedium.ttf`);

  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(fs.readFileSync(regular)),
    Buffer.from(fs.readFileSync(medium)),
    new Base64Encode(),
    opts
  );
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  if (base64) {
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
