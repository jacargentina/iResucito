// Utilerias atadas a react-native
import { StyleSheet, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import * as RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { Contact } from 'react-native-contacts';
import {
  SongsParser,
  SongsExtras,
  SongsProcessor,
  SongStyles,
  Song,
  SongIndexPatch,
} from '@iresucito/core';
import { BrotherContact } from './hooks';

export function ordenAlfabetico(a: any, b: any): number {
  if (a.givenName < b.givenName) {
    return -1;
  }
  if (a.givenName > b.givenName) {
    return 1;
  }
  return 0;
}

export function ordenClasificacion(a: Song, b: Song): number {
  if (a.rating < b.rating || (a.rating === undefined && b.rating)) {
    return 1;
  }
  if (a.rating > b.rating || (a.rating && b.rating === undefined)) {
    return -1;
  }
  return 0;
}

export type ContactForImport = Contact & { imported: boolean };

export function getContactsForImport(
  allContacts: Contact[],
  importedContacts: BrotherContact[]
): ContactForImport[] {
  // Fitrar y generar contactos únicos
  var grouped = allContacts.reduce(
    (groups: { [fullname: string]: Contact[] }, item) => {
      var fullname = `${item.givenName} ${item.familyName}`;
      groups[fullname] = groups[fullname] || [];
      groups[fullname].push(item);
      return groups;
    },
    {}
  );
  var unique: Contact[] = [];
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
    var r: ContactForImport = { ...c, imported: found !== undefined };
    return r;
  });
  items.sort(ordenAlfabetico);
  return items;
}

export const getDefaultLocale = (): string => {
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
    marginBottom: 2,
  },
  source: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeTexto - 1,
    marginBottom: 13,
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
  pageFooter: {},
};

export const NativeStyles: any = StyleSheet.create(stylesObj);

const BaseSongsPath =
  Platform.OS === 'ios' ? `${RNFS.MainBundlePath}/songs` : 'songs';

const NativeSongsLoader =
  Platform.OS === 'ios' ? RNFS.readDir : RNFS.readDirAssets;

const NativeSongReader =
  Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;

export const NativeSongs: SongsProcessor = new SongsProcessor(
  BaseSongsPath,
  NativeSongsLoader,
  NativeSongReader
);

class NativeSongsExtras implements SongsExtras {
  async readPatch(): Promise<SongIndexPatch> {
    const json = await RNFS.readFile(this.getPatchUri());
    return JSON.parse(json) as SongIndexPatch;
  }

  savePatch(patch: SongIndexPatch): Promise<void> {
    const json = JSON.stringify(patch);
    return RNFS.writeFile(this.getPatchUri(), json, 'utf8');
  }

  deletePatch(): Promise<void> {
    return RNFS.unlink(this.getPatchUri());
  }

  getPatchUri(): string {
    return `${RNFS.DocumentDirectoryPath}/SongsIndexPatch.json`;
  }

  readSettings(): Promise<string> {
    return RNFS.readFile(this.getSettingsUri());
  }

  saveSettings(ratings: any): Promise<void> {
    return RNFS.writeFile(this.getSettingsUri(), ratings, 'utf8');
  }

  deleteSettings(): Promise<void> {
    return RNFS.unlink(this.getSettingsUri());
  }

  settingsExists(): Promise<boolean> {
    return RNFS.exists(this.getSettingsUri());
  }

  getSettingsUri(): string {
    return `${RNFS.DocumentDirectoryPath}/SongsSettings.json`;
  }
}

export const NativeExtras: SongsExtras = new NativeSongsExtras();

export const NativeParser: SongsParser = new SongsParser(NativeStyles);

export const contactFilterByText = (c: Contact, text: string): boolean => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (typeof c.familyName == 'string' &&
      c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};
