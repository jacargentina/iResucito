import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
} from '@iresucito/core/common';
import I18n from '@iresucito/translations';
import badges from './badges';
import { clouddata } from './clouddata';
import { generateListPDF } from './pdf';
import usePersist from './usePersist';
import {
  getDefaultLocale,
  ordenClasificacion,
  NativeSongs,
  NativeExtras,
} from './util';

type UseSongsMeta = {
  songs: any;
  setSongs: any;
  localeSongs: any;
  setLocaleSongs: any;
  settingsFileExists: any;
  clearSongSettings: any;
  setSongSetting: any;
  loadSongs: any;
};

const useSongsMeta = (locale: string): UseSongsMeta => {
  const [settingsFileExists, setSettingsFileExists] = useState();
  const [songs, setSongs] = useState();
  const [localeSongs, setLocaleSongs] = useState([]);

  const initializeSingleSong = (song) => {
    if (!songs) {
      return;
    }
    var idx = songs.findIndex((i) => i.key === song.key);
    var prev = songs.slice(0, idx);
    var next = songs.slice(idx + 1);
    setSongs([...prev, song, ...next]);
  };

  const readAllLocaleSongs = (loc: string) => {
    return NativeSongs.readLocaleSongs(loc)
      .then((items) => {
        var locNoCountry = loc.split('-')[0];
        if (locNoCountry === loc) {
          return items;
        }
        // If locale contains country
        // try with country code removed
        return NativeSongs.readLocaleSongs(locNoCountry).then((result) => {
          return items.concat(result);
        });
      })
      .then((allItems) => {
        setLocaleSongs(allItems);
      });
  };

  const clearSongSettings = useCallback(() => {
    if (settingsFileExists === true) {
      return NativeExtras.deleteSettings().then(() => {
        setSettingsFileExists(false);
      });
    }
  }, [settingsFileExists]);

  const readSongSettingsFile = useCallback(async (): Promise<
    SongSettingsFile | undefined
  > => {
    if (settingsFileExists === false) {
      return Promise.resolve();
    }
    const settingsJSON = await NativeExtras.readSettings();
    try {
      return JSON.parse(settingsJSON);
    } catch {
      // si el archivo está corrupto, eliminarlo
      clearSongSettings();
    }
  }, [settingsFileExists, clearSongSettings]);

  const saveSongSettingsFile = (settingsObj: SongSettingsFile) => {
    var json = JSON.stringify(settingsObj, null, ' ');
    return NativeExtras.saveSettings(json).then(() => {
      setSettingsFileExists(true);
    });
  };

  const setSongSetting = (
    key: string,
    loc: string,
    setting: string,
    value: any
  ): Promise<Song> => {
    return readSongSettingsFile().then((settingsObj) => {
      if (!settingsObj) {
        settingsObj = {};
      }
      if (!settingsObj[key]) {
        settingsObj[key] = {};
      }
      settingsObj[key] = Object.assign({}, settingsObj[key], {
        [loc]: { [setting]: value },
      });
      return saveSongSettingsFile(settingsObj).then(() => {
        var updatedSong = NativeSongs.getSingleSongMeta(
          key,
          loc,
          undefined,
          settingsObj
        );
        return NativeSongs.loadSingleSong(loc, updatedSong).then(() => {
          initializeSingleSong(updatedSong);
          return updatedSong;
        });
      });
    });
  };

  const loadSongs = useCallback(() => {
    if (I18n.locale && settingsFileExists !== undefined) {
      // Cargar parche del indice si existe
      readSongSettingsFile().then((settingsObj) => {
        // Construir metadatos de cantos
        var metaData = NativeSongs.getSongsMeta(
          I18n.locale,
          undefined,
          settingsObj
        );
        return NativeSongs.loadSongs(I18n.locale, metaData).then(() => {
          setSongs(metaData);
          return readAllLocaleSongs(I18n.locale);
        });
      });
    }
  }, [settingsFileExists, readSongSettingsFile]);

  useEffect(() => {
    loadSongs();
  }, [locale, loadSongs, settingsFileExists]);

  useEffect(() => {
    NativeExtras.settingsExists().then((exists) => {
      setSettingsFileExists(exists);
    });
  }, []);

  return {
    songs,
    setSongs,
    localeSongs,
    setLocaleSongs,
    settingsFileExists,
    clearSongSettings,
    setSongSetting,
    loadSongs,
  };
};

type UseLists = {
  lists: any;
  initLists: any;
  addList: any;
  removeList: any;
  renameList: any;
  getList: any;
  setList: any;
  getListForUI: any;
  getListsForUI: any;
  shareList: any;
  importList: any;
};

const useLists = (songs: any): UseLists => {
  const [initialized, setInitialized] = useState(false);
  const [lists, initLists] = usePersist('lists', 'object', {});

  const addList = (listName, type) => {
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
  };

  const removeList = (listName) => {
    const changedLists = Object.assign({}, lists);
    delete changedLists[listName];
    initLists(changedLists);
  };

  const renameList = (listName, newName) => {
    const list = lists[listName];
    delete lists[listName];
    const changedLists = Object.assign({}, lists, { [newName]: list });
    initLists(changedLists);
  };

  const getList = (listName, listKey) => {
    const targetList = lists[listName];
    return targetList[listKey];
  };

  const setList = (listName, listKey, listValue) => {
    const targetList = lists[listName];
    var schema;
    if (listValue !== undefined) {
      if (typeof listKey === 'string') {
        schema = Object.assign({}, targetList, { [listKey]: listValue });
      } else if (typeof listKey === 'number') {
        var isPresent = targetList.items.find((s) => s === listValue);
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
  };

  const getListForUI = (listName: any) => {
    var uiList = Object.assign({}, lists[listName]);
    Object.entries(uiList).forEach(([clave, valor]) => {
      // Si es de tipo 'libre', los salmos están dentro de 'items'
      if (clave === 'items' && Array.isArray(valor)) {
        valor = valor.map((key) => {
          return songs.find((s) => s.key === key);
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        valor = songs.find((s) => s.key === valor);
      }
      uiList[clave] = valor;
    });
    uiList.name = listName;
    return uiList;
  };

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
                var theSong = songs.find((s) => s.nombre === nombre);
                if (theSong) {
                  return theSong.key;
                }
                return null;
              });
            } else if (getEsSalmo(clave) && valor !== null) {
              var theSong = songs.find((s) => s.nombre === valor);
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

  const getListsForUI = (localeValue: string) => {
    var listNames = Object.keys(lists);
    return listNames.map((name) => {
      var listMap = lists[name];
      return {
        name: name,
        type: getLocalizedListType(listMap.type, localeValue),
      };
    });
  };

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
          I18n.t('alert_title.corrupt file'),
          I18n.t('alert_message.corrupt file')
        );
      });
  };

  const shareList = (
    listName: string,
    localeValue: string,
    format: 'native' | 'text' | 'pdf'
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
          title: I18n.t('ui.share'),
          subject: `iResucitó - ${listName}`,
          url: `file://${listPath}`,
          failOnCancel: false,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            err && console.log(err);
          });
        break;
      case 'text':
        var list = getListForUI(listName);
        var items = [];
        if (list.type === 'libre') {
          var cantos = list.items;
          cantos.forEach((canto, i) => {
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
          title: I18n.t('ui.share'),
          message: message,
          subject: `iResucitó - ${listName}`,
          url: null,
          failOnCancel: false,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            err && console.log(err);
          });
        break;
      case 'pdf':
        var list = getListForUI(listName);
        list.localeType = getLocalizedListType(list.type, localeValue);
        generateListPDF(list, defaultExportToPdfOptions).then((path) => {
          Share.open({
            title: I18n.t('ui.share'),
            subject: `iResucitó - ${listName}`,
            url: `file://${path}`,
            failOnCancel: false,
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              err && console.log(err);
            });
        });
        break;
    }
  };

  useEffect(() => {
    if (initialized === true && lists && Platform.OS === 'ios') {
      clouddata.save('lists', lists);
    }
  }, [lists, initialized]);

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
    getList,
    setList,
    getListForUI,
    getListsForUI,
    shareList,
    importList,
  };
};

type UseSearch = {
  initialized: any;
  searchItems: any;
};

const useSearch = (localeValue: string): UseSearch => {
  const [initialized, setInitialized] = useState(false);
  const [searchItems, setSearchItems] = useState();

  useEffect(() => {
    // Construir menu de búsqueda
    setInitialized(false);
    var items: Array<SearchItem> = [
      {
        title_key: 'search_title.ratings',
        note_key: 'search_note.ratings',
        route: 'SongList',
        params: { filter: null, sort: ordenClasificacion },
        badge: null,
      },
      {
        title_key: 'search_title.alpha',
        note_key: 'search_note.alpha',
        route: 'SongList',
        chooser: I18n.t('search_tabs.all', { locale: localeValue }),
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
        route: 'SongList',
        params: { filter: { stage: 'precatechumenate' } },
        badge: badges.precatechumenate,
      },
      {
        title_key: 'search_title.catechumenate',
        note_key: 'search_note.catechumenate',
        route: 'SongList',
        params: { filter: { stage: 'catechumenate' } },
        badge: badges.catechumenate,
      },
      {
        title_key: 'search_title.election',
        note_key: 'search_note.election',
        route: 'SongList',
        params: { filter: { stage: 'election' } },
        badge: badges.election,
      },
      {
        title_key: 'search_title.liturgy',
        note_key: 'search_note.liturgy',
        route: 'SongList',
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
        route: 'SongList',
        params: { filter: { advent: true } },
        badge: null,
      },
      {
        title_key: 'search_title.christmas',
        note_key: 'search_note.christmas',
        route: 'SongList',
        params: { filter: { christmas: true } },
        badge: null,
      },
      {
        title_key: 'search_title.lent',
        note_key: 'search_note.lent',
        route: 'SongList',
        params: { filter: { lent: true } },
        badge: null,
      },
      {
        title_key: 'search_title.easter',
        note_key: 'search_note.easter',
        route: 'SongList',
        params: { filter: { easter: true } },
        badge: null,
      },
      {
        title_key: 'search_title.pentecost',
        note_key: 'search_note.pentecost',
        route: 'SongList',
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
        route: 'SongList',
        params: { filter: { entrance: true } },
        badge: null,
        chooser: I18n.t('search_tabs.entrance', { locale: localeValue }),
        chooser_listKey: ['entrada'],
      },
      {
        title_key: 'search_title.peace and offerings',
        note_key: 'search_note.peace and offerings',
        route: 'SongList',
        params: { filter: { 'peace and offerings': true } },
        badge: null,
        chooser: I18n.t('search_tabs.peace and offerings', {
          locale: localeValue,
        }),
        chooser_listKey: ['paz'],
      },
      {
        title_key: 'search_title.fraction of bread',
        note_key: 'search_note.fraction of bread',
        route: 'SongList',
        params: { filter: { 'fraction of bread': true } },
        badge: null,
        chooser: I18n.t('search_tabs.fraction of bread', {
          locale: localeValue,
        }),
        chooser_listKey: ['comunion-pan'],
      },
      {
        title_key: 'search_title.communion',
        note_key: 'search_note.communion',
        route: 'SongList',
        params: { filter: { communion: true } },
        badge: null,
        chooser: I18n.t('search_tabs.communion', { locale: localeValue }),
        chooser_listKey: ['comunion-pan', 'comunion-caliz'],
      },
      {
        title_key: 'search_title.exit',
        note_key: 'search_note.exit',
        route: 'SongList',
        params: { filter: { exit: true } },
        badge: null,
        chooser: I18n.t('search_tabs.exit', { locale: localeValue }),
        chooser_listKey: ['salida'],
      },
      {
        title_key: 'search_title.signing to the virgin',
        note_key: 'search_note.signing to the virgin',
        route: 'SongList',
        params: { filter: { 'signing to the virgin': true } },
        badge: null,
        chooser: I18n.t('search_tabs.signing to the virgin', {
          locale: localeValue,
        }),
      },
      {
        /* eslint-disable quotes */
        title_key: `search_title.children's songs`,
        note_key: `search_note.children's songs`,
        route: 'SongList',
        params: { filter: { "children's songs": true } },
        badge: null,
      },
      {
        title_key: 'search_title.lutes and vespers',
        note_key: 'search_note.lutes and vespers',
        route: 'SongList',
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
  }, [localeValue]);

  return { initialized, searchItems };
};

type UseCommunity = {
  brothers: any;
  deviceContacts: any;
  add: any;
  update: any;
  remove: any;
  addOrRemove: any;
  populateDeviceContacts: any;
};

const useCommunity = (): UseCommunity => {
  const [brothers, initBrothers] = usePersist(
    'contacts',
    'object',
    [],
    (loaded) => {
      return getContacts(false)
        .then((devCts) => {
          initDeviceContacts(devCts);
          loaded.forEach((c, idx) => {
            // tomar el contacto actualizado
            var devContact = devCts.find((x) => x.recordID === c.recordID);
            if (devContact) {
              loaded[idx] = devContact;
            }
          });
          return loaded;
        })
        .catch(() => {
          return loaded;
        });
    }
  );
  const [deviceContacts, initDeviceContacts] = useState();

  const add = (item) => {
    var changedContacts = [...brothers, item];
    initBrothers(changedContacts);
  };

  const update = (id, item) => {
    var contact = brothers.find((c) => c.recordID === id);
    var idx = brothers.indexOf(contact);
    var updatedContacts = [...brothers];
    updatedContacts[idx] = Object.assign(contact, item);
    initBrothers(updatedContacts);
  };

  const remove = (item) => {
    var idx = brothers.indexOf(item);
    var changedContacts = brothers.filter((l, i) => i !== idx);
    initBrothers(changedContacts);
  };

  const addOrRemove = (contact) => {
    var i = brothers.findIndex((c) => c.recordID === contact.recordID);
    // Ya esta importado
    if (i !== -1) {
      var item = brothers[i];
      remove(item);
    } else {
      add(contact);
    }
  };

  const checkContactsPermission = (reqPerm: boolean): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (reqPerm) {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        )
          .then((granted) => {
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          })
          .catch(() => {
            return new Error('Sin permisos para leer contactos');
          });
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
      }
    } else {
      return Contacts.checkPermission().then((perm1) => {
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
      });
    }
  };

  const getContacts = useCallback((reqPerm: boolean): Promise<any> => {
    return checkContactsPermission(reqPerm).then((hasPermission) => {
      if (hasPermission) {
        return Contacts.getAll();
      }
    });
  }, []);

  useEffect(() => {
    if (brothers && Platform.OS === 'ios') {
      clouddata.save('brothers', brothers);
    }
  }, [brothers]);

  const populateDeviceContacts = useCallback(() => {
    return getContacts(true).then((devCts) => {
      initDeviceContacts(devCts);
    });
  }, [getContacts]);

  return {
    brothers,
    deviceContacts,
    add,
    update,
    remove,
    addOrRemove,
    populateDeviceContacts,
  };
};

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any): any => {
  // settings
  const locale = usePersist('locale', 'string', 'default');
  const keepAwake = usePersist('keepAwake', 'boolean', true);
  const zoomLevel = usePersist('zoomLevel', 'number', 1);

  const [localeValue] = locale;

  const localeReal = useMemo(() => {
    return localeValue === 'default' ? getDefaultLocale() : localeValue;
  }, [localeValue]);

  const community = useCommunity();
  const songsMeta = useSongsMeta(localeReal);
  const search = useSearch(localeReal);
  const lists = useLists(songsMeta.songs);
  const loading = useState({ isLoading: false, text: '' });

  const sharePDF = (shareTitleSuffix: string, pdfPath: string) => {
    Share.open({
      title: I18n.t('ui.share'),
      subject: `iResucitó - ${shareTitleSuffix}`,
      url: `file://${pdfPath}`,
      failOnCancel: false,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  useEffect(() => {
    if (localeReal) {
      I18n.locale = localeReal;
    }
  }, [localeReal]);

  return (
    <DataContext.Provider
      value={{
        songsMeta,
        search,
        lists,
        community,
        sharePDF,
        loading,
        locale,
        localeReal,
        keepAwake,
        zoomLevel,
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
