import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Base64Encode } from 'base64-stream';
import {
  ExportToPdfOptions,
  PdfWriter,
  SongPDFGenerator,
  SongToPdf,
} from '@iresucito/core';

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const pdfPath = `${folder}/${filename}.pdf`;

  var font = null;
  if (opts.useTimesRomanFont === false) {
    font = Buffer.from(
      fs.readFileSync(
        path.resolve(
          __dirname + '/../public/build/_assets/Franklin Gothic Medium.ttf'
        ),
        'base64'
      ),
      'base64'
    );
  }
  var writer = new PdfWriter(font, new Base64Encode(), opts);
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  if (base64) {
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
