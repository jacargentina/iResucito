// Codigo para Node y Web
// Invalido para React-Native / Expo
import * as fs from 'fs';
import * as os from 'os';
import { Base64Encode } from 'base64-stream';
import { PdfStyle, SongStyles, SongToPdf } from './common';
import { PdfWriter, SongPDFGenerator } from './pdf';
import PDFDocument from 'pdfkit';

const regular = new URL(
  '../assets/fonts/FranklinGothicRegular.ttf',
  import.meta.url
);

const medium = new URL(
  '../assets/fonts/FranklinGothicMedium.ttf',
  import.meta.url
);

export async function generatePDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const pdfPath = `${folder}/${filename}.pdf`;

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
