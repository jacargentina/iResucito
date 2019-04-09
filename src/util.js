// @flow
import langs from 'langs';
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import I18n from './translations';
import { SongsProcessor, calcularTransporte } from './SongsProcessor';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

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

export const getLocalesForPicker = () => {
  var locales = [
    {
      label: `${I18n.t('ui.default')} (${getDefaultLocale()})`,
      value: 'default'
    }
  ];
  for (var code in I18n.translations) {
    var l = langs.where('1', code.split('-')[0]);
    locales.push({ label: `${l.local} (${code})`, value: code });
  }
  return locales;
};

var mono = Platform.OS == 'ios' ? 'Menlo-Bold' : 'monospace';
var isTablet = DeviceInfo.isTablet();
var fontSizeTitulo = isTablet ? 25 : 20;
var fontSizeTexto = isTablet ? 17 : 14;
var fontSizeNotas = isTablet ? 15.2 : 12.2;

export const stylesObj: SongStyles = {
  titulo: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeTitulo,
    marginTop: 8,
    marginBottom: 4
  },
  fuente: {
    fontFamily: mono,
    color: '#777777',
    fontSize: fontSizeTexto - 1,
    marginBottom: 8
  },
  lineaNotas: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginLeft: 4
  },
  lineaTituloNotaEspecial: {
    fontFamily: mono,
    color: '#ff0000'
  },
  lineaNotaEspecial: {
    fontFamily: mono,
    fontSize: fontSizeNotas,
    color: '#444444'
  },
  lineaNotasConMargen: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginTop: 15,
    marginLeft: 4
  },
  lineaNormal: {
    fontFamily: mono,
    color: '#000000',
    fontSize: fontSizeTexto,
    marginBottom: 8
  },
  prefijo: {
    fontFamily: mono,
    color: '#777777',
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
  NativeSongReader,
  NativeStyles
);

export const getSalmoTransported = (song: Song, transportToNote: any) => {
  var diferencia = 0;
  if (transportToNote) {
    diferencia = calcularTransporte(
      song.lines[0],
      transportToNote,
      song.locale
    );
  }
  return NativeSongs.preprocesarCanto(song, diferencia);
};

export const contactFilterByText = (c: any, text: string) => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (c.familyName && c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};

export const getSongFileFromString = (str: string): SongFile => {
  var titulo = str.includes(' - ')
    ? str.substring(0, str.indexOf(' - ')).trim()
    : str;
  var fuente =
    titulo !== str ? str.substring(str.indexOf(' - ') + 3).trim() : '';
  var nombre = str.replace('.txt', '');
  return {
    nombre: nombre,
    titulo: titulo,
    fuente: fuente
  };
};

var titleFontSize = 19;
var titleSpacing = 11;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 11;
var fontName = 'Franklin Gothic Medium';
var indicadorSpacing = 18;
var parrafoSpacing = 9;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var primerColumnaX = 30;
var segundaColumnaX = 330;

export const generatePDF = (canto: Song, lines: Array<SongLine>) => {
  // Para centrar titulo
  return PDFLib.measureText(
    canto.titulo.toUpperCase(),
    fontName,
    titleFontSize
  ).then(sizeTitle => {
    // Para centrar fuente
    return PDFLib.measureText(canto.fuente, fontName, fuenteFontSize)
      .then(sizeFuente => {
        var y = 560;
        var x = primerColumnaX;
        const page1 = PDFPage.create().setMediaBox(
          widthHeightPixels,
          widthHeightPixels
        );
        var titleX = parseInt((widthHeightPixels - sizeTitle.width) / 2);
        page1.drawText(canto.titulo.toUpperCase(), {
          x: titleX,
          y: y,
          color: NativeStyles.titulo.color,
          fontSize: titleFontSize,
          fontName: fontName
        });
        y -= titleSpacing;
        var fuenteX = parseInt((widthHeightPixels - sizeFuente.width) / 2);
        page1.drawText(canto.fuente, {
          x: fuenteX,
          y: y,
          color: NativeStyles.lineaNormal.color,
          fontSize: fuenteFontSize,
          fontName: fontName
        });
        y -= fuenteSpacing;
        var yStart = y - parrafoSpacing;
        lines.forEach((it: SongLine) => {
          if (it.inicioParrafo) {
            y -= parrafoSpacing;
          }
          if (it.tituloEspecial) {
            y -= parrafoSpacing * 2;
          }
          var limiteHoja = 21;
          var alturaExtra = 0;
          if (it.notas) {
            alturaExtra = cantoSpacing;
          }
          if (y - alturaExtra <= limiteHoja) {
            x = segundaColumnaX;
            y = yStart;
          }
          if (it.notas === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: NativeStyles.lineaNotas.color,
              fontSize: notesFontSize,
              fontName: fontName
            });
            y -= cantoSpacing;
          } else if (it.canto === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: NativeStyles.lineaNormal.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
            y -= cantoSpacing;
          } else if (it.cantoConIndicador === true) {
            page1.drawText(it.prefijo, {
              x: x,
              y: y,
              color: NativeStyles.prefijo.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
            if (it.tituloEspecial === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaTituloNotaEspecial.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
            } else if (it.textoEspecial === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaNotaEspecial.color,
                fontSize: cantoFontSize - 3,
                fontName: fontName
              });
            } else {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaNormal.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
            }
            y -= cantoSpacing;
          }
          // else {
          //   console.log('Sin dibujar en', y, JSON.stringify(it));
          // }
        });
        const docsDir =
          Platform.OS == 'ios'
            ? RNFS.TemporaryDirectoryPath
            : RNFS.CachesDirectoryPath + '/';
        const pdfPath = `${docsDir}${canto.titulo}.pdf`;
        return PDFDocument.create(pdfPath)
          .addPages(page1)
          .write();
      })
      .catch(err => {
        console.log('ERROR Measures', err);
      });
  });
};
