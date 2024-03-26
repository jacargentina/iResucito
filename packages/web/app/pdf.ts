import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Base64Encode } from 'base64-stream';
import {
  PdfStyle,
  PdfWriter,
  SongPDFGenerator,
  SongStyles,
  SongToPdf,
} from '@iresucito/core';

export async function generatePDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const pdfPath = `${folder}/${filename}.pdf`;

  var regular = null;
  var medium = null;
  if (opts.useTimesRomanFont === false) {
    regular = Buffer.from(
      fs.readFileSync(
        path.resolve(
          __dirname + '/../public/build/_assets/FranklinGothicRegular.ttf'
        ),
        'base64'
      ),
      'base64'
    );
    medium = Buffer.from(
      fs.readFileSync(
        path.resolve(
          __dirname + '/../public/build/_assets/FranklinGothicMedium.ttf'
        ),
        'base64'
      ),
      'base64'
    );
  }
  var writer = new PdfWriter(regular, medium, new Base64Encode(), opts);
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  if (base64) {
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
