import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useWhatChanged } from '@simbathesailor/use-what-changed';
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
} from '@iresucito/core';
import i18n from '@iresucito/translations';
import badges from './badges';
import { generateListPDF } from './pdf';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { produce } from "immer"
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
  if (await NativeExtras.settingsExists() === false) {
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
  lang: string | undefined;
  songs: Song[];
  load: (loc: string) => Promise<Song[]>;
}

export const useSongsStore = create<SongsStore>((set) => ({
  lang: undefined,
  songs: [],
  load: async (loc: string) => {
    set({ lang: loc });
    var settingsObj = await readSongSettingsFile();
    // Construir metadatos de cantos
    var metaData = NativeSongs.getSongsMeta(
      loc,
      undefined,
      settingsObj
    );
    console.log(`songsStore loading ${metaData.length} songs for "${loc}"`);
    await NativeSongs.loadSongs(loc, metaData);
    set({ songs: metaData });
    return metaData;
  }
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
  return updated.find(song => song.key == key) as Song;
}

type SelectionStore = {
  selection: string[];
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: (key: string) => void;
}

export const useSongsSelection = create<SelectionStore>((set, get) => ({
  selection: [],
  enabled: false,
  enable: () => {
    set({ selection: [], enabled: true });
    return get();
  },
  disable: () => {
    set({ selection: [], enabled: false });
    return get();
  },
  toggle: (key: string) => {
    var { selection, enabled } = get();
    if (selection.indexOf(key) > -1) {
      selection.splice(selection.indexOf(key), 1);
    } else {
      selection.push(key);
    }
    set({ selection, enabled });
    return get();
  }
}));

type Lists = {
  [listName: string]: any;
};

export type ListForUI = {
  name: string;
  type: string;
};

type UseLists = {
  lists: Lists;
  getListForUI: (listName: any) => any;
  shareList: (listName: string, loc: string, type: ShareListType) => void;
  importList: (listPath: string) => Promise<string | void>;
};

type ListsStore = {
  lists: Lists,
  add: (listName: string, type: ListType) => void;
  rename: (listName: string, newName: string) => void;
  remove: (listName: string) => void;
  setList: (listName: string, listKey: string, listValue: any) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useListsStore = create<ListsStore>()(
  persist(
    (set, get) => ({
      lists: {},
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state
        });
      },
      add: (listName: string, type: ListType) => {
        set(produce((state: ListsStore) => {
          let schema = { type: type, version: 1 };
          switch (type) {
            case 'libre':
              schema = Object.assign({}, schema, { items: [] });
              break;
            case 'palabra':
              schema = Object.assign({}, schema, {
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
              });
              break;
            case 'eucaristia':
              schema = Object.assign({}, schema, {
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
              });
              break;
          }
          state.lists[listName] = schema;
        }));
      },
      rename: (listName: string, newName: string) => {
        set(produce((state: ListsStore) => {
          const list = state.lists[listName];
          delete state.lists[listName];
          state.lists[newName] = list;
        }));
      },
      remove: (listName: string) => {
        set(produce((state: ListsStore) => {
          delete state.lists[listName];
        }));
      },
      setList: (listName: string, listKey: string, listValue: any) => {
        set(produce((state: ListsStore) => {
          const targetList = state.lists[listName];
          var schema;
          if (listValue !== undefined) {
            if (typeof listKey === 'string') {
              schema = Object.assign({}, targetList, { [listKey]: listValue });
            } else if (typeof listKey === 'number') {
              var isPresent = targetList.items.find((s: any) => s === listValue);
              if (isPresent) {
                return;
              }
              var newItems = Object.assign([], targetList.items);
              newItems[listKey] = listValue;
              schema = Object.assign({}, targetList, { items: newItems });
            }
          } else {
            if (typeof listKey === 'string') {
              var { [listKey]: omit, ...schema } = targetList;
            } else if (typeof listKey === 'number') {
              var newItems = Object.assign([], targetList.items);
              newItems.splice(listKey, 1);
              schema = Object.assign({}, targetList, { items: newItems });
            }
          }
          state.lists[listName] = schema;
        }))
      }
    }),
    {
      name: 'lists',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ lists: state.lists }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  ));

export const useLists = (): UseLists => {
  const songs = useSongsStore((state) => state.songs);
  const { lists } = useListsStore();

  const getListForUI = useCallback((listName: any) => {
    var uiList = Object.assign({}, lists[listName]);
    Object.entries(uiList).forEach(([clave, valor]) => {
      // Si es de tipo 'libre', los salmos están dentro de 'items'
      if (clave === 'items' && Array.isArray(valor)) {
        valor = valor.map((key) => {
          return songs?.find((s) => s.key === key);
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        valor = songs?.find((s) => s.key === valor);
      }
      uiList[clave] = valor;
    });
    uiList.name = listName;
    return uiList;
  }, [lists]);

  const getItemForShare = (list: any, key: string) => {
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

  const importList = (listPath: string) => {
    const path = decodeURI(listPath);
    return RNFS.readFile(path)
      .then((content) => {
        // Obtener nombre del archivo
        // que será nombre de la lista
        const parsed = pathParse(listPath);
        var { name: listName } = parsed;
        // Generar nombre único para la lista
        var counter = 1;
        while (lists.hasOwnProperty(listName)) {
          listName = `${listName} (${counter++})`;
        }
        const changedLists = Object.assign({}, lists, {
          [listName]: JSON.parse(content),
        });
        useListsStore.setState({ lists: changedLists });
        return listName;
      })
      .catch((err) => {
        console.log('importList: ' + err.message);
        Alert.alert(
          i18n.t('alert_title.corrupt file'),
          i18n.t('alert_message.corrupt file')
        );
      });
  };

  const shareList = (
    listName: string,
    localeValue: string,
    format: ShareListType
  ) => {
    switch (format) {
      case 'native':
        const folder =
          Platform.OS === 'ios'
            ? RNFS.TemporaryDirectoryPath
            : RNFS.CachesDirectoryPath + '/';
        const fileName = listName.replace(' ', '-');
        const listPath = `${folder}${fileName}.ireslist`;
        const nativeList = lists[listName];
        RNFS.writeFile(listPath, JSON.stringify(nativeList, null, ' '), 'utf8');
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
        var list = getListForUI(listName);
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
        var list = getListForUI(listName);
        list.localeType = getLocalizedListType(list.type, localeValue);
        generateListPDF(list, defaultExportToPdfOptions).then((path) => {
          sharePDF(listName, path);
        });
        break;
    }
  };

  return {
    lists,
    getListForUI,
    shareList,
    importList,
  };
};

type UseSearch = {
  initialized: boolean;
  searchItems: SearchItem[] | undefined;
};

export const useSearch = (): UseSearch => {
  const locale = useLocale();
  const [initialized, setInitialized] = useState(false);
  const [searchItems, setSearchItems] = useState<SearchItem[]>();

  useEffect(() => {
    if (locale == undefined) {
      return;
    }
    console.log(`loading menu for "${locale}"`);
    // Construir menu de búsqueda
    setInitialized(false);
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
        /* eslint-disable quotes */
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
    setSearchItems(items);
    setInitialized(true);
  }, [locale]);

  return { initialized, searchItems };
};

export type BrotherContact = Contacts.Contact & {
  s: boolean;
};

type UseCommunity = {
  brothers: BrotherContact[];
  deviceContacts: Contacts.Contact[];
  add: (item: Contacts.Contact) => void;
  update: (id: string, item: Contacts.Contact) => void;
  remove: (item: BrotherContact) => void;
  addOrRemove: (contact: Contacts.Contact) => void;
};

type BrothersStore = {
  brothers: BrotherContact[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useBrothersStore = create<BrothersStore>()(
  persist(
    (set, get) => ({
      brothers: [],
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state
        });
      }
    }),
    {
      name: 'contacts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ brothers: state.brothers }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  ));

const checkContactsPermission = async (
  reqPerm: boolean
) => {
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

const getContacts = async (reqPerm: boolean) => {
  const hasPermission = await checkContactsPermission(reqPerm);
  if (hasPermission) {
    return Contacts.getAll();
  }
  return [];
};

type ContactsStore = {
  contacts: Contacts.Contact[];
  loaded: boolean;
  populateDeviceContacts: (reqPerm: boolean) => Promise<Contacts.Contact[]>;
};

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [],
  loaded: false,
  populateDeviceContacts: async (reqPerm: boolean) => {
    const devCts = await getContacts(reqPerm);
    set({ contacts: devCts, loaded: true });
    return get().contacts;
  }
}));

export const useCommunity = (): UseCommunity => {
  const { brothers, _hasHydrated } = useBrothersStore();
  const { contacts: deviceContacts } = useContactsStore();

  const add = (item: Contacts.Contact) => {
    var newBrother: BrotherContact = { s: false, ...item };
    var changedBrothers: BrotherContact[] = [...brothers, newBrother];
    useBrothersStore.setState({ brothers: changedBrothers });
  };

  const update = (id: string, item: Contacts.Contact) => {
    var brother = brothers.find((c) => c.recordID === id);
    if (brother) {
      var idx = brothers.indexOf(brother);
      var updatedContacts = [...brothers];
      updatedContacts[idx] = Object.assign(brother, item);
      useBrothersStore.setState({ brothers: updatedContacts });
    }
  };

  const remove = (item: BrotherContact) => {
    var idx = brothers.indexOf(item);
    var changedBrothers = brothers.filter((l, i) => i !== idx);
    useBrothersStore.setState({ brothers: changedBrothers });
  };

  const addOrRemove = (contact: Contacts.Contact) => {
    var i = brothers.findIndex((c) => c.recordID === contact.recordID);
    // Ya esta importado
    if (i !== -1) {
      var item = brothers[i];
      remove(item);
    } else {
      add(contact);
    }
  };

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }
    const refreshContacts = async () => {
      var loaded = [...brothers];
      try {
        const devCts = await useContactsStore.getState().populateDeviceContacts(false);
        brothers.forEach((c, idx) => {
          // tomar el contacto actualizado
          var devContact = devCts.find((x) => x.recordID === c.recordID);
          if (devContact) {
            loaded[idx] = devContact as BrotherContact;
          }
        });
        useBrothersStore.setState({ brothers: loaded });
      } catch {
        useBrothersStore.setState({ brothers: loaded });
      }
    };
    refreshContacts();
  }, [_hasHydrated]);

  return {
    brothers,
    deviceContacts,
    add,
    update,
    remove,
    addOrRemove,
  };
};

export type SettingsStore = {
  locale: string;
  keepAwake: boolean;
  zoomLevel: number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      locale: 'default',
      keepAwake: true,
      zoomLevel: 1,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state
        });
      }
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        locale: state.locale,
        keepAwake: state.keepAwake,
        zoomLevel: state.zoomLevel
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  ));

export const useLocale = () => {
  const { locale, _hasHydrated } = useSettingsStore();
  const localeReal = useMemo(() => {
    if (_hasHydrated) {
      return locale === 'default' ? getDefaultLocale() : locale;
    }
  }, [_hasHydrated, locale]);

  useEffect(() => {
    if (localeReal) {
      i18n.locale = localeReal;
    }
  }, [localeReal]);

  return localeReal;
};

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
