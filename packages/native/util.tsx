// Utilerias atadas a react-native
import { StyleSheet, Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as Device from 'expo-device';
import * as Contacts from 'expo-contacts';
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

export type ContactForImport = Contacts.Contact & { imported: boolean };

export function getContactsForImport(
  allContacts: Contacts.Contact[],
  importedContacts: BrotherContact[]
): ContactForImport[] {
  // Fitrar y generar contactos únicos
  var grouped = allContacts.reduce(
    (groups: { [fullname: string]: Contacts.Contact[] }, item) => {
      var fullname = `${item.givenName} ${item.familyName}`;
      groups[fullname] = groups[fullname] || [];
      groups[fullname].push(item);
      return groups;
    },
    {}
  );
  var unique: Contacts.Contact[] = [];
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
  return getLocales()[0].languageTag;
};

var isTablet = __DEV__ ? false : Device.deviceType == Device.DeviceType.TABLET;
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

const BaseSongsPath = 'file://assets/songs';

export const NativeSongs: SongsProcessor = new SongsProcessor(
  BaseSongsPath,
  FileSystem.readDirectoryAsync,
  FileSystem.readAsStringAsync
);

class NativeSongsExtras implements SongsExtras {
  async readPatch(): Promise<SongIndexPatch> {
    const json = await FileSystem.readAsStringAsync(this.getPatchUri());
    return JSON.parse(json) as SongIndexPatch;
  }

  savePatch(patch: SongIndexPatch): Promise<void> {
    const json = JSON.stringify(patch);
    return FileSystem.writeAsStringAsync(this.getPatchUri(), json, {
      encoding: 'utf8',
    });
  }

  deletePatch(): Promise<void> {
    return FileSystem.deleteAsync(this.getPatchUri());
  }

  getPatchUri(): string {
    return `${FileSystem.documentDirectory}/SongsIndexPatch.json`;
  }

  readSettings(): Promise<string> {
    return FileSystem.readAsStringAsync(this.getSettingsUri());
  }

  saveSettings(ratings: any): Promise<void> {
    return FileSystem.writeAsStringAsync(this.getSettingsUri(), ratings, {
      encoding: 'utf8',
    });
  }

  deleteSettings(): Promise<void> {
    return FileSystem.deleteAsync(this.getSettingsUri());
  }

  async settingsExists(): Promise<boolean> {
    const info = await FileSystem.getInfoAsync(this.getSettingsUri());
    return info.exists;
  }

  getSettingsUri(): string {
    return `${FileSystem.documentDirectory}/SongsSettings.json`;
  }
}

export const NativeExtras: SongsExtras = new NativeSongsExtras();

export const NativeParser: SongsParser = new SongsParser(NativeStyles);

export const contactFilterByText = (
  c: Contacts.Contact,
  text: string
): boolean => {
  return (
    (c.firstName && c.firstName.toLowerCase().includes(text.toLowerCase())) ||
    (c.lastName && c.lastName.toLowerCase().includes(text.toLowerCase()))
  );
};
