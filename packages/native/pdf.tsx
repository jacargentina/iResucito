import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import {
  ListToPdf,
  SongToPdf,
  PdfStyle,
  SongStyles,
  PdfWriter,
  SongPDFGenerator,
  ListPDFGenerator,
} from '@iresucito/core';
import Base64Encode from './base64encode';
// Por errores de compilacion ya que
// pdfkit es modulo esm para NodeJS y NO para expo/react-native
// se utiliza mediante require la libreria "standalone" que se puede
// cargar sin problemas
const PDFDocument = require('pdfkit/js/pdfkit.standalone');
const Buffer = require('buffer').Buffer;

export type GeneratePDFResult = {
  uri: string;
  base64: string;
};

export async function generateSongPDF(
  songsToPdf: Array<SongToPdf<PdfStyle>>,
  opts: SongStyles<PdfStyle>,
  filename: string,
  addIndex: boolean
): Promise<GeneratePDFResult> {
  const safeFileName = filename.replace('/', '-');
  const pdfPath = `${FileSystem.cacheDirectory}${safeFileName}.pdf`;
  const [{ localUri: mediumUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicMedium.ttf')
  );
  const medium = await FileSystem.readAsStringAsync(mediumUri as string, {
    encoding: 'base64',
  });
  const [{ localUri: regularUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicRegular.ttf')
  );
  const regular = await FileSystem.readAsStringAsync(regularUri as string, {
    encoding: 'base64',
  });
  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(regular, 'base64'),
    Buffer.from(medium, 'base64'),
    new Base64Encode({}),
    opts
  );
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return { uri: pdfPath, base64 };
}

export async function generateListPDF(
  list: ListToPdf,
  opts: SongStyles<PdfStyle>
): Promise<GeneratePDFResult> {
  const safeFileName = list.name.replace('/', '-');
  const pdfPath = `${FileSystem.cacheDirectory}/${safeFileName}.pdf`;
  const [{ localUri: mediumUri }] = await Asset.loadAsync(
    require('@iresucito/core/assets/fonts/FranklinGothicMedium.ttf')
  );
  const medium = await FileSystem.readAsStringAsync(mediumUri as string, {
    encoding: 'base64',
  });
  const [{ localUri: regularUri }] = await Asset.loadAsync(
    require('@iresucito/core/assets/fonts/FranklinGothicRegular.ttf')
  );
  const regular = await FileSystem.readAsStringAsync(regularUri as string, {
    encoding: 'base64',
  });
  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(regular, 'base64'),
    Buffer.from(medium, 'base64'),
    new Base64Encode({}),
    opts
  );
  const base64 = await ListPDFGenerator(list, opts, writer);
  FileSystem.writeAsStringAsync(pdfPath, base64, { encoding: 'base64' });
  return { uri: pdfPath, base64 };
}
