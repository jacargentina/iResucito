import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import {
  PdfWriter,
  SongPDFGenerator,
  ListPDFGenerator,
  ListToPdf,
  SongToPdf,
  ExportToPdfOptions,
} from '@iresucito/core';
import Base64Encode from './base64encode';
const Buffer = require('buffer').Buffer;

export type GeneratePDFResult = {
  uri: string;
  base64: string;
};

export async function generateSongPDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  filename: string,
  addIndex: boolean
): Promise<GeneratePDFResult> {
  const safeFileName = filename.replace('/', '-');
  const pdfPath = `${FileSystem.cacheDirectory}${safeFileName}.pdf`;
  const [{ localUri }] = await Asset.loadAsync(
    require('@iresucito/core/assets/fonts/FranklinGothicMedium.ttf')
  );
  const ttf = await FileSystem.readAsStringAsync(localUri as string, {
    encoding: 'base64',
  });
  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode({}));
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return { uri: pdfPath, base64 };
}

export async function generateListPDF(
  list: ListToPdf,
  opts: ExportToPdfOptions
): Promise<GeneratePDFResult> {
  const safeFileName = list.name.replace('/', '-');
  const pdfPath = `${FileSystem.cacheDirectory}/${safeFileName}.pdf`;
  const [{ localUri }] = await Asset.loadAsync(
    require('@iresucito/core/assets/fonts/FranklinGothicMedium.ttf')
  );
  const ttf = await FileSystem.readAsStringAsync(localUri as string, {
    encoding: 'base64',
  });
  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode({}));
  const base64 = await ListPDFGenerator(list, opts, writer);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return { uri: pdfPath, base64 };
}
