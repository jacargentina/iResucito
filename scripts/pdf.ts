import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Base64Encode } from 'base64-stream';
import { PdfWriter, SongPDFGenerator } from '../common';

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  fileSuffix: string
): Promise<string | undefined> {
  const folder = os.tmpdir();
  const runningPath = path.basename(process.cwd());
  const fontPath =
    runningPath === 'webapp'
      ? path.resolve('../../assets/fonts/Franklin Gothic Medium.ttf')
      : './assets/fonts/Franklin Gothic Medium.ttf';
  console.log({ runningPath, fontPath });
  const pdfPath =
    songsToPdf.length > 1
      ? `${folder}/iResucito${fileSuffix}.pdf`
      : `${folder}/${songsToPdf[0].song.titulo}.pdf`;

  var font = null;
  if (opts.useTimesRomanFont === false) {
    font = Buffer.from(fs.readFileSync(fontPath, 'base64'), 'base64');
  }

  var writer = new PdfWriter(font, new Base64Encode(), opts);
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer);
  if (base64) {
    // eslint-disable-next-line no-undef
    fs.writeFileSync(pdfPath, Buffer.from(base64, 'base64'));
    return pdfPath;
  }
}
