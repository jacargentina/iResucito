// @flow
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { PdfWriter, SongPDFGenerator, ListPDFGenerator } from '@iresucito/core/common';
import Base64Encode from './base64encode';
const Buffer = require('buffer').Buffer;

export async function generateSongPDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  fileSuffix: string
): Promise<string> {
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
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer);
  RNFS.writeFile(pdfPath, base64, 'base64');
  return pdfPath;
}

export async function generateListPDF(
  list: ListToPdf,
  opts: ExportToPdfOptions
): Promise<string> {
  const folder =
    Platform.OS === 'ios'
      ? RNFS.TemporaryDirectoryPath
      : RNFS.CachesDirectoryPath + '/';

  const pdfPath = `${folder}/iResucito-${list.name}.pdf`;

  const reader = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
  const fontFolder = Platform.OS === 'ios' ? RNFS.MainBundlePath : 'fonts';
  const ttf = await reader(
    `${fontFolder}/Franklin Gothic Medium.ttf`,
    'base64'
  );

  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode());
  const base64 = await ListPDFGenerator(list, opts, writer);
  RNFS.writeFile(pdfPath, base64, 'base64');
  return pdfPath;
}
