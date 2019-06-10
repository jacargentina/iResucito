// @flow
import * as fs from 'fs';
import * as os from 'os';
import { PdfWriter, PDFGenerator } from '../common';
import { Base64Encode } from 'base64-stream';

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  fileSuffix: string
) {
  const folder = os.tmpdir();

  const pdfPath =
    songsToPdf.length > 1
      ? `${folder}/iResucito${fileSuffix}.pdf`
      : `${folder}/${songsToPdf[0].song.titulo}.pdf`;

  var font = null;
  if (opts.useTimesRomanFont === false) {
    var font = Buffer.from(
      fs.readFileSync('./assets/fonts/Franklin Gothic Medium.ttf', 'base64'),
      'base64'
    );
  }

  var writer = new PdfWriter(font, new Base64Encode(), opts);
  const base64 = await PDFGenerator(songsToPdf, opts, writer);
  if (base64) {
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
