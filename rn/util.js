// @flow
// Utilerias atadas a react-native
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import normalize from 'normalize-strings';
import { PdfWriter, pdfValues, PDFGenerator } from '../common';
import I18n from '../translations';
import { SongsProcessor } from '../SongsProcessor';
import { SongsParser } from '../SongsParser';
import { SongsExtras } from '../SongsExtras';

function checkContactsPermission(): Promise<boolean> {
  if (Platform.OS == 'android') {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS
    )
      .then(granted => {
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      })
      .catch(() => {
        return false;
      });
  }
  return Promise.resolve(true);
}

export function getContacts(): Promise<any> {
  return new Promise((resolve, reject) => {
    checkContactsPermission().then(hasPermission => {
      if (hasPermission) {
        Contacts.getAll((err, contacts) => {
          if (err) {
            reject(err);
          } else {
            resolve(contacts);
          }
        });
      } else {
        reject();
      }
    });
  });
}

export function ordenAlfabetico(a: any, b: any) {
  if (a.givenName < b.givenName) {
    return -1;
  }
  if (a.givenName > b.givenName) {
    return 1;
  }
  return 0;
}

export function ordenClasificacion(a: Song, b: Song) {
  if (a.rating < b.rating || (a.rating === undefined && b.rating)) {
    return 1;
  }
  if (a.rating > b.rating || (a.rating && b.rating === undefined)) {
    return -1;
  }
  return 0;
}

export function getContactsForImport(
  allContacts: Array<any>,
  importedContacts: Array<any>
): Array<any> {
  // Fitrar y generar contactos únicos
  var grouped = allContacts.reduce((groups, item) => {
    var fullname = `${item.givenName} ${item.familyName}`;
    groups[fullname] = groups[fullname] || [];
    groups[fullname].push(item);
    return groups;
  }, {});
  var unique = [];
  for (var fullname in grouped) {
    if (grouped[fullname].length > 1) {
      var conMiniatura = grouped[fullname].find(c => c.hasThumbnail === true);
      unique.push(conMiniatura || grouped[fullname][0]);
    } else {
      unique.push(grouped[fullname][0]);
    }
  }
  // De los únicos, marcar cuales ya estan importados
  var items = unique.map(c => {
    var found = importedContacts.find(x => x.recordID === c.recordID);
    c.imported = found !== undefined;
    return c;
  });
  items.sort(ordenAlfabetico);
  return items;
}

export function getEsSalmo(listKey: string): boolean {
  return (
    listKey == 'entrada' ||
    listKey == '1-salmo' ||
    listKey == '2-salmo' ||
    listKey == '3-salmo' ||
    listKey == 'paz' ||
    listKey == 'comunion-pan' ||
    listKey == 'comunion-caliz' ||
    listKey == 'salida'
  );
}

export function getFriendlyText(listKey: string): string {
  return I18n.t(`list_item.${listKey}`);
}

export function getFriendlyTextForListType(listType: string): string {
  switch (listType) {
    case 'eucaristia':
      return I18n.t('list_type.eucharist');
    case 'palabra':
      return I18n.t('list_type.word');
    case 'libre':
      return I18n.t('list_type.other');
    default:
      return '';
  }
}

export const getDefaultLocale = () => {
  return RNLocalize.getLocales()[0].languageTag;
};

var isTablet = DeviceInfo.isTablet();
var fontSizeTitulo = isTablet ? 25 : 22;
var fontSizeTexto = isTablet ? 17 : 15;
var fontSizeNotas = isTablet ? 15.2 : 12.5;

export const stylesObj: SongStyles = {
  titulo: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeTitulo,
    marginTop: 8,
    marginBottom: 4
  },
  fuente: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeTexto - 1,
    marginBottom: 8
  },
  lineaClamp: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas
  },
  lineaRepeat: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeTexto
  },
  lineaNotas: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginLeft: 4
  },
  lineaTituloNotaEspecial: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000'
  },
  lineaNotaEspecial: {
    fontFamily: 'Franklin Gothic Medium',
    fontSize: fontSizeNotas,
    color: '#444444'
  },
  lineaNotasConMargen: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginTop: 15,
    marginLeft: 4
  },
  lineaNormal: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeTexto,
    marginBottom: 8
  },
  prefijo: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeTexto
  },
  pageNumber: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeTexto
  }
};

export const NativeStyles = StyleSheet.create(stylesObj);

const BaseSongsPath =
  Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/songs` : 'songs';

const NativeSongsLoader =
  Platform.OS == 'ios' ? RNFS.readDir : RNFS.readDirAssets;

const NativeSongReader =
  Platform.OS == 'ios' ? RNFS.readFile : RNFS.readFileAssets;

export const NativeSongs = new SongsProcessor(
  BaseSongsPath,
  NativeSongsLoader,
  NativeSongReader
);

export const NativeExtras = new SongsExtras(
  RNFS.DocumentDirectoryPath,
  RNFS.exists,
  RNFS.writeFile,
  RNFS.readFile,
  RNFS.unlink
);

export const NativeParser = new SongsParser(NativeStyles);

export const contactFilterByText = (c: any, text: string) => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (c.familyName && c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};

class NativePdfWriter extends PdfWriter {
  doc: any;
  page: any;

  constructor(pdfPath: string) {
    super(
      pdfValues.marginTop,
      pdfValues.widthHeightPixels - pdfValues.marginTop * 2,
      NativeStyles.pageNumber.color,
      NativeStyles.titulo.color,
      NativeStyles.lineaNormal.color,
      NativeStyles.fuente.color,
      NativeStyles.lineaNotas.color,
      NativeStyles.prefijo.color,
      NativeStyles.lineaTituloNotaEspecial.color,
      NativeStyles.lineaNotaEspecial.color,
      NativeStyles.lineaRepeat.color
    );
    this.doc = PDFDocument.create(normalize(pdfPath));
  }

  checkLimitsCore(height: number) {
    return this.pos.y - height <= this.limiteHoja;
  }

  addPageToDocument() {
    this.doc.addPage(this.page);
  }

  createPage() {
    this.page = PDFPage.create().setMediaBox(
      pdfValues.widthHeightPixels,
      pdfValues.widthHeightPixels
    );
  }

  moveToNextLine(height: number) {
    this.pos.y -= height;
  }

  setNewColumnY(height: number) {
    this.resetY = this.pos.y - height;
  }

  async getCenteringX(text: string, font: string, size: number) {
    const sizeRes = await PDFLib.measureText(text, font, size);
    return parseInt((pdfValues.widthHeightPixels - sizeRes.width) / 2);
  }

  async getCenteringY(text: string, font: string, size: number) {
    const sizeRes = await PDFLib.measureText(text, font, size);
    return parseInt((pdfValues.widthHeightPixels - sizeRes.height) / 2);
  }

  async writeTextCore(
    text: string,
    color: any,
    font: string,
    size: number,
    xOffset?: number
  ): Promise<number> {
    const x = xOffset ? this.pos.x + xOffset : this.pos.x;
    this.page.drawText(text, {
      x: x,
      y: this.pos.y,
      color: color,
      fontSize: size,
      fontName: font
    });
    const sizeRes = await PDFLib.measureText(text, font, size);
    return sizeRes.width;
  }

  async save() {
    return await this.doc.write();
  }
}

export const generatePDF = async (
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions
) => {
  const docsDir =
    Platform.OS == 'ios'
      ? RNFS.TemporaryDirectoryPath
      : RNFS.CachesDirectoryPath + '/';
  const pdfPath =
    opts.createIndex && songsToPdf.length > 1
      ? `${docsDir}/iResucito.pdf`
      : `${docsDir}/${songsToPdf[0].song.titulo}.pdf`;

  var writer = new NativePdfWriter(pdfPath);

  return await PDFGenerator(songsToPdf, opts, writer);
};

export const generateMultiPagePDF = (
  songs: Array<Song>,
  opts: ExportToPdfOptions
) => {
  var items = songs.map<SongToPdf>(song => {
    return {
      song,
      render: NativeParser.getForRender(song.fullText, I18n.locale)
    };
  });

  return generatePDF(items, opts);
};
