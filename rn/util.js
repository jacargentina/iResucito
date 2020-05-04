// @flow
// Utilerias atadas a react-native
import { StyleSheet, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import I18n from '../translations';
import { SongsProcessor } from '../SongsProcessor';
import { SongsParser } from '../SongsParser';
import { SongsExtras } from '../SongsExtras';

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
      var conMiniatura = grouped[fullname].find((c) => c.hasThumbnail === true);
      unique.push(conMiniatura || grouped[fullname][0]);
    } else {
      unique.push(grouped[fullname][0]);
    }
  }
  // De los únicos, marcar cuales ya estan importados
  var items = unique.map((c) => {
    var found = importedContacts.find((x) => x.recordID === c.recordID);
    c.imported = found !== undefined;
    return c;
  });
  items.sort(ordenAlfabetico);
  return items;
}

export const getDefaultLocale = () => {
  return RNLocalize.getLocales()[0].languageTag;
};

var isTablet = __DEV__ ? false : DeviceInfo.isTablet();
var fontSizeTitulo = isTablet ? 25 : 22;
var fontSizeTexto = isTablet ? 17 : 15;
var fontSizeNotas = isTablet ? 15.2 : 12.5;

export const stylesObj: SongStyles = {
  title: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeTitulo,
    marginTop: 8,
    marginBottom: 4,
  },
  source: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeTexto - 1,
    marginBottom: 8,
  },
  clampLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas,
  },
  indicator: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeTexto,
  },
  notesLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginLeft: 4,
  },
  specialNoteTitle: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
  },
  specialNote: {
    fontFamily: 'Franklin Gothic Medium',
    fontSize: fontSizeNotas,
    color: '#444444',
  },
  notesMarginLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginTop: 15,
    marginLeft: 4,
  },
  normalLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeTexto,
    marginBottom: 8,
  },
  prefix: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeTexto,
  },
  pageNumber: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeTexto,
  },
};

export const NativeStyles = StyleSheet.create(stylesObj);

const BaseSongsPath =
  Platform.OS === 'ios' ? `${RNFS.MainBundlePath}/songs` : 'songs';

const NativeSongsLoader =
  Platform.OS === 'ios' ? RNFS.readDir : RNFS.readDirAssets;

const NativeSongReader =
  Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;

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
