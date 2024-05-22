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

export async function generatePDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  var r, m: ArrayBuffer;

  if (process.env.VERCEL_URL) {
    const regularFetch = await fetch(
      `https://${process.env.VERCEL_URL}/FranklinGothicRegular.ttf`
    );
    r = await regularFetch.arrayBuffer();
    const mediumFetch = await fetch(
      `https://${process.env.VERCEL_URL}/FranklinGothicMedium.ttf`
    );
    m = await mediumFetch.arrayBuffer();
  } else {
    r = fs.readFileSync(path.resolve('./public/FranklinGothicRegular.ttf'));
    m = fs.readFileSync(path.resolve('./public/FranklinGothicMedium.ttf'));
  }
  var writer = new PdfWriter(PDFDocument, r, m, new Base64Encode(), opts);
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  if (base64) {
    const folder = os.tmpdir();
    const pdfPath = `${folder}/${filename}.pdf`;
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
