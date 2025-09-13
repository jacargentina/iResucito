import { File, Paths } from 'expo-file-system';
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
  const pdfPath = `${Paths.cache}${safeFileName}.pdf`;
  const [{ localUri: mediumUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicMedium.ttf')
  );
  const medium = await new File(mediumUri as string).base64();
  const [{ localUri: regularUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicRegular.ttf')
  );
  const regular = await new File(regularUri as string).base64();
  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(regular, 'base64'),
    Buffer.from(medium, 'base64'),
    new Base64Encode({}),
    opts
  );
  const base64 = await SongPDFGenerator(songsToPdf, opts, writer, addIndex);
  new File(pdfPath).write(base64);
  return { uri: pdfPath, base64 };
}

export async function generateListPDF(
  list: ListToPdf,
  opts: SongStyles<PdfStyle>
): Promise<GeneratePDFResult> {
  const safeFileName = list.name.replace('/', '-');
  const pdfPath = `${Paths.cache}/${safeFileName}.pdf`;
  const [{ localUri: mediumUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicMedium.ttf')
  );
  const medium = await new File(mediumUri as string).base64();
  const [{ localUri: regularUri }] = await Asset.loadAsync(
    require('./fonts/FranklinGothicRegular.ttf')
  );
  const regular = await new File(regularUri as string).base64();
  var writer = new PdfWriter(
    PDFDocument,
    Buffer.from(regular, 'base64'),
    Buffer.from(medium, 'base64'),
    new Base64Encode({}),
    opts
  );
  const base64 = await ListPDFGenerator(list, opts, writer);
  new File(pdfPath).write(base64);
  return { uri: pdfPath, base64 };
}
