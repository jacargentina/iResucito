// Codigo para Node y Web
// Invalido para React-Native / Expo
import * as fs from 'fs';
import * as os from 'os';
import { Base64Encode } from 'base64-stream';
import {
  PdfWriter,
  SongPDFGenerator,
  PdfStyle,
  SongStyles,
  SongToPdf,
} from '@iresucito/core';
import PDFDocument from 'pdfkit';

export async function generatePDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const pdfPath = `${folder}/${filename}.pdf`;

  const regularPath = process.env.VERCEL_ENV
    ? './FranklinGothicRegular.ttf'
    : 'public/FranklinGothicRegular.ttf';
  const mediumPath = process.env.VERCEL_ENV
    ? './FranklinGothicRegular.ttf'
    : 'public/FranklinGothicRegular.ttf';

  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(fs.readFileSync(regularPath)),
    Buffer.from(fs.readFileSync(mediumPath)),
    new Base64Encode(),
    opts
  );
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  if (base64) {
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
