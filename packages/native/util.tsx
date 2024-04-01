// Utilerias atadas a react-native
import { TextStyle, ViewStyle } from 'react-native';
import { getLocales } from 'expo-localization';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import * as Contacts from 'expo-contacts';
import {
  SongsParser,
  SongsExtras,
  SongStyles,
  Song,
  SongIndexPatch,
} from '@iresucito/core';
import { BrotherContact } from './hooks';

export function ordenAlfabetico(
  a: Contacts.Contact,
  b: Contacts.Contact
): number {
  return a.name.localeCompare(b.name);
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
      var fullname = item.name;
      groups[fullname] = groups[fullname] || [];
      groups[fullname].push(item);
      return groups;
    },
    {}
  );
  var unique: Contacts.Contact[] = [];
  for (var fullname in grouped) {
    if (grouped[fullname].length > 1) {
      var conMiniatura = grouped[fullname].find((c) => c.image != undefined);
      unique.push(conMiniatura || grouped[fullname][0]);
    } else {
      unique.push(grouped[fullname][0]);
    }
  }
  // De los únicos, marcar cuales ya estan importados
  var items = unique.map((c) => {
    var found = importedContacts.find((x) => x.id === c.id);
    var r: ContactForImport = { ...c, imported: found !== undefined };
    return r;
  });
  items.sort(ordenAlfabetico);
  return items;
}

export const getDefaultLocale = (): string => {
  return getLocales()[0].languageTag;
};

var isTablet = Device.deviceType == Device.DeviceType.TABLET;
var fontSizeTitulo = isTablet ? 44 : 22;
var fontSizeNormal = isTablet ? 20 : 14;
var fontSizeNotas = isTablet ? 17 : 10.7;
var fontSizeAsamblea = isTablet ? 22 : 17;

export type NativeStyle = TextStyle & ViewStyle;

export const NativeStyles: SongStyles<NativeStyle> = {
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
    fontSize: fontSizeNormal - 1,
    marginBottom: 4,
  },
  clampLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas + 1,
    marginBottom: 4,
  },
  indicator: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNormal,
  },
  notesLine: {
    fontFamily: 'Franklin Gothic Regular',
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginLeft: 6,
  },
  specialNoteTitle: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#ff0000',
    fontSize: fontSizeNotas + 1,
  },
  specialNote: {
    fontFamily: 'Franklin Gothic Medium',
    fontSize: fontSizeNotas,
    color: '#444444',
  },
  normalLine: {
    fontFamily: 'Franklin Gothic Regular',
    color: '#000000',
    fontSize: fontSizeNormal,
  },
  normalPrefix: {
    fontFamily: 'Franklin Gothic Regular',
    color: '#777777',
    fontSize: fontSizeNormal,
  },
  pageNumber: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeNormal,
  },
  pageFooter: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#777777',
    fontSize: fontSizeNormal - 1,
  },
  assemblyLine: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeAsamblea,
  },
  assemblyPrefix: {
    fontFamily: 'Franklin Gothic Medium',
    color: '#000000',
    fontSize: fontSizeAsamblea,
  },
  marginLeft: 0,
  marginTop: 0,
  widthHeightPixels: 0,
  bookTitleSpacing: 0,
  songIndicatorSpacing: 0,
  indexMarginLeft: 0,
  indexTitle: {},
  bookSubtitle: {},
  bookTitle: {},
  indexText: {},
  disablePageNumbers: false,
  empty: {},
};

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

export const NativeParser = new SongsParser(NativeStyles);

export const contactFilterByText = (
  c: Contacts.Contact,
  text: string
): boolean => {
  const cond1 =
    c.firstName && c.firstName.toLowerCase().includes(text.toLowerCase());
  const cond2 =
    c.lastName && c.lastName.toLowerCase().includes(text.toLowerCase());
  return cond1 === true || cond2 === true;
};
