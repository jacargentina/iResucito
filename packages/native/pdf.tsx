import * as FileSystem from 'expo-file-system';
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

export async function generateSongPDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  filename: string,
  addIndex: boolean
): Promise<string> {
  const folder = FileSystem.cacheDirectory;

  const safeFileName = filename.replace('/', '-');
  const pdfPath = `${folder}/${safeFileName}.pdf`;

  const reader = FileSystem.readAsStringAsync;
  const fontFolder = FileSystem.bundledAssets;
  const ttf = await reader(
    `${fontFolder}/Franklin Gothic Medium.ttf`,
    'base64'
  );

  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode({}));
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return pdfPath;
}

export async function generateListPDF(
  list: ListToPdf,
  opts: ExportToPdfOptions
): Promise<string> {
  const folder = FileSystem.cacheDirectory;

  const safeFileName = list.name.replace('/', '-');
  const pdfPath = `${folder}/${safeFileName}.pdf`;

  const reader = FileSystem.readAsStringAsync;
  const fontFolder = FileSystem.bundledAssets;
  const ttf = await reader(
    `${fontFolder}/Franklin Gothic Medium.ttf`,
    'base64'
  );

  var writer = new PdfWriter(Buffer.from(ttf, 'base64'), new Base64Encode({}));
  const base64 = await ListPDFGenerator(list, opts, writer);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return pdfPath;
}
