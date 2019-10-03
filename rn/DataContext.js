// @flow
import React, { useState, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import NavigationService from './navigation/NavigationService';
import Share from 'react-native-share'; // eslint-disable-line import/default
import Contacts from 'react-native-contacts';
import { ActionSheet, Toast } from 'native-base';
import RNFS from 'react-native-fs';
import badges from './badges';
import { clouddata } from './clouddata';
import usePersist from './usePersist';
import {
  getEsSalmo,
  getDefaultLocale,
  getFriendlyText,
  getFriendlyTextForListType,
  ordenClasificacion,
  NativeSongs,
  NativeExtras
} from './util';
import I18n from '../translations';
import pathParse from 'path-parse';

const merge = require('deepmerge');

const useSongsMeta = (locale: string) => {
  const [indexPatchExists, setIndexPatchExists] = useState();
  const [ratingsFileExists, setRatingsFileExists] = useState();
  const [songs, setSongs] = useState();
  const [localeSongs, setLocaleSongs] = useState([]);

  const initializeSingleSong = song => {
    if (!songs) {
      return;
    }
    var idx = songs.findIndex(i => i.key == song.key);
    var prev = songs.slice(0, idx);
    var next = songs.slice(idx + 1);
    setSongs([...prev, song, ...next]);
  };

  const readLocalePatch = (): Promise<?SongIndexPatch> => {
    if (!indexPatchExists) {
      return Promise.resolve();
    }
    return NativeExtras.readPatch()
      .then(patchJSON => {
        return JSON.parse(patchJSON);
      })
      .catch(() => {
        return NativeExtras.deletePatch().then(() => {
          setIndexPatchExists(false);
          Alert.alert(
            I18n.t('alert_title.corrupt patch'),
            I18n.t('alert_message.corrupt patch')
          );
        });
      });
  };

  const saveLocalePatch = (patchObj: ?SongIndexPatch) => {
    var json = JSON.stringify(patchObj, null, ' ');
    return NativeExtras.savePatch(json).then(() => {
      setIndexPatchExists(true);
    });
  };

  const getSongLocalePatch = (song: Song): SongPatch => {
    return readLocalePatch().then(patchObj => {
      if (patchObj && patchObj[song.key]) {
        return patchObj[song.key];
      }
    });
  };

  const readAllLocaleSongs = (locale: string) => {
    return NativeSongs.readLocaleSongs(locale)
      .then(items => {
        var loc = locale.split('-')[0];
        if (loc === locale) {
          return items;
        }
        // If locale contains country
        // try with country code removed
        return NativeSongs.readLocaleSongs(loc).then(result => {
          return items.concat(result);
        });
      })
      .then(allItems => {
        setLocaleSongs(allItems);
      });
  };

  const setSongPatch = (song: Song, locale: string, patch?: SongPatchData) => {
    if (patch && patch.file && patch.file.endsWith('.txt'))
      throw new Error('file con .txt! Pasar sin extension.');

    return Promise.all([readLocalePatch(), readSongsRatingFile()]).then(
      values => {
        var [patchObj: SongIndexPatch, ratingsObj: SongRatingFile] = values;
        if (!patchObj) patchObj = {};
        if (patch) {
          if (patch.rename) {
            patch.rename = patch.rename.trim();
          }
          const localePatch: SongPatch = {
            [locale]: patch
          };
          if (!patchObj[song.key]) {
            patchObj[song.key] = {};
          }
          var updatedPatch = merge(patchObj[song.key], localePatch);
          patchObj[song.key] = updatedPatch;
          Toast.show({
            text: I18n.t('ui.locale patch added', {
              song: song.titulo
            }),
            duration: 5000,
            type: 'success',
            buttonText: 'Ok'
          });
        } else {
          delete patchObj[song.key][locale];
          Toast.show({
            text: I18n.t('ui.locale patch removed', { song: song.titulo }),
            duration: 5000,
            type: 'success',
            buttonText: 'Ok'
          });
        }
        var updatedSong = NativeSongs.getSingleSongMeta(
          song.key,
          locale,
          patchObj,
          ratingsObj
        );
        return NativeSongs.loadSingleSong(locale, updatedSong, patchObj)
          .then(() => {
            initializeSingleSong(updatedSong);
            return saveLocalePatch(patchObj);
          })
          .then(() => {
            return readAllLocaleSongs(locale);
          })
          .then(() => {
            return updatedSong;
          });
      }
    );
  };

  const clearIndexPatch = () => {
    if (indexPatchExists === true) {
      return NativeExtras.deletePatch().then(() => {
        setIndexPatchExists(false);
      });
    }
  };

  const readSongsRatingFile = (): Promise<?SongRatingFile> => {
    if (!ratingsFileExists) {
      return Promise.resolve();
    }
    return NativeExtras.readRatings().then(ratingsJSON => {
      return JSON.parse(ratingsJSON);
    });
  };

  const saveSongsRatingFile = (ratingsObj: SongRatingFile) => {
    var json = JSON.stringify(ratingsObj, null, ' ');
    return NativeExtras.saveRatings(json).then(() => {
      setRatingsFileExists(true);
    });
  };

  const setSongRating = (songKey: string, locale: string, value: number) => {
    return Promise.all([readLocalePatch(), readSongsRatingFile()]).then(
      values => {
        var [patchObj: SongIndexPatch, ratingsObj: SongRatingFile] = values;
        if (!ratingsObj) {
          ratingsObj = {};
        }
        if (!ratingsObj[songKey]) {
          ratingsObj[songKey] = {};
        }
        ratingsObj[songKey] = Object.assign({}, ratingsObj[songKey], {
          [locale]: value
        });
        return saveSongsRatingFile(ratingsObj).then(() => {
          var updatedSong = NativeSongs.getSingleSongMeta(
            songKey,
            locale,
            patchObj,
            ratingsObj
          );
          return NativeSongs.loadSingleSong(locale, updatedSong, patchObj).then(
            () => {
              initializeSingleSong(updatedSong);
            }
          );
        });
      }
    );
  };

  const clearSongsRatings = () => {
    if (ratingsFileExists === true) {
      return NativeExtras.deleteRatings().then(() => {
        setRatingsFileExists(false);
      });
    }
  };

  const loadFlags = () => {
    NativeExtras.patchExists().then(exists => {
      setIndexPatchExists(exists);
    });
    NativeExtras.ratingsExists().then(exists => {
      setRatingsFileExists(exists);
    });
  };

  const loadSongs = () => {
    if (
      I18n.locale &&
      indexPatchExists !== undefined &&
      ratingsFileExists !== undefined
    ) {
      // Cargar parche del indice si existe
      Promise.all([readLocalePatch(), readSongsRatingFile()]).then(values => {
        const [patchObj: SongIndexPatch, ratingsObj: SongRatingFile] = values;
        // Construir metadatos de cantos
        var metaData = NativeSongs.getSongsMeta(
          I18n.locale,
          patchObj,
          ratingsObj
        );
        return NativeSongs.loadSongs(I18n.locale, metaData, patchObj).then(
          () => {
            setSongs(metaData);
            return readAllLocaleSongs(I18n.locale);
          }
        );
      });
    }
  };

  useEffect(() => {
    loadSongs();
  }, [locale, indexPatchExists, ratingsFileExists]);

  useEffect(() => {
    loadFlags();
  }, []);

  return {
    songs,
    setSongs,
    localeSongs,
    setLocaleSongs,
    indexPatchExists,
    getSongLocalePatch,
    setSongPatch,
    clearIndexPatch,
    ratingsFileExists,
    clearSongsRatings,
    setSongRating,
    loadSongs
  };
};

const useLists = (songs: any) => {
  const [initialized, setInitialized] = useState(false);
  const [imported, setImported] = useState();
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
          nota: null
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
          nota: null
        });
        break;
    }
    const changedLists = Object.assign({}, lists, { [listName]: schema });
    initLists(changedLists);
  };

  const removeList = listName => {
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
      if (typeof listKey == 'string')
        schema = Object.assign({}, targetList, { [listKey]: listValue });
      else if (typeof listKey == 'number') {
        var isPresent = targetList.items.find(s => s == listValue);
        if (isPresent) {
          return;
        }
        var newItems = Object.assign([], targetList.items);
        newItems[listKey] = listValue;
        schema = Object.assign({}, targetList, { items: newItems });
      }
    } else {
      if (typeof listKey == 'string') {
        /* eslint-disable no-unused-vars */
        var { [listKey]: omit, ...schema } = targetList;
      } else if (typeof listKey == 'number') {
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
        valor = valor.map(key => {
          return songs.find(s => s.key == key);
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        valor = songs.find(s => s.key == valor);
      }
      uiList[clave] = valor;
    });
    return uiList;
  };

  const migrateLists = (lists: any) => {
    // Verificar cada lista para migrar en caso
    // de ser necesario
    Object.keys(lists).forEach(name => {
      var listMap = lists[name];
      // Listas sin número de versión
      // Los cantos se almacenaban con nombre
      // Y deben pasar a almacenarse las claves
      if (!listMap.version) {
        Object.entries(listMap).forEach(([clave, valor]) => {
          // Si es de tipo 'libre', los salmos están dentro de 'items'
          if (clave === 'items' && Array.isArray(valor)) {
            valor = valor.map(nombre => {
              var theSong = songs.find(s => s.nombre == nombre);
              if (theSong) {
                return theSong.key;
              }
              return null;
            });
          } else if (getEsSalmo(clave) && valor !== null) {
            var theSong = songs.find(s => s.nombre == valor);
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
  };

  const getListsForUI = () => {
    var listNames = Object.keys(lists);
    return listNames.map(name => {
      var listMap = lists[name];
      return {
        name: name,
        type: getFriendlyTextForListType(listMap.type)
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
        return getFriendlyText(key) + ': ' + valor;
      }
    }
    return null;
  };

  const importList = (listPath: string) => {
    const path = decodeURI(listPath).replace('file://', '');
    RNFS.readFile(path)
      .then(content => {
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
          [listName]: JSON.parse(content)
        });
        initLists(changedLists);
        setImported(listName);
      })
      .catch(err => {
        Alert.alert(
          I18n.t('alert_title.corrupt file'),
          I18n.t('alert_message.corrupt file')
        );
      });
  };

  const chooseListTypeForAdd = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('list_type.eucharist'),
          I18n.t('list_type.word'),
          I18n.t('list_type.other'),
          I18n.t('ui.cancel')
        ],
        cancelButtonIndex: 3,
        title: I18n.t('ui.lists.type')
      },
      index => {
        var type = null;
        index = Number(index);
        switch (index) {
          case 0:
            type = 'eucaristia';
            break;
          case 1:
            type = 'palabra';
            break;
          case 2:
            type = 'libre';
            break;
        }
        if (type !== null)
          NavigationService.navigate('ListName', {
            action: 'create',
            type: type
          });
      }
    );
  };

  const shareList = (listName: string, useNative: boolean) => {
    var sharePromise = null;
    if (useNative) {
      const folder =
        Platform.OS == 'ios'
          ? RNFS.TemporaryDirectoryPath
          : RNFS.CachesDirectoryPath + '/';
      const fileName = listName.replace(' ', '-');
      const listPath = `${folder}${fileName}.ireslist`;
      const nativeList = lists[listName];
      RNFS.writeFile(listPath, JSON.stringify(nativeList, null, ' '), 'utf8');
      sharePromise = Share.open({
        title: I18n.t('ui.share'),
        message: null,
        subject: `iResucitó - ${listName}`,
        url: `file://${listPath}`,
        failOnCancel: false
      });
    } else {
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
        items.push(getItemForShare(list, 'paz'));
        items.push(getItemForShare(list, 'comunion-pan'));
        items.push(getItemForShare(list, 'comunion-caliz'));
        items.push(getItemForShare(list, 'salida'));
        items.push(getItemForShare(list, 'nota'));
      }
      var message = items.filter(n => n).join('\n');
      sharePromise = Share.open({
        title: I18n.t('ui.share'),
        message: message,
        subject: `iResucitó - ${listName}`,
        url: null,
        failOnCancel: false
      });
    }
    if (sharePromise) {
      sharePromise
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    }
  };

  useEffect(() => {
    if (initialized === true && lists && Platform.OS == 'ios') {
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
  }, [songs, lists]);

  useEffect(() => {
    const handler = event => {
      importList(event.url);
    };
    Linking.addEventListener('url', handler);
    return function cleanup() {
      Linking.removeEventListener('url', handler);
    };
  }, [lists]);

  useEffect(() => {
    if (imported) {
      NavigationService.navigate('Lists');
      NavigationService.navigate('ListDetail', { listName: imported });
    }
  }, [imported]);

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
    chooseListTypeForAdd
  };
};

const useSearch = (locale: string, developerMode: boolean) => {
  const [initialized, setInitialized] = useState(false);
  const [searchItems, setSearchItems] = useState();

  useEffect(() => {
    // Construir menu de búsqueda
    setInitialized(false);
    var items: Array<SearchItem> = [
      {
        title_key: 'search_title.ratings',
        note: I18n.t('search_note.ratings'),
        route: 'SongList',
        params: { filter: null, sort: ordenClasificacion },
        badge: null
      },
      {
        title_key: 'search_title.alpha',
        note: I18n.t('search_note.alpha'),
        route: 'SongList',
        chooser: I18n.t('search_tabs.all'),
        params: { filter: null },
        badge: badges.alpha
      },
      {
        title_key: 'search_title.stage',
        divider: true
      },
      {
        title_key: 'search_title.precatechumenate',
        note: I18n.t('search_note.precatechumenate'),
        route: 'SongList',
        params: { filter: { stage: 'precatechumenate' } },
        badge: badges.precatechumenate
      },
      {
        title_key: 'search_title.catechumenate',
        note: I18n.t('search_note.catechumenate'),
        route: 'SongList',
        params: { filter: { stage: 'catechumenate' } },
        badge: badges.catechumenate
      },
      {
        title_key: 'search_title.election',
        note: I18n.t('search_note.election'),
        route: 'SongList',
        params: { filter: { stage: 'election' } },
        badge: badges.election
      },
      {
        title_key: 'search_title.liturgy',
        note: I18n.t('search_note.liturgy'),
        route: 'SongList',
        params: { filter: { stage: 'liturgy' } },
        badge: badges.liturgy
      },
      {
        title_key: 'search_title.liturgical time',
        divider: true
      },
      {
        title_key: 'search_title.advent',
        note: I18n.t('search_note.advent'),
        route: 'SongList',
        params: { filter: { advent: true } },
        badge: null
      },
      {
        title_key: 'search_title.christmas',
        note: I18n.t('search_note.christmas'),
        route: 'SongList',
        params: { filter: { christmas: true } },
        badge: null
      },
      {
        title_key: 'search_title.lent',
        note: I18n.t('search_note.lent'),
        route: 'SongList',
        params: { filter: { lent: true } },
        badge: null
      },
      {
        title_key: 'search_title.easter',
        note: I18n.t('search_note.easter'),
        route: 'SongList',
        params: { filter: { easter: true } },
        badge: null
      },
      {
        title_key: 'search_title.pentecost',
        note: I18n.t('search_note.pentecost'),
        route: 'SongList',
        params: { filter: { pentecost: true } },
        badge: null
      },
      {
        title_key: 'search_title.liturgical order',
        divider: true
      },
      {
        title_key: 'search_title.entrance',
        note: I18n.t('search_note.entrance'),
        route: 'SongList',
        params: { filter: { entrance: true } },
        badge: null,
        chooser: I18n.t('search_tabs.entrance'),
        chooser_listKey: ['entrada']
      },
      {
        title_key: 'search_title.peace and offerings',
        note: I18n.t('search_note.peace and offerings'),
        route: 'SongList',
        params: { filter: { 'peace and offerings': true } },
        badge: null,
        chooser: I18n.t('search_tabs.peace and offerings'),
        chooser_listKey: ['paz']
      },
      {
        title_key: 'search_title.fraction of bread',
        note: I18n.t('search_note.fraction of bread'),
        route: 'SongList',
        params: { filter: { 'fraction of bread': true } },
        badge: null,
        chooser: I18n.t('search_tabs.fraction of bread'),
        chooser_listKey: ['comunion-pan']
      },
      {
        title_key: 'search_title.communion',
        note: I18n.t('search_note.communion'),
        route: 'SongList',
        params: { filter: { communion: true } },
        badge: null,
        chooser: I18n.t('search_tabs.communion'),
        chooser_listKey: ['comunion-pan', 'comunion-caliz']
      },
      {
        title_key: 'search_title.exit',
        note: I18n.t('search_note.exit'),
        route: 'SongList',
        params: { filter: { exit: true } },
        badge: null,
        chooser: I18n.t('search_tabs.exit'),
        chooser_listKey: ['salida']
      },
      {
        title_key: 'search_title.signing to the virgin',
        note: I18n.t('search_note.signing to the virgin'),
        route: 'SongList',
        params: { filter: { 'signing to the virgin': true } },
        badge: null,
        chooser: I18n.t('search_tabs.signing to the virgin')
      },
      {
        /* eslint-disable quotes */
        title_key: `search_title.children's songs`,
        note: I18n.t(`search_note.children's songs`),
        route: 'SongList',
        params: { filter: { "children's songs": true } },
        badge: null
      },
      {
        title_key: 'search_title.lutes and vespers',
        note: I18n.t('search_note.lutes and vespers'),
        route: 'SongList',
        params: { filter: { 'lutes and vespers': true } },
        badge: null
      }
    ];
    items = items.map(item => {
      if (item.params) {
        item.params.title_key = item.title_key;
      }
      return item;
    });
    if (developerMode === true) {
      items.unshift({
        title_key: 'search_title.unassigned',
        note: I18n.t('search_note.unassigned'),
        route: 'UnassignedList',
        params: { filter: null },
        badge: null
      });
    }
    setSearchItems(items);
    setInitialized(true);
  }, [locale, developerMode]);

  return { initialized, searchItems };
};

const useCommunity = () => {
  const [initialized, setInitialized] = useState(false);
  const [brothers, initBrothers] = usePersist('contacts', 'object', []);
  const [deviceContacts, initDeviceContacts] = useState();

  const add = item => {
    var changedContacts = [...brothers, item];
    initBrothers(changedContacts);
  };

  const update = (id, item) => {
    var contact = brothers.find(c => c.recordID === id);
    var idx = brothers.indexOf(contact);
    var updatedContacts = [...brothers];
    updatedContacts[idx] = Object.assign(contact, item);
    initBrothers(updatedContacts);
  };

  const remove = item => {
    var idx = brothers.indexOf(item);
    var changedContacts = brothers.filter((l, i) => i !== idx);
    initBrothers(changedContacts);
  };

  const addOrRemove = contact => {
    var i = brothers.findIndex(c => c.recordID == contact.recordID);
    // Ya esta importado
    if (i !== -1) {
      var item = brothers[i];
      remove(item);
    } else {
      add(contact);
    }
  };

  const checkContactsPermission = (reqPerm: boolean): Promise<boolean> => {
    if (Platform.OS == 'android') {
      if (reqPerm) {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        )
          .then(granted => {
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          })
          .catch(() => {
            return false;
          });
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
      }
    } else {
      return new Promise((resolve, reject) => {
        Contacts.checkPermission((err, permission) => {
          if (err) {
            reject(err);
          } else {
            if (permission === 'undefined') {
              if (reqPerm) {
                Contacts.requestPermission((err, permission) => {
                  if (err) {
                    reject(err);
                  } else {
                    if (permission === 'authorized') {
                      resolve(true);
                    }
                    if (permission === 'denied') {
                      reject(false);
                    }
                  }
                });
              } else {
                reject(false);
              }
            }
            if (permission === 'authorized') {
              resolve(true);
            }
            if (permission === 'denied') {
              reject(false);
            }
          }
        });
      });
    }
  };

  const getContacts = (reqPerm: boolean): Promise<any> => {
    return checkContactsPermission(reqPerm).then(hasPermission => {
      if (hasPermission) {
        return new Promise((resolve, reject) => {
          Contacts.getAll((err, contacts) => {
            if (err) {
              reject(err);
            } else {
              resolve(contacts);
            }
          });
        });
      }
    });
  };

  useEffect(() => {
    if (initialized === true && brothers && Platform.OS == 'ios') {
      clouddata.save('brothers', brothers);
    }
  }, [brothers, initialized]);

  const populateDeviceContacts = () => {
    return getContacts(true).then(deviceContacts => {
      initDeviceContacts(deviceContacts);
    });
  };

  const contactImport = () => {
    const promise = !deviceContacts
      ? populateDeviceContacts()
      : Promise.resolve();

    promise
      .then(() => {
        NavigationService.navigate('ContactImport');
      })
      .catch(() => {
        let message = I18n.t('alert_message.contacts permission');
        if (Platform.OS == 'ios') {
          message += '\n\n' + I18n.t('alert_message.contacts permission ios');
        }
        Alert.alert(I18n.t('alert_title.contacts permission'), message);
      });
  };

  useEffect(() => {
    if (initialized === false && brothers) {
      getContacts(false).then(deviceContacts => {
        initDeviceContacts(deviceContacts);
        brothers.forEach((c, idx) => {
          // tomar el contacto actualizado
          var devContact = deviceContacts.find(x => x.recordID === c.recordID);
          if (devContact) {
            brothers[idx] = devContact;
          }
        });
        initBrothers(brothers);
        setInitialized(true);
      });
    }
  }, [initialized, brothers]);

  return {
    brothers,
    deviceContacts,
    add,
    update,
    remove,
    addOrRemove,
    contactImport
  };
};

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  // settings
  const locale = usePersist('locale', 'string', 'default');
  const developerMode = usePersist('developerMode', 'boolean', false);
  const keepAwake = usePersist('keepAwake', 'boolean', true);
  const zoomLevel = usePersist('zoomLevel', 'number', 1);

  const [localeValue] = locale;
  const [developerModeValue] = developerMode;

  const community = useCommunity();
  const songsMeta = useSongsMeta(localeValue);
  const search = useSearch(localeValue, developerModeValue);
  const lists = useLists(songsMeta.songs);
  const loading = useState({ isLoading: false, text: '' });

  const sharePDF = (shareTitleSuffix: string, pdfPath: string) => {
    Share.open({
      title: I18n.t('ui.share'),
      subject: `iResucitó - ${shareTitleSuffix}`,
      url: `file://${pdfPath}`,
      failOnCancel: false
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  const shareIndexPatch = () => {
    var promise =
      Platform.OS == 'android' ? NativeExtras.readPatch() : Promise.resolve();
    promise.then(patchJSON => {
      Share.open({
        title: I18n.t('ui.share'),
        subject: 'iResucitó - Index patch',
        message: patchJSON,
        url: `file://${NativeExtras.getPatchUri()}`,
        failOnCancel: false
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  const getLocaleReal = (rawLoc: string) => {
    var locale = rawLoc === 'default' ? getDefaultLocale() : rawLoc;
    return locale;
  };

  useEffect(() => {
    if (localeValue) {
      I18n.locale = getLocaleReal(localeValue);
    }
  }, [localeValue]);

  return (
    <DataContext.Provider
      value={{
        songsMeta,
        search,
        lists,
        community,
        sharePDF,
        shareIndexPatch,
        loading,
        locale,
        developerMode,
        keepAwake,
        zoomLevel
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
