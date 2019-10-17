// @flow
const Buffer = require('buffer').Buffer;
import { Platform } from 'react-native';
import { PdfWriter, PDFGenerator } from '../common';
import RNFS from 'react-native-fs';
import Base64Encode from './base64encode';

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  fileSuffix: string
) {
  const folder =
    Platform.OS === 'ios'
      ? RNFS.TemporaryDirectoryPath
      : RNFS.CachesDirectoryPath + '/';

  const pdfPath =
    songsToPdf.length > 1
      ? `${folder}/iResucito${fileSuffix}.pdf`
      : `${folder}/${songsToPdf[0].song.titulo}.pdf`;

  const reader = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
  const fontFolder = Platform.OS === 'ios' ? RNFS.MainBundlePath : 'fonts';
  const ttf = await reader(
    `${fontFolder}/Franklin Gothic Medium.ttf`,
    'base64'
  );

  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode());
  const base64 = await PDFGenerator(songsToPdf, opts, writer);
  RNFS.writeFile(pdfPath, base64, 'base64');
  return pdfPath;
}
