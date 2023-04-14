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
} from '@iresucito/core';
import i18n from '@iresucito/translations';
import badges from './badges';
import { generateListPDF } from './pdf';
import { GlobalStoreAsyncStorage } from './GlobalStoreAsyncStorage';
import { GlobalStore } from 'react-native-global-state-hooks';
import {
  getDefaultLocale,
  ordenClasificacion,
  NativeSongs,
  NativeExtras,
} from './util';
import { ShareListType, SongSetting } from './types';

type UseSongsMeta = {
  songs: Song[] | undefined;
  setSongSetting: (
    key: string,
    loc: string,
    setting: SongSetting,
    value: any
  ) => Promise<Song>;
};

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

const emptySongs: Song[] = [];

const songsStore = new GlobalStore(emptySongs, { metadata: { lang: undefined } },
  {
    load(loc: string) {
      return async ({ setState, getState, setMetadata }) => {
        setMetadata({ lang: loc });
        var settingsObj = await readSongSettingsFile();
        // Construir metadatos de cantos
        var metaData = NativeSongs.getSongsMeta(
          loc,
          undefined,
          settingsObj
        );
        console.log(`songsStore loading ${metaData.length} songs for "${loc}"`);
        await NativeSongs.loadSongs(loc, metaData);
        setState(metaData);
        return getState();
      };
    }
  } as any);

export const useSongsStore = songsStore.getHook();

export const useSongsMeta = (): UseSongsMeta => {
  const locale = useLocale();
  const [songs, songsActions, songsMeta] = useSongsStore();

  useEffect(() => {
    if (songsMeta.lang !== locale) {
      // @ts-ignore
      songsActions.load(locale);
    }
  }, [locale]);

  const setSongSetting = async (
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
    // @ts-ignore
    var updated = await songsActions.load(locale);
    return updated.find(song => song.key == key) as Song;
  }

  return {
    songs,
    setSongSetting,
  };
};

type Lists = {
  [listName: string]: any;
};

export type ListForUI = {
  name: string;
  type: string;
};

type UseLists = {
  lists: Lists;
  initLists: (value: any) => void;
  addList: (listName: string, type: ListType) => void;
  removeList: (listName: string) => void;
  renameList: (listName: string, newName: string) => void;
  setList: (listName: string, listKey: string, listValue: any) => void;
  getListForUI: (listName: any) => any;
  getListsForUI: (locale: string) => ListForUI[];
  shareList: (listName: string, loc: string, type: ShareListType) => void;
  importList: (listPath: string) => Promise<string | void>;
};

const listsStore = new GlobalStoreAsyncStorage<Lists, any>(
  {},
  { asyncStorageKey: 'lists' }
);

const useListsStore = listsStore.getHook();

export const useLists = (): UseLists => {
  const [songs] = useSongsStore();
  const [initialized, setInitialized] = useState(false);
  const [lists, initLists] = useListsStore();

  const addList = useCallback((listName: string, type: ListType) => {
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
    const changedLists = Object.assign({}, lists, { [listName]: schema });
    initLists(changedLists);
  }, []);

  const removeList = useCallback((listName: string) => {
    const changedLists = Object.assign({}, lists);
    delete changedLists[listName];
    initLists(changedLists);
  }, []);

  const renameList = useCallback((listName: string, newName: string) => {
    const list = lists[listName];
    delete lists[listName];
    const changedLists = Object.assign({}, lists, { [newName]: list });
    initLists(changedLists);
  }, []);

  const setList = useCallback((listName: string, listKey: string, listValue: any) => {
    const targetList = lists[listName];
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
    const changedLists = Object.assign({}, lists, { [listName]: schema });
    initLists(changedLists);
  }, []);

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

  const migrateLists = useCallback(
    (items: any) => {
      // Verificar cada lista para migrar en caso
      // de ser necesario
      Object.keys(items).forEach((name) => {
        var listMap = items[name];
        // Listas sin número de versión
        // Los cantos se almacenaban con nombre
        // Y deben pasar a almacenarse las claves
        if (!listMap.version) {
          Object.entries(listMap).forEach(([clave, valor]) => {
            // Si es de tipo 'libre', los salmos están dentro de 'items'
            if (clave === 'items' && Array.isArray(valor)) {
              valor = valor.map((nombre) => {
                var theSong = songs?.find((s) => s.nombre === nombre);
                if (theSong) {
                  return theSong.key;
                }
                return null;
              });
            } else if (getEsSalmo(clave) && valor !== null) {
              var theSong = songs?.find((s) => s.nombre === valor);
              if (theSong) {
                valor = theSong.key;
              } else {
                valor = null;
              }
            }
            // Guardar solo la clave del canto
            listMap[clave] = valor;
          });
          listMap.version = 1;
        }
      });
    },
    [songs]
  );

  const getListsForUI = useCallback((localeValue: string): ListForUI[] => {
    var listNames = Object.keys(lists);
    return listNames.map((name) => {
      var listMap = lists[name];
      return {
        name: name,
        type: getLocalizedListType(listMap.type, localeValue),
      };
    });
  }, []);

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
        initLists(changedLists);
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

  // useEffect(() => {
  //   if (initialized === true && lists && Platform.OS === 'ios') {
  //     clouddata.save('lists', lists);
  //   }
  // }, [lists, initialized]);

  useEffect(() => {
    // Solo inicializar cuando
    // esten cargados los cantos
    // La migracion de listas depende de ello
    if (initialized === false && songs && lists) {
      migrateLists(lists);
      initLists(lists);
      setInitialized(true);
      // TODO
      // IDEA: al abrir la pantalla de listas, cargar las
      // listas desde iCloud, y si hay cambios, consultar
      // al usuario si desea tomar los cambios y aplicarlos
      // clouddata.load({ key: 'lists' }).then(res => {
      //   console.log('loaded from iCloud', res);
      // });
    }
  }, [initialized, songs, lists, migrateLists, initLists]);

  return {
    lists,
    initLists,
    addList,
    removeList,
    renameList,
    setList,
    getListForUI,
    getListsForUI,
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
  loaded: boolean;
  add: (item: Contacts.Contact) => void;
  update: (id: string, item: Contacts.Contact) => void;
  remove: (item: BrotherContact) => void;
  addOrRemove: (contact: Contacts.Contact) => void;
  populateDeviceContacts: () => Promise<void>;
};

const brothersStore = new GlobalStoreAsyncStorage<BrotherContact[], any>([], {
  asyncStorageKey: 'contacts',
});

const useBrothersStore = brothersStore.getHook();

export const useCommunity = (): UseCommunity => {
  const [brothers, initBrothers, { isAsyncStorageReady }] = useBrothersStore();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [deviceContacts, initDeviceContacts] = useState<Contacts.Contact[]>([]);

  const add = (item: Contacts.Contact) => {
    var newBrother: BrotherContact = { s: false, ...item };
    var changedBrothers: BrotherContact[] = [...brothers, newBrother];
    initBrothers(changedBrothers);
  };

  const update = (id: string, item: Contacts.Contact) => {
    var brother = brothers.find((c) => c.recordID === id);
    if (brother) {
      var idx = brothers.indexOf(brother);
      var updatedContacts = [...brothers];
      updatedContacts[idx] = Object.assign(brother, item);
      initBrothers(updatedContacts);
    }
  };

  const remove = (item: BrotherContact) => {
    var idx = brothers.indexOf(item);
    var changedBrothers = brothers.filter((l, i) => i !== idx);
    initBrothers(changedBrothers);
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

  const checkContactsPermission = async (
    reqPerm: boolean
  ): Promise<boolean | undefined> => {
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

  const getContacts = useCallback(
    async (reqPerm: boolean): Promise<Contacts.Contact[]> => {
      const hasPermission = await checkContactsPermission(reqPerm);
      if (hasPermission) {
        return Contacts.getAll();
      }
      return [];
    },
    []
  );

  useEffect(() => {
    if (!isAsyncStorageReady) {
      return;
    }
    const refreshContacts = async () => {
      var loaded = [...brothers];
      try {
        const devCts = await getContacts(false);
        initDeviceContacts(devCts);
        brothers.forEach((c, idx) => {
          // tomar el contacto actualizado
          var devContact = devCts.find((x) => x.recordID === c.recordID);
          if (devContact) {
            loaded[idx] = devContact as BrotherContact;
          }
        });
        initBrothers(loaded);
      } catch {
        initBrothers(loaded);
      }
    };
    refreshContacts();
  }, [isAsyncStorageReady]);

  const populateDeviceContacts = useCallback(async () => {
    const devCts = await getContacts(true);
    initDeviceContacts(devCts);
    setLoaded(true);
  }, [getContacts]);

  return {
    brothers,
    deviceContacts,
    add,
    update,
    remove,
    addOrRemove,
    populateDeviceContacts,
    loaded,
  };
};

export type SettingsType = {
  locale: string;
  keepAwake: boolean;
  zoomLevel: number;
};

const settingsStore = new GlobalStoreAsyncStorage<SettingsType, any>(
  { locale: 'default', keepAwake: true, zoomLevel: 1 },
  {
    asyncStorageKey: 'settings',
  }
);

export const useSettingsStore = settingsStore.getHook();

export const useLocale = () => {
  const settings = useSettingsStore();
  const [{ locale }, _, { isAsyncStorageReady }] = settings;
  const localeReal = useMemo(() => {
    if (isAsyncStorageReady) {
      return locale === 'default' ? getDefaultLocale() : locale;
    }
  }, [isAsyncStorageReady, locale]);

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
