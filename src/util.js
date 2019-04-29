// @flow
// Utilerias atadas a react-native
import langs from 'langs';
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import I18n from './translations';
import { SongsProcessor } from './SongsProcessor';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import normalize from 'normalize-strings';
import {
  asyncForEach,
  getAlphaWithSeparators,
  wayStages,
  getGroupedByStage,
  liturgicTimes,
  getGroupedByLiturgicTime,
  liturgicOrder,
  getGroupedByLiturgicOrder,
  pdfValues
} from './common';

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

export const contactFilterByText = (c: any, text: string) => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (c.familyName && c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};

var primerFilaY = pdfValues.widthHeightPixels - pdfValues.marginTop * 2;
var limiteHoja = pdfValues.marginTop;
var pageNumber = 1;

const getNewPage = () => {
  return PDFPage.create().setMediaBox(
    pdfValues.widthHeightPixels,
    pdfValues.widthHeightPixels
  );
};

const writePageNumber = (page: any) => {
  page.drawText(pageNumber.toString(), {
    x: pdfValues.widthHeightPixels / 2,
    y: limiteHoja,
    color: NativeStyles.lineaNormal.color,
    fontSize: pdfValues.songText.FontSize,
    fontName: pdfValues.fontName
  });
};

export const generateListing = async (
  doc: any,
  page: any,
  pos: ExportToPdfCoord,
  title: string,
  items: any,
  pageTitle?: string
): any => {
  var resetY = primerFilaY;
  var currPage = page;

  const checkLimits = (height: number) => {
    if (pos.y - height <= limiteHoja) {
      if (pos.x == pdfValues.segundaColumnaIndexX) {
        writePageNumber(currPage);
        doc.addPage(currPage);
        pageNumber++;
        pos.x = pdfValues.primerColumnaIndexX;
        resetY = primerFilaY;
        currPage = getNewPage();
      } else {
        pos.x = pdfValues.segundaColumnaIndexX;
      }
      pos.y = resetY;
    }
  };

  if (pageTitle) {
    const height = pdfValues.indexTitle.FontSize + pdfValues.indexTitle.Spacing;
    checkLimits(height);
    const sizeTitle = await PDFLib.measureText(
      pageTitle.toUpperCase(),
      pdfValues.fontName,
      pdfValues.indexTitle.FontSize
    );
    var titleX = parseInt((pdfValues.widthHeightPixels - sizeTitle.width) / 2);
    currPage.drawText(pageTitle.toUpperCase(), {
      x: titleX,
      y: pos.y,
      color: NativeStyles.titulo.color,
      fontSize: pdfValues.indexTitle.FontSize,
      fontName: pdfValues.fontName
    });
    pos.y -= height;
    resetY = pos.y;
  }
  const height =
    pdfValues.indexSubtitle.FontSize + pdfValues.indexSubtitle.Spacing;
  checkLimits(height);
  currPage.drawText(title.toUpperCase(), {
    x: pos.x,
    y: pos.y,
    color: NativeStyles.titulo.color,
    fontSize: pdfValues.indexSubtitle.FontSize,
    fontName: pdfValues.fontName
  });
  pos.y -= height;
  if (items) {
    const itemHeight =
      pdfValues.indexText.FontSize + pdfValues.indexText.Spacing;
    items.forEach(str => {
      if (str !== '') {
        checkLimits(itemHeight);
        currPage.drawText(str, {
          x: pos.x,
          y: pos.y,
          color: NativeStyles.lineaNormal.color,
          fontSize: pdfValues.indexText.FontSize,
          fontName: pdfValues.fontName
        });
      }
      pos.y -= itemHeight;
    });
    if (pos.y !== primerFilaY) {
      pos.y -= itemHeight;
    }
  }
  return currPage;
};

export const generatePDF = async (
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions
) => {
  try {
    const docsDir =
      Platform.OS == 'ios'
        ? RNFS.TemporaryDirectoryPath
        : RNFS.CachesDirectoryPath + '/';
    const pdfPath = opts.createIndex
      ? `${docsDir}/iResucito.pdf`
      : `${docsDir}/${songsToPdf[0].canto.titulo}.pdf`;
    const pdfPathNorm = normalize(pdfPath);
    const pdfDoc = PDFDocument.create(pdfPathNorm);
    pageNumber = 1;
    // Indice
    if (opts.createIndex) {
      var page = getNewPage();
      // Alfabetico
      var coord = { y: primerFilaY, x: pdfValues.primerColumnaIndexX };
      var items = getAlphaWithSeparators(songsToPdf);
      page = await generateListing(
        pdfDoc,
        page,
        coord,
        I18n.t('search_title.alpha'),
        items,
        I18n.t('ui.export.songs index')
      );
      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      await asyncForEach(wayStages, async stage => {
        page = await generateListing(
          pdfDoc,
          page,
          coord,
          I18n.t(`search_title.${stage}`),
          byStage[stage]
        );
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      await asyncForEach(liturgicTimes, async (time, i) => {
        var title = I18n.t(`search_title.${time}`);
        if (i === 0) {
          title = I18n.t('search_title.liturgical time') + ` - ${title}`;
        }
        page = await generateListing(pdfDoc, page, coord, title, byTime[time]);
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      await asyncForEach(liturgicOrder, async order => {
        var title = I18n.t(`search_title.${order}`);
        page = await generateListing(
          pdfDoc,
          page,
          coord,
          title,
          byOrder[order]
        );
      });
      writePageNumber(page);
      pdfDoc.addPage(page);
    }
    await asyncForEach(songsToPdf, async data => {
      // Tomar canto y las lineas para renderizar
      const { canto, lines } = data;
      // Para centrar titulo
      const sizeTitle = await PDFLib.measureText(
        canto.titulo.toUpperCase(),
        pdfValues.fontName,
        pdfValues.songTitle.FontSize
      );
      // Para centrar fuente
      const sizeFuente = await PDFLib.measureText(
        canto.fuente,
        pdfValues.fontName,
        pdfValues.songSource.FontSize
      );
      var coord = {
        y: primerFilaY,
        x: 0
      };
      const page = getNewPage();
      pageNumber++;
      var titleX = parseInt(
        (pdfValues.widthHeightPixels - sizeTitle.width) / 2
      );
      page.drawText(canto.titulo.toUpperCase(), {
        x: titleX,
        y: coord.y,
        color: NativeStyles.titulo.color,
        fontSize: pdfValues.songTitle.FontSize,
        fontName: pdfValues.fontName
      });
      coord.y -= pdfValues.songTitle.Spacing;
      var fuenteX = parseInt(
        (pdfValues.widthHeightPixels - sizeFuente.width) / 2
      );
      page.drawText(canto.fuente, {
        x: fuenteX,
        y: coord.y,
        color: NativeStyles.fuente.color,
        fontSize: pdfValues.songSource.FontSize,
        fontName: pdfValues.fontName
      });
      coord.x = pdfValues.primerColumnaX;
      coord.y -= pdfValues.songSource.Spacing;
      var yStart = coord.y - pdfValues.songParagraphSpacing;
      lines.forEach((it: SongLine, idx) => {
        if (it.inicioParrafo) {
          coord.y -= pdfValues.songParagraphSpacing;
        }
        if (it.tituloEspecial) {
          coord.y -= pdfValues.songParagraphSpacing * 2;
        }
        var alturaExtra = 0;
        if (it.notas) {
          alturaExtra =
            pdfValues.songNote.FontSize + pdfValues.songText.Spacing;
        }
        if (coord.y - alturaExtra <= limiteHoja) {
          // Si ya estamos escribiendo en la 2da columna
          // el texto quedara sobreecrito, por tanto generar advertencia
          if (coord.x === pdfValues.segundaColumnaX) {
            console.log(
              'Sin lugar (%s, linea %s = "%s"), página %s',
              canto.titulo,
              idx,
              it.texto,
              pageNumber
            );
          }
          coord.x = pdfValues.segundaColumnaX;
          coord.y = yStart;
        }
        if (it.notas === true) {
          page.drawText(it.texto, {
            x: coord.x + pdfValues.songIndicatorSpacing,
            y: coord.y,
            color: NativeStyles.lineaNotas.color,
            fontSize: pdfValues.songNote.FontSize,
            fontName: pdfValues.fontName
          });
          coord.y -= pdfValues.songText.Spacing;
        } else if (it.canto === true) {
          page.drawText(it.texto, {
            x: coord.x + pdfValues.songIndicatorSpacing,
            y: coord.y,
            color: NativeStyles.lineaNormal.color,
            fontSize: pdfValues.songText.FontSize,
            fontName: pdfValues.fontName
          });
          coord.y -= pdfValues.songText.Spacing;
        } else if (it.cantoConIndicador === true) {
          page.drawText(it.prefijo, {
            x: coord.x,
            y: coord.y,
            color: NativeStyles.prefijo.color,
            fontSize: pdfValues.songText.FontSize,
            fontName: pdfValues.fontName
          });
          if (it.tituloEspecial === true) {
            page.drawText(it.texto, {
              x: coord.x + pdfValues.songIndicatorSpacing,
              y: coord.y,
              color: NativeStyles.lineaTituloNotaEspecial.color,
              fontSize: pdfValues.songText.FontSize,
              fontName: pdfValues.fontName
            });
          } else if (it.textoEspecial === true) {
            page.drawText(it.texto, {
              x: coord.x + pdfValues.songIndicatorSpacing,
              y: coord.y,
              color: NativeStyles.lineaNotaEspecial.color,
              fontSize: pdfValues.songText.FontSize - 3,
              fontName: pdfValues.fontName
            });
          } else {
            page.drawText(it.texto, {
              x: coord.x + pdfValues.songIndicatorSpacing,
              y: coord.y,
              color: NativeStyles.lineaNormal.color,
              fontSize: pdfValues.songText.FontSize,
              fontName: pdfValues.fontName
            });
          }
          coord.y -= pdfValues.songText.Spacing;
        }
      });
      if (opts.pageNumbers) {
        writePageNumber(page);
      }
      pdfDoc.addPage(page);
    });
    const path = await pdfDoc.write();
    return path;
  } catch (err) {
    console.log('generatePDF ERROR', err);
  }
};

export const generateMultiPagePDF = (
  songs: Array<Song>,
  opts: ExportToPdfOptions
) => {
  var items = songs.map<SongToPdf>(s => {
    return {
      canto: s,
      lines: NativeSongs.getSongLinesForRender(s.lines, s.locale)
    };
  });

  return generatePDF(items, opts);
};
