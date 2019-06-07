// @flow
const Buffer = require('buffer').Buffer;
import { Platform } from 'react-native';
import { PdfWriter, PDFGenerator } from '../common';
import RNFS from 'react-native-fs';
import Base64Encode from './base64encode';

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions
) {
  const folder =
    Platform.OS == 'ios'
      ? RNFS.TemporaryDirectoryPath
      : RNFS.CachesDirectoryPath + '/';

  const pdfPath = opts.createIndex
    ? `${folder}/iResucito${opts.fileSuffix}.pdf`
    : `${folder}/${songsToPdf[0].song.titulo}.pdf`;

  const ttf = await RNFS.readFile(
    RNFS.MainBundlePath + '/Franklin Gothic Medium.ttf',
    'base64'
  );

  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode());
  const base64 = await PDFGenerator(songsToPdf, opts, writer);
  RNFS.writeFile(pdfPath, base64, 'base64');
  return pdfPath;
}
