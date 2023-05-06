import React, { useEffect } from 'react';
//import { useWhatChanged } from '@simbathesailor/use-what-changed';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import pathParse from 'path-parse';
import {
  getEsSalmo,
  getLocalizedListItem,
  getLocalizedListType,
  defaultExportToPdfOptions,
  SongSettingsFile,
  Song,
  SearchItem,
  ListType,
  ShareListType,
  ListToPdf,
} from '@iresucito/core';
import i18n from '@iresucito/translations';
import badges from './badges';
import { generateListPDF } from './pdf';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { produce } from 'immer';
import {
  getDefaultLocale,
  ordenClasificacion,
  NativeSongs,
  NativeExtras,
} from './util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const readSongSettingsFile = async (): Promise<
  SongSettingsFile | undefined
> => {
  if ((await NativeExtras.settingsExists()) === false) {
    return Promise.resolve(undefined);
  }
  const json = await NativeExtras.readSettings();
  try {
    return JSON.parse(json);
  } catch {
    // si el archivo está corrupto, eliminarlo
    await NativeExtras.deleteSettings();
  }
};

type SongsStore = {
  songs: Song[];
  load: (locale: string) => Promise<Song[]>;
};

export const useSongsStore = create<SongsStore>((set) => ({
  songs: [],
  load: async (locale: string) => {
    var settingsObj = await readSongSettingsFile();
    // Construir metadatos de cantos
    var metaData = NativeSongs.getSongsMeta(locale, undefined, settingsObj);
    console.log(`songsStore loading ${metaData.length} songs for "${locale}"`);
    await NativeSongs.loadSongs(locale, metaData);
    set((state) => ({ songs: metaData }));
    return metaData;
  },
}));

export const setSongSetting = async (
  key: string,
  loc: string,
  setting: string,
  value: any
): Promise<Song> => {
  var settingsObj = await readSongSettingsFile();
  if (!settingsObj) {
    settingsObj = {};
  }
  if (!settingsObj[key]) {
    settingsObj[key] = {};
  }
  settingsObj[key] = Object.assign({}, settingsObj[key], {
    [loc]: { [setting]: value },
  });
  var json = JSON.stringify(settingsObj, null, ' ');
  await NativeExtras.saveSettings(json);
  var updated = await useSongsStore.getState().load(loc);
  return updated.find((song) => song.key == key) as Song;
};

type SelectionStore = {
  selection: string[];
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: (key: string) => void;
};

export const useSongsSelection = create<SelectionStore>((set, get) => ({
  selection: [],
  enabled: false,
  enable: () => {
    set((state) => ({ selection: [], enabled: true }));
  },
  disable: () => {
    set((state) => ({ selection: [], enabled: false }));
  },
  toggle: (key: string) => {
    var { selection, enabled } = get();
    if (selection.indexOf(key) > -1) {
      selection.splice(selection.indexOf(key), 1);
    } else {
      selection.push(key);
    }
    set((state) => ({ selection, enabled }));
  },
}));

type LibreList = {
  type: 'libre';
  version: number;
  items: string[];
};

type PalabraList = {
  type: 'palabra';
  version: number;
  ambiental: string | null;
  entrada: string | null;
  '1-monicion': string | null;
  '1': string | null;
  '1-salmo': string | null;
  '2-monicion': string | null;
  '2': string | null;
  '2-salmo': string | null;
  '3-monicion': string | null;
  '3': string | null;
  '3-salmo': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  salida: string | null;
  nota: string | null;
};

type EucaristiaList = {
  type: 'eucaristia';
  version: number;
  ambiental: string | null;
  entrada: string | null;
  '1-monicion': string | null;
  '1': string | null;
  '2-monicion': string | null;
  '2': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  'oracion-universal': string | null;
  paz: string | null;
  'comunion-pan': string | null;
  'comunion-caliz': string | null;
  salida: string | null;
  'encargado-pan': string | null;
  'encargado-flores': string | null;
  nota: string | null;
};

type Lists = {
  [listName: string]: LibreList | PalabraList | EucaristiaList;
};

type LibreListForUI = {
  name: string;
  type: 'libre';
  localeType: string;
  version: number;
  items: Song[];
};

type PalabraListForUI = {
  name: string;
  type: 'palabra';
  localeType: string;
  version: number;
  ambiental: string | null;
  entrada: Song | null;
  '1-monicion': string | null;
  '1': string | null;
  '1-salmo': Song | null;
  '2-monicion': string | null;
  '2': string | null;
  '2-salmo': Song | null;
  '3-monicion': string | null;
  '3': string | null;
  '3-salmo': Song | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  salida: Song | null;
  nota: string | null;
};

type EucaristiaListForUI = {
  name: string;
  type: 'eucaristia';
  localeType: string;
  version: number;
  ambiental: string | null;
  entrada: Song | null;
  '1-monicion': string | null;
  '1': string | null;
  '2-monicion': string | null;
  '2': string | null;
  'evangelio-monicion': string | null;
  evangelio: string | null;
  'oracion-universal': string | null;
  paz: Song | null;
  'comunion-pan': Song | null;
  'comunion-caliz': Song | null;
  salida: Song | null;
  'encargado-pan': string | null;
  'encargado-flores': string | null;
  nota: string | null;
};

export type ListForUI = LibreListForUI | PalabraListForUI | EucaristiaListForUI;

type ListsStore = {
  lists: Lists;
  lists_ui: ListForUI[];
  add: (listName: string, type: ListType) => void;
  rename: (listName: string, newName: string) => void;
  remove: (listName: string) => void;
  setList: (listName: string, listKey: string | number, listValue: any) => void;
  importList: (listPath: string) => Promise<string | void>;
  shareList: (listName: string, type: ShareListType) => void;
  load_ui: () => void;
};

const getItemForShare = (
  list: ListForUI,
  key: keyof LibreListForUI | keyof PalabraListForUI | keyof EucaristiaListForUI
) => {
  if (list.hasOwnProperty(key)) {
    var valor = list[key];
    if (valor && getEsSalmo(key)) {
      valor = valor.titulo;
    }
    if (valor) {
      return getLocalizedListItem(key) + ': ' + valor;
    }
  }
  return null;
};

export const useListsStore = create<ListsStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        lists: {},
        lists_ui: [],
        add: (listName: string, type: ListType) => {
          set(
            produce((state: ListsStore) => {
              switch (type) {
                case 'libre':
                  state.lists[listName] = { type, version: 1, items: [] };
                  break;
                case 'palabra':
                  state.lists[listName] = {
                    type,
                    version: 1,
                    ambiental: null,
                    entrada: null,
                    '1-monicion': null,
                    '1': null,
                    '1-salmo': null,
                    '2-monicion': null,
                    '2': null,
                    '2-salmo': null,
                    '3-monicion': null,
                    '3': null,
                    '3-salmo': null,
                    'evangelio-monicion': null,
                    evangelio: null,
                    salida: null,
                    nota: null,
                  };
                  break;
                case 'eucaristia':
                  state.lists[listName] = {
                    type,
                    version: 1,
                    ambiental: null,
                    entrada: null,
                    '1-monicion': null,
                    '1': null,
                    '2-monicion': null,
                    '2': null,
                    'evangelio-monicion': null,
                    evangelio: null,
                    'oracion-universal': null,
                    paz: null,
                    'comunion-pan': null,
                    'comunion-caliz': null,
                    salida: null,
                    'encargado-pan': null,
                    'encargado-flores': null,
                    nota: null,
                  };
                  break;
              }
            })
          );
        },
        rename: (listName: string, newName: string) => {
          set(
            produce((state: ListsStore) => {
              const list = state.lists[listName];
              delete state.lists[listName];
              state.lists[newName] = list;
            })
          );
        },
        remove: (listName: string) => {
          set(
            produce((state: ListsStore) => {
              delete state.lists[listName];
            })
          );
        },
        setList: (
          listName: string,
          listKey: string | number,
          listValue: any
        ) => {
          set(
            produce((state: ListsStore) => {
              const targetList = state.lists[listName];
              if (listValue !== undefined) {
                if (typeof listKey === 'string') {
                  targetList[listKey] = listValue;
                } else if (
                  typeof listKey === 'number' &&
                  'items' in targetList
                ) {
                  var isPresent = targetList.items.find(
                    (s: any) => s === listValue
                  );
                  if (isPresent) {
                    return;
                  }
                  targetList.items[listKey] = listValue;
                }
              } else {
                if (typeof listKey === 'string') {
                  targetList[listKey] = undefined;
                } else if (
                  typeof listKey === 'number' &&
                  'items' in targetList
                ) {
                  targetList.items.splice(listKey, 1);
                }
              }
            })
          );
        },
        importList: async (listPath: string) => {
          const path = decodeURI(listPath);
          try {
            const content = await RNFS.readFile(path);
            // Obtener nombre del archivo
            // que será nombre de la lista
            const parsed = pathParse(listPath);
            var { name: listName } = parsed;
            // Generar nombre único para la lista
            var counter = 1;
            const lists = get().lists;
            while (lists.hasOwnProperty(listName)) {
              listName = `${listName} (${counter++})`;
            }
            const changedLists = Object.assign({}, lists, {
              [listName]: JSON.parse(content),
            });
            useListsStore.setState({ lists: changedLists });
            return listName;
          } catch (err) {
            console.log('importList: ' + (err as Error).message);
            Alert.alert(
              i18n.t('alert_title.corrupt file'),
              i18n.t('alert_message.corrupt file')
            );
          }
        },
        shareList: async (listName: string, format: ShareListType) => {
          switch (format) {
            case 'native':
              const folder =
                Platform.OS === 'ios'
                  ? RNFS.TemporaryDirectoryPath
                  : RNFS.CachesDirectoryPath + '/';
              const fileName = listName.replace(' ', '-');
              const listPath = `${folder}${fileName}.ireslist`;
              const nativeList = get().lists[listName];
              RNFS.writeFile(
                listPath,
                JSON.stringify(nativeList, null, ' '),
                'utf8'
              );
              Share.open({
                title: i18n.t('ui.share'),
                subject: `iResucitó - ${listName}`,
                url: `file://${listPath}`,
                failOnCancel: false,
              }).catch((err) => {
                err && console.log(err);
              });
              break;
            case 'text':
              var list = get().lists_ui.find(
                (l) => l.name == listName
              ) as ListForUI;
              var items: Array<string | null> = [];
              if (list.type === 'libre') {
                var cantos = list.items;
                cantos.forEach((canto: Song, i: number) => {
                  items.push(`${i + 1} - ${canto.titulo}`);
                });
              } else {
                items.push(getItemForShare(list, 'ambiental'));
                items.push(getItemForShare(list, 'entrada'));
                items.push(getItemForShare(list, '1-monicion'));
                items.push(getItemForShare(list, '1'));
                items.push(getItemForShare(list, '1-salmo'));
                items.push(getItemForShare(list, '2-monicion'));
                items.push(getItemForShare(list, '2'));
                items.push(getItemForShare(list, '2-salmo'));
                items.push(getItemForShare(list, '3-monicion'));
                items.push(getItemForShare(list, '3'));
                items.push(getItemForShare(list, '3-salmo'));
                items.push(getItemForShare(list, 'evangelio-monicion'));
                items.push(getItemForShare(list, 'evangelio'));
                items.push(getItemForShare(list, 'oracion-universal'));
                items.push(getItemForShare(list, 'paz'));
                items.push(getItemForShare(list, 'comunion-pan'));
                items.push(getItemForShare(list, 'comunion-caliz'));
                items.push(getItemForShare(list, 'salida'));
                items.push(getItemForShare(list, 'encargado-pan'));
                items.push(getItemForShare(list, 'encargado-flores'));
                items.push(getItemForShare(list, 'nota'));
              }
              var message = items.filter((n) => n).join('\n');
              Share.open({
                title: i18n.t('ui.share'),
                message: message,
                subject: `iResucitó - ${listName}`,
                url: undefined,
                failOnCancel: false,
              }).catch((err) => {
                err && console.log(err);
              });
              break;
            case 'pdf':
              var list = get().lists_ui.find(
                (l) => l.name == listName
              ) as ListForUI;
              var listToPdf: ListToPdf = {
                ...list,
                name: list.name,
                type: list.type,
                localeType: getLocalizedListType(list.type, i18n.locale),
              };
              var path = await generateListPDF(
                listToPdf,
                defaultExportToPdfOptions
              );
              sharePDF(listName, path);
              break;
          }
        },
        load_ui: () => {
          set(
            produce((state: ListsStore) => {
              var { songs } = useSongsStore.getState();
              state.lists_ui = Object.keys(state.lists).map((listName) => {
                var datalist = state.lists[listName];
                switch (datalist.type) {
                  case 'libre':
                    var l = datalist as LibreList;
                    var libre: LibreListForUI = {
                      name: listName,
                      version: datalist.version,
                      type: datalist.type,
                      localeType: getLocalizedListType(
                        datalist.type,
                        i18n.locale
                      ),
                      items: l.items.map((key) => {
                        return songs?.find((s) => s.key === key) as Song;
                      }),
                    };
                    return libre;
                  case 'palabra':
                    var p = datalist as PalabraList;
                    var palabra: PalabraListForUI = {
                      name: listName,
                      version: datalist.version,
                      type: datalist.type,
                      localeType: getLocalizedListType(
                        datalist.type,
                        i18n.locale
                      ),
                      ambiental: datalist.ambiental,
                      entrada:
                        datalist.entrada != null
                          ? (songs?.find((s) => s.key === p.entrada) as Song)
                          : null,
                      '1-monicion': datalist['1-monicion'],
                      '1': datalist['1'],
                      '1-salmo':
                        datalist['1-salmo'] != null
                          ? (songs?.find((s) => s.key === p['1-salmo']) as Song)
                          : null,
                      '2-monicion': datalist['2-monicion'],
                      '2': datalist['2'],
                      '2-salmo':
                        datalist['2-salmo'] != null
                          ? (songs?.find((s) => s.key === p['2-salmo']) as Song)
                          : null,
                      '3-monicion': datalist['3-monicion'],
                      '3': datalist['3'],
                      '3-salmo':
                        datalist['3-salmo'] != null
                          ? (songs?.find((s) => s.key === p['3-salmo']) as Song)
                          : null,
                      'evangelio-monicion': datalist['evangelio-monicion'],
                      evangelio: datalist.evangelio,
                      salida:
                        datalist.salida != null
                          ? (songs?.find((s) => s.key === p.salida) as Song)
                          : null,
                      nota: datalist.nota,
                    };
                    return palabra;
                  case 'eucaristia':
                    var e = datalist as EucaristiaList;
                    var eucaristia: EucaristiaListForUI = {
                      name: listName,
                      version: datalist.version,
                      type: datalist.type,
                      localeType: getLocalizedListType(
                        datalist.type,
                        i18n.locale
                      ),
                      ambiental: datalist.ambiental,
                      entrada:
                        datalist.entrada != null
                          ? (songs?.find((s) => s.key === e.entrada) as Song)
                          : null,
                      '1-monicion': datalist['1-monicion'],
                      '1': datalist['1'],
                      '2-monicion': datalist['2-monicion'],
                      '2': datalist['2'],
                      'evangelio-monicion': datalist['evangelio-monicion'],
                      evangelio: datalist.evangelio,
                      'oracion-universal': datalist['oracion-universal'],
                      'comunion-pan':
                        datalist['comunion-pan'] != null
                          ? (songs?.find(
                            (s) => s.key === e['comunion-pan']
                          ) as Song)
                          : null,
                      'comunion-caliz':
                        datalist['comunion-caliz'] != null
                          ? (songs?.find(
                            (s) => s.key === e['comunion-caliz']
                          ) as Song)
                          : null,
                      paz:
                        datalist.paz != null
                          ? (songs?.find((s) => s.key === e.paz) as Song)
                          : null,
                      salida:
                        datalist.salida != null
                          ? (songs?.find((s) => s.key === e.salida) as Song)
                          : null,
                      'encargado-pan': datalist['encargado-pan'],
                      'encargado-flores': datalist['encargado-flores'],
                      nota: datalist.nota,
                    };
                    return eucaristia;
                }
              });
            })
          );
        },
      }),
      {
        name: 'lists',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ lists: state.lists }),
      }
    )
  )
);

useListsStore.subscribe(
  (state) => state.lists,
  (lists) => {
    useListsStore.getState().load_ui();
  },
  {
    equalityFn: shallow,
    fireImmediately: true,
  }
);

export type BrotherContact = Contacts.Contact & {
  s: boolean;
};

type BrothersStore = {
  deviceContacts: Contacts.Contact[];
  deviceContacts_loaded: boolean;
  contacts: BrotherContact[];
  populateDeviceContacts: (reqPerm: boolean) => Promise<Contacts.Contact[]>;
  update: (id: string, item: Contacts.Contact) => void;
  addOrRemove: (contact: Contacts.Contact) => void;
  refreshContacts: () => void;
};

export const useBrothersStore = create<BrothersStore>()(
  persist(
    (set, get) => ({
      deviceContacts: [],
      contacts: [],
      deviceContacts_loaded: false,
      populateDeviceContacts: async (reqPerm: boolean) => {
        const hasPermission = await checkContactsPermission(reqPerm);
        const devCts = hasPermission ? await Contacts.getAll() : [];
        set((state) => ({ deviceContacts: devCts, deviceContacts_loaded: true }));
        return get().contacts;
      },
      update: (id: string, item: Contacts.Contact) => {
        set(produce((state: BrothersStore) => {
          var brother = state.contacts.find((c) => c.recordID === id);
          if (brother) {
            var idx = state.contacts.indexOf(brother);
            state.contacts[idx] = Object.assign(brother, item);
          }
        }))
      },
      addOrRemove: (contact: Contacts.Contact) => {
        set(produce((state: BrothersStore) => {
          var idx = state.contacts.findIndex((c) => c.recordID === contact.recordID);
          // Ya esta importado
          if (idx !== -1) {
            state.contacts = state.contacts.filter((l, i) => i !== idx);
          } else {
            var newBrother: BrotherContact = { s: false, ...contact };
            state.contacts.push(newBrother);
          }
        }))
      },
      refreshContacts: async () => {
        set(produce(async (state: BrothersStore) => {
          try {
            const devCts = await get().populateDeviceContacts(false);
            state.contacts.forEach((c, idx) => {
              // tomar el contacto actualizado
              var devContact = devCts.find((x) => x.recordID === c.recordID);
              if (devContact) {
                state.contacts[idx] = devContact as BrotherContact;
              }
            });
          } catch {
          }
        }));
      },
    }),
    {
      name: 'contacts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ contacts: state.contacts }),
      onRehydrateStorage: () => (state) => {
        state?.refreshContacts();
      },
    }
  )
);

const checkContactsPermission = async (reqPerm: boolean) => {
  if (Platform.OS === 'android') {
    if (reqPerm) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        throw new Error('Sin permisos para leer contactos');
      }
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
    }
  } else {
    const perm1 = await Contacts.checkPermission();
    if (perm1 === 'undefined') {
      if (reqPerm) {
        return Contacts.requestPermission().then((perm2) => {
          if (perm2 === 'authorized') {
            return true;
          }
          if (perm2 === 'denied') {
            throw new Error('denied');
          }
        });
      } else {
        throw new Error('denied');
      }
    }
    if (perm1 === 'authorized') {
      return true;
    }
    if (perm1 === 'denied') {
      throw new Error('denied');
    }
  }
};

export type SettingsStore = {
  locale: string;
  keepAwake: boolean;
  zoomLevel: number;
  computedLocale: string;
  searchItems: SearchItem[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        locale: 'default',
        keepAwake: true,
        zoomLevel: 1,
        computedLocale: 'default',
        searchItems: [],
        hasHydrated: false,
        setHasHydrated: (state: boolean) => {
          set({
            hasHydrated: state,
          });
        },
      }),
      {
        name: 'settings',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          locale: state.locale,
          keepAwake: state.keepAwake,
          zoomLevel: state.zoomLevel,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);

useSettingsStore.subscribe(
  (state) => [state.locale, state.hasHydrated] as [string, boolean],
  async ([locale, hasHydrated]) => {
    if (hasHydrated) {
      i18n.locale = locale === 'default' ? getDefaultLocale() : locale;
      await useSongsStore.getState().load(i18n.locale);
      useListsStore.getState().load_ui();
      var items: Array<SearchItem> = [
        {
          title_key: 'search_title.ratings',
          note_key: 'search_note.ratings',
          params: { filter: null, sort: ordenClasificacion },
          badge: null,
        },
        {
          title_key: 'search_title.alpha',
          note_key: 'search_note.alpha',
          chooser: i18n.t('search_tabs.all', { locale }),
          params: { filter: null },
          badge: badges.alpha,
        },
        {
          title_key: 'search_title.stage',
          divider: true,
        },
        {
          title_key: 'search_title.precatechumenate',
          note_key: 'search_note.precatechumenate',
          params: { filter: { stage: 'precatechumenate' } },
          badge: badges.precatechumenate,
        },
        {
          title_key: 'search_title.catechumenate',
          note_key: 'search_note.catechumenate',
          params: { filter: { stage: 'catechumenate' } },
          badge: badges.catechumenate,
        },
        {
          title_key: 'search_title.election',
          note_key: 'search_note.election',
          params: { filter: { stage: 'election' } },
          badge: badges.election,
        },
        {
          title_key: 'search_title.liturgy',
          note_key: 'search_note.liturgy',
          params: { filter: { stage: 'liturgy' } },
          badge: badges.liturgy,
        },
        {
          title_key: 'search_title.liturgical time',
          divider: true,
        },
        {
          title_key: 'search_title.advent',
          note_key: 'search_note.advent',
          params: { filter: { advent: true } },
          badge: null,
        },
        {
          title_key: 'search_title.christmas',
          note_key: 'search_note.christmas',
          params: { filter: { christmas: true } },
          badge: null,
        },
        {
          title_key: 'search_title.lent',
          note_key: 'search_note.lent',
          params: { filter: { lent: true } },
          badge: null,
        },
        {
          title_key: 'search_title.easter',
          note_key: 'search_note.easter',
          params: { filter: { easter: true } },
          badge: null,
        },
        {
          title_key: 'search_title.pentecost',
          note_key: 'search_note.pentecost',
          params: { filter: { pentecost: true } },
          badge: null,
        },
        {
          title_key: 'search_title.liturgical order',
          divider: true,
        },
        {
          title_key: 'search_title.entrance',
          note_key: 'search_note.entrance',
          params: { filter: { entrance: true } },
          badge: null,
          chooser: i18n.t('search_tabs.entrance', { locale }),
          chooser_listKey: ['entrada'],
        },
        {
          title_key: 'search_title.peace and offerings',
          note_key: 'search_note.peace and offerings',
          params: { filter: { 'peace and offerings': true } },
          badge: null,
          chooser: i18n.t('search_tabs.peace and offerings', {
            locale,
          }),
          chooser_listKey: ['paz'],
        },
        {
          title_key: 'search_title.fraction of bread',
          note_key: 'search_note.fraction of bread',
          params: { filter: { 'fraction of bread': true } },
          badge: null,
          chooser: i18n.t('search_tabs.fraction of bread', {
            locale,
          }),
          chooser_listKey: ['comunion-pan'],
        },
        {
          title_key: 'search_title.communion',
          note_key: 'search_note.communion',
          params: { filter: { communion: true } },
          badge: null,
          chooser: i18n.t('search_tabs.communion', { locale }),
          chooser_listKey: ['comunion-pan', 'comunion-caliz'],
        },
        {
          title_key: 'search_title.exit',
          note_key: 'search_note.exit',
          params: { filter: { exit: true } },
          badge: null,
          chooser: i18n.t('search_tabs.exit', { locale }),
          chooser_listKey: ['salida'],
        },
        {
          title_key: 'search_title.signing to the virgin',
          note_key: 'search_note.signing to the virgin',
          params: { filter: { 'signing to the virgin': true } },
          badge: null,
          chooser: i18n.t('search_tabs.signing to the virgin', {
            locale,
          }),
        },
        {
          title_key: `search_title.children's songs`,
          note_key: `search_note.children's songs`,
          params: { filter: { "children's songs": true } },
          badge: null,
        },
        {
          title_key: 'search_title.lutes and vespers',
          note_key: 'search_note.lutes and vespers',
          params: { filter: { 'lutes and vespers': true } },
          badge: null,
        },
      ];
      items = items.map((item) => {
        if (item.params) {
          item.params.title_key = item.title_key;
        }
        return item;
      });
      useSettingsStore.setState({
        computedLocale: i18n.locale,
        searchItems: items,
      });
    }
  },
  {
    equalityFn: shallow,
    fireImmediately: true,
  }
);

export const sharePDF = (shareTitleSuffix: string, pdfPath: string) => {
  Share.open({
    title: i18n.t('ui.share'),
    subject: `iResucitó - ${shareTitleSuffix}`,
    url: `file://${pdfPath}`,
    failOnCancel: false,
  }).catch((err) => {
    err && console.log(err);
  });
};
