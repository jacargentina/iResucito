// @flow
import React, { useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet, Share } from 'react-native';
import RNFS from 'react-native-fs';
import I18n from './components/translations';
import badges from './components/badges';
import { localdata, clouddata } from './components/data';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import {
  getEsSalmo,
  getDefaultLocale,
  getFriendlyText,
  getFriendlyTextForListType,
  ordenAlfabetico,
  getContacts,
  NativeSongs,
  NativeStyles
} from './components/util';

const SongsIndexPatchPath =
  RNFS.DocumentDirectoryPath + '/SongsIndexPatch.json';

const getContactImportSanitizedItems = allContacts => {
  var grouped = allContacts.reduce(function(groups, item) {
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
  return unique;
};

export const getProcessedContacts = (
  importedContacts: Array<any>,
  text_filter: string
) => {
  if (text_filter) {
    importedContacts = importedContacts.filter(c =>
      contactFilterByText(c, text_filter)
    );
  }
  importedContacts.sort(ordenAlfabetico);
  return importedContacts;
};

export const getCurrentRouteSalmos = (
  songs: Array<any>,
  filter: any
): Array<any> => {
  var items = [];
  if (songs) {
    if (filter) {
      for (var name in filter) {
        items = songs.filter(s => s.get(name) == filter[name]);
      }
    } else {
      items = songs;
    }
  }
  return items;
};

export const getFilteredAvailableSongsForPatch = (
  localeSongs: Array<any>,
  text_filter: string
) => {
  if (text_filter) {
    localeSongs = localeSongs.filter(locSong => {
      return (
        locSong.titulo.toLowerCase().includes(text_filter.toLowerCase()) ||
        locSong.fuente.toLowerCase().includes(text_filter.toLowerCase())
      );
    });
  }
  return localeSongs;
};

var titleFontSize = 19;
var titleSpacing = 11;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 11;
var fontName = 'Franklin Gothic Medium';
var indicadorSpacing = 18;
var parrafoSpacing = 9;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var primerColumnaX = 30;
var segundaColumnaX = 330;

const generatePDF = (canto: Song, lines: Array<SongLine>) => {
  // Para centrar titulo
  return PDFLib.measureText(
    canto.titulo.toUpperCase(),
    fontName,
    titleFontSize
  ).then(sizeTitle => {
    // Para centrar fuente
    return PDFLib.measureText(canto.fuente, fontName, fuenteFontSize)
      .then(sizeFuente => {
        var y = 560;
        var x = primerColumnaX;
        const page1 = PDFPage.create().setMediaBox(
          widthHeightPixels,
          widthHeightPixels
        );
        var titleX = parseInt((widthHeightPixels - sizeTitle.width) / 2);
        page1.drawText(canto.titulo.toUpperCase(), {
          x: titleX,
          y: y,
          color: NativeStyles.titulo.color,
          fontSize: titleFontSize,
          fontName: fontName
        });
        y -= titleSpacing;
        var fuenteX = parseInt((widthHeightPixels - sizeFuente.width) / 2);
        page1.drawText(canto.fuente, {
          x: fuenteX,
          y: y,
          color: NativeStyles.lineaNormal.color,
          fontSize: fuenteFontSize,
          fontName: fontName
        });
        y -= fuenteSpacing;
        var yStart = y;
        lines.forEach((it: SongLine, index) => {
          // Mantener los bloques siempre juntos
          // Los bloques se indican con inicioParrafo == true
          // Solo si estamos en la primer columna, calculamos si puede
          // pintarse por completo el bloque sin cortes; caso contrario
          // generamos la 2da columna
          // Si es el primer bloque de todos, no tenerlo en cuenta: hay cantos
          // cuyo primer bloque es muy largo (ej. "Adónde te escondiste amado"
          //  y en este caso hay que cortarlo forzosamente
          if (it.inicioParrafo && y !== yStart && x === primerColumnaX) {
            // console.log('Inicio de Parrafo:', it.texto);
            if (y < 0) {
              x = segundaColumnaX;
              y = yStart;
            } else {
              var alturaParrafo = 0;
              var textoParrafo = '';
              var i = index; // loop de i
              while (i < lines.length) {
                textoParrafo += `${lines[i].texto}\n`;
                alturaParrafo += cantoSpacing;
                i += 1;
                if (i < lines.length && lines[i].inicioParrafo) {
                  break;
                }
              }
              // console.log(
              //   'Texto del bloque: %s, y: %s, alturaParrafo: %s, diferencia: %s',
              //   textoParrafo,
              //   y,
              //   alturaParrafo,
              //   y - alturaParrafo
              // );
              if (y - alturaParrafo <= 21) {
                x = segundaColumnaX;
                y = yStart;
              }
            }
          }
          if (it.inicioParrafo) {
            y -= parrafoSpacing;
          }
          if (it.tituloEspecial) {
            y -= parrafoSpacing * 2;
          }
          if (it.notas === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: NativeStyles.lineaNotas.color,
              fontSize: notesFontSize,
              fontName: fontName
            });
            y -= cantoSpacing;
          } else if (it.canto === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: NativeStyles.lineaNormal.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
            y -= cantoSpacing;
          } else if (it.cantoConIndicador === true) {
            page1.drawText(it.prefijo, {
              x: x,
              y: y,
              color: NativeStyles.prefijo.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
            if (it.tituloEspecial === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaTituloNotaEspecial.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
            } else if (it.textoEspecial === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaNotaEspecial.color,
                fontSize: cantoFontSize - 3,
                fontName: fontName
              });
            } else {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: NativeStyles.lineaNormal.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
            }
            y -= cantoSpacing;
          }
          // else {
          //   console.log('Sin dibujar en', y, JSON.stringify(it));
          // }
        });
        const docsDir =
          Platform.OS == 'ios'
            ? RNFS.TemporaryDirectoryPath
            : RNFS.CachesDirectoryPath + '/';
        const pdfPath = `${docsDir}${canto.titulo}.pdf`;
        return PDFDocument.create(pdfPath)
          .addPages(page1)
          .write();
      })
      .catch(err => {
        console.log('ERROR Measures', err);
      });
  });
};

const contactFilterByText = (c, text) => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (c.familyName && c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};

const useContactImportDialog = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (filter !== '') {
      var filteredContacts = contacts.filter(c =>
        contactFilterByText(c, filter)
      );
    } else {
      var filteredContacts = contacts;
    }
    filteredContacts.sort(ordenAlfabetico);
    setContacts(filteredContacts);
  }, [filter]);

  const show = () => {
    setLoading(true);
    getContacts()
      .then(contacts => {
        var filtered = contacts.filter(
          c => c.givenName.length > 0 || c.familyName.length > 0
        );
        setContacts(filtered);
        setLoading(false);
        setVisible(true);
      })
      .catch(err => {
        let message = I18n.t('alert_message.contacts permission');
        if (Platform.OS == 'ios') {
          message += '\n\n' + I18n.t('alert_message.contacts permission ios');
        }
        Alert.alert(I18n.t('alert_title.contacts permission'), message);
      });
  };

  const hide = () => {
    setVisible(false);
  };

  return { visible, loading, contacts, filter, setFilter, show, hide };
};

const useAboutDialog = () => {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return { visible, show, hide };
};

const useContactChooserDialog = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState();
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (filter !== '') {
      var filteredContacts = contacts.filter(c =>
        contactFilterByText(c, filter)
      );
    } else {
      filteredContacts = contacts;
    }
    filteredContacts.sort(ordenAlfabetico);
    setContacts(filteredContacts);
  }, [filter]);

  const show = (target, key) => {
    setTarget({ listName: target, listKey: key });
    setLoading(true);
    getContacts()
      .then(contacts => {
        var filtered = contacts.filter(
          c => c.givenName.length > 0 || c.familyName.length > 0
        );
        setContacts(filtered);
        setLoading(false);
        setVisible(true);
      })
      .catch(err => {
        let message = I18n.t('alert_message.contacts permission');
        if (Platform.OS == 'ios') {
          message += '\n\n' + I18n.t('alert_message.contacts permission ios');
        }
        Alert.alert(I18n.t('alert_title.contacts permission'), message);
      });
  };

  const hide = () => {
    setVisible(false);
  };

  return { visible, loading, contacts, filter, setFilter, show, hide, target };
};

const useListAddDialog = () => {
  const [visible, setVisible] = useState(false);
  const [listCreateType, setListCreateType] = useState();
  const [listCreateName, setListCreateName] = useState('');

  const show = type => {
    setListCreateType(type);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return {
    visible,
    listCreateType,
    listCreateName,
    setListCreateName,
    show,
    hide
  };
};

const useSalmoChooserDialog = search => {
  const [visible, setVisible] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [target, setTarget] = useState();

  useEffect(() => {
    if (search) {
      var tabs = search.filter(x => x.chooser != undefined);
      setTabs(tabs);
    }
  }, [search]);

  const show = (target, key) => {
    setTarget({ listName: target, listKey: key });
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return { visible, tabs, show, hide, target };
};

const useSalmoLocaleChooserDialog = (songs, localeSongs, getLocaleReal) => {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState();

  useEffect(() => {
    if (localeSongs) {
      const locale = getLocaleReal();
      var res = localeSongs.filter(locSong => {
        var found = songs.find(s => s.files[locale] === locSong.nombre);
        return !found;
      });
      setItems(res);
    }
  }, [localeSongs]);

  const show = salmo => {
    setTarget(salmo);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return { visible, items, show, hide, target };
};

const useCommunity = () => {
  const [brothers, initBrothers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    var filteredContacts = [];
    if (filter !== '') {
      filteredContacts = brothers.filter(c => contactFilterByText(c, filter));
    }
    filteredContacts.sort(ordenAlfabetico);
    initBrothers(filteredContacts);
  }, [filter]);

  const add = item => {
    var changedContacts = [...brothers, item];
    initBrothers(changedContacts);
  };

  const update = (id, item) => {
    var keepContacts = brothers.filter(c => c.recordID !== id);
    var changedContacts = [...keepContacts, item];
    initBrothers(changedContacts);
  };

  const remove = item => {
    var idx = brothers.indexOf(item);
    var changedContacts = brothers.filter((l, i) => i !== idx);
    initBrothers(changedContacts);
  };

  const save = () => {
    var item = { key: 'contacts', data: brothers };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };

  const refreshThumbs = (cacheDir: string, newCacheDir: string) => {
    // sólo actualizar si cambió el directorio de caches
    if (cacheDir !== newCacheDir) {
      return getContacts()
        .then(currentContacts => {
          brothers.forEach(c => {
            // tomar los datos actualizados
            var currContact = currentContacts.find(
              x => x.recordID === c.recordID
            );
            update(c.recordID, currContact);
          });
          // guardar directorio nuevo
          var item = { key: 'lastCachesDirectoryPath', data: newCacheDir };
          return localdata.save(item);
        })
        .then(() => {
          // guardar contactos refrescados
          save();
        });
    }
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

  return {
    brothers,
    filter,
    setFilter,
    save,
    refreshThumbs,
    addOrRemove,
    initBrothers
  };
};

const useSettings = () => {
  const [keys, initKeys] = useState({
    developerMode: false,
    keepAwake: true,
    locale: 'default'
  });

  const setKey = (key, value) => {
    const updatedKeys = Object.assign({}, keys, { [key]: value });
    initKeys(updatedKeys);
  };

  const getLocaleReal = () => {
    var rawLoc = keys.locale;
    var locale = rawLoc === 'default' ? getDefaultLocale() : rawLoc;
    return locale.split('-')[0];
  };

  const save = () => {
    return localdata.save({
      key: 'settings',
      data: keys
    });
  };

  return { keys, initKeys, setKey, save, getLocaleReal };
};

const useSongsMeta = () => {
  const [indexPatchExists, setIndexPatchExists] = useState(false);
  const [songs, setSongs] = useState([]);
  const [localeSongs, setLocaleSongs] = useState([]);

  const initializeSingleSong = song => {
    var idx = songs.findIndex(i => i.key == song.key);
    songs[idx] = Object.assign({}, song);
    setSongs(songs);
  };

  const readLocalePatch = () => {
    return RNFS.exists(SongsIndexPatchPath).then(exists => {
      setIndexPatchExists(exists);
      if (exists)
        return RNFS.readFile(SongsIndexPatchPath)
          .then(patchJSON => {
            return JSON.parse(patchJSON);
          })
          .catch(err => {
            return RNFS.unlink(SongsIndexPatchPath).then(() => {
              Alert.alert(
                I18n.t('alert_title.corrupt patch'),
                I18n.t('alert_message.corrupt patch')
              );
            });
          });
    });
  };

  const saveLocalePatch = (patchObj: any) => {
    var json = JSON.stringify(patchObj, null, ' ');
    return RNFS.writeFile(SongsIndexPatchPath, json, 'utf8').then(() => {
      setIndexPatchExists(true);
    });
  };

  const setSongLocalePatch = (song: Song, rawLoc: string, file?: SongFile) => {
    if (file && file.nombre.endsWith('.txt'))
      throw new Error('file con .txt! Pasar sin extension.');

    return readLocalePatch().then(patchObj => {
      var locale = rawLoc.split('-')[0];
      if (!patchObj) patchObj = {};
      if (!patchObj[song.key]) patchObj[song.key] = {};
      if (file) {
        patchObj[song.key][locale] = file.nombre;
      } else {
        delete patchObj[song.key];
      }
      var updatedSong = NativeSongs.getSingleSongMeta(
        song.key,
        locale,
        patchObj
      );
      return NativeSongs.loadSingleSong(updatedSong).then(() => {
        initializeSingleSong(updatedSong);
        return saveLocalePatch(patchObj);
      });
    });
  };

  const clearIndexPatch = () => {
    return RNFS.exists(SongsIndexPatchPath).then(exists => {
      if (exists) {
        return RNFS.unlink(SongsIndexPatchPath).then(() => {
          setIndexPatchExists(false);
        });
      }
    });
  };

  return {
    songs,
    setSongs,
    localeSongs,
    setLocaleSongs,
    readLocalePatch,
    saveLocalePatch,
    indexPatchExists,
    setSongLocalePatch,
    clearIndexPatch
  };
};

export const useSearchSongs = (songs: any, props: any): any => {
  const [navFilter, setNavFilter] = useState();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState([]);

  useEffect(() => {
    if (props.navigation) {
      var filterFromNav = props.navigation.getParam('filter', undefined);
      if (filterFromNav) {
        setNavFilter(filterFromNav);
      }
    }
    if (props.filter) {
      setNavFilter(props.filter);
    }
  }, [props.navigation, props.filter]);

  const showSalmosBadge =
    navFilter == null || !navFilter.hasOwnProperty('etapa');

  useEffect(() => {
    var result = songs;
    if (navFilter) {
      for (var name in navFilter) {
        result = result.filter(s => s[name] == navFilter[name]);
      }
    }
    if (textFilter) {
      result = result.filter(s => {
        return (
          s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
          s.fullText.toLowerCase().includes(textFilter.toLowerCase())
        );
      });
    }
    setSearch(result);
  }, [navFilter, textFilter]);

  return {
    search,
    navFilter,
    setNavFilter,
    textFilter,
    setTextFilter,
    showSalmosBadge
  };
};

const useLists = (songs: any) => {
  const [lists, initLists] = useState({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (filter !== '') {
      var filteredLists = lists.filter(c => c.name.contains(filter));
    } else {
      var filteredLists = lists;
    }
    initLists(filteredLists);
  }, [filter]);

  const addList = (listName, type) => {
    let schema = { type: type };
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
          paz: null,
          'comunion-pan': null,
          'comunion-caliz': null,
          salida: null,
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
        let { [listKey]: omit, ...schema } = targetList;
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
      if (clave === 'items') {
        valor = valor.map(nombre => {
          return songs.find(s => s.nombre == nombre);
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        valor = songs.find(s => s.nombre == valor);
      }
      uiList[clave] = valor;
    });
    return uiList;
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
      if (valor !== null && getEsSalmo(key)) {
        valor = valor.titulo;
      }
      if (valor) {
        return getFriendlyText(key) + ': ' + valor;
      }
    }
    return null;
  };

  const shareList = (listName: string) => {
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
    Share.share(
      {
        message: message,
        title: `Lista iResucitó ${listName}`,
        url: undefined
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };

  const save = () => {
    var item = { key: 'lists', data: lists };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };

  return {
    lists,
    initLists,
    addList,
    removeList,
    getList,
    setList,
    getListForUI,
    getListsForUI,
    shareList,
    save,
    filter,
    setFilter
  };
};

const useSearch = () => {
  const [searchItems, setSearchItems] = useState();

  const initSearch = (developerMode: boolean) => {
    var items: Array<SearchItem> = [
      {
        title: I18n.t('search_title.alpha'),
        note: I18n.t('search_note.alpha'),
        route: 'SalmoList',
        chooser: I18n.t('search_tabs.all'),
        params: { filter: null },
        badge: badges.Alfabético
      },
      {
        title: I18n.t('search_title.stage'),
        divider: true
      },
      {
        title: I18n.t('search_title.precatechumenate'),
        note: I18n.t('search_note.precatechumenate'),
        route: 'SalmoList',
        params: { filter: { etapa: 'Precatecumenado' } },
        badge: badges.Precatecumenado
      },
      {
        title: I18n.t('search_title.catechumenate'),
        note: I18n.t('search_note.catechumenate'),
        route: 'SalmoList',
        params: { filter: { etapa: 'Catecumenado' } },
        badge: badges.Catecumenado
      },
      {
        title: I18n.t('search_title.election'),
        note: I18n.t('search_note.election'),
        route: 'SalmoList',
        params: { filter: { etapa: 'Eleccion' } },
        badge: badges.Eleccion
      },
      {
        title: I18n.t('search_title.liturgy'),
        note: I18n.t('search_note.liturgy'),
        route: 'SalmoList',
        params: { filter: { etapa: 'Liturgia' } },
        badge: badges.Liturgia
      },
      {
        title: I18n.t('search_title.liturgical time'),
        divider: true
      },
      {
        title: I18n.t('search_title.advent'),
        note: I18n.t('search_note.advent'),
        route: 'SalmoList',
        params: { filter: { adviento: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.christmas'),
        note: I18n.t('search_note.christmas'),
        route: 'SalmoList',
        params: { filter: { navidad: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.lent'),
        note: I18n.t('search_note.lent'),
        route: 'SalmoList',
        params: { filter: { cuaresma: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.easter'),
        note: I18n.t('search_note.easter'),
        route: 'SalmoList',
        params: { filter: { pascua: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.pentecost'),
        note: I18n.t('search_note.pentecost'),
        route: 'SalmoList',
        params: { filter: { pentecostes: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.liturgical order'),
        divider: true
      },
      {
        title: I18n.t('search_title.entrance'),
        note: I18n.t('search_note.entrance'),
        route: 'SalmoList',
        params: { filter: { entrada: true } },
        badge: null,
        chooser: I18n.t('search_tabs.entrance')
      },
      {
        title: I18n.t('search_title.peace and offerings'),
        note: I18n.t('search_note.peace and offerings'),
        route: 'SalmoList',
        params: { filter: { paz: true } },
        badge: null,
        chooser: I18n.t('search_tabs.peace and offerings')
      },
      {
        title: I18n.t('search_title.fraction of bread'),
        note: I18n.t('search_note.fraction of bread'),
        route: 'SalmoList',
        params: { filter: { fraccion: true } },
        badge: null,
        chooser: I18n.t('search_tabs.fraction of bread')
      },
      {
        title: I18n.t('search_title.communion'),
        note: I18n.t('search_note.communion'),
        route: 'SalmoList',
        params: { filter: { comunion: true } },
        badge: null,
        chooser: I18n.t('search_tabs.communion')
      },
      {
        title: I18n.t('search_title.exit'),
        note: I18n.t('search_note.exit'),
        route: 'SalmoList',
        params: { filter: { final: true } },
        badge: null,
        chooser: I18n.t('search_tabs.exit')
      },
      {
        title: I18n.t('search_title.signing to the virgin'),
        note: I18n.t('search_note.signing to the virgin'),
        route: 'SalmoList',
        params: { filter: { virgen: true } },
        badge: null,
        chooser: I18n.t('search_tabs.signing to the virgin')
      },
      {
        title: /* eslint-disable quotes */ I18n.t(
          `search_title.children's songs`
        ),
        note: I18n.t(`search_note.children's songs`),
        route: 'SalmoList',
        params: { filter: { niños: true } },
        badge: null
      },
      {
        title: I18n.t('search_title.lutes and vespers'),
        note: I18n.t('search_note.lutes and vespers'),
        route: 'SalmoList',
        params: { filter: { laudes: true } },
        badge: null
      }
    ];
    items = items.map(item => {
      if (item.params) {
        item.params.title = item.title;
      }
      return item;
    });
    if (developerMode) {
      items.unshift({
        title: I18n.t('search_title.unassigned'),
        note: I18n.t('search_note.unassigned'),
        route: 'UnassignedList',
        params: { filter: null },
        badge: null
      });
    }
    setSearchItems(items);
  };

  return { searchItems, initSearch };
};

export const DataContext = React.createContext();

const DataContextWrapper = (props: any) => {
  const [transportNote, setTransportNode] = useState();
  const community = useCommunity();
  const settings = useSettings();
  const songsMeta = useSongsMeta();
  const { searchItems, initSearch } = useSearch();
  const aboutDialog = useAboutDialog();
  const contactImportDialog = useContactImportDialog();
  const contactChooserDialog = useContactChooserDialog();
  const listAddDialog = useListAddDialog();

  const { keys, setKey, save, getLocaleReal } = settings;
  const {
    songs,
    setSongs,
    localeSongs,
    setLocaleSongs,
    readLocalePatch
  } = songsMeta;
  const lists = useLists(songs);
  const salmoChooserDialog = useSalmoChooserDialog(searchItems);
  const salmoLocaleChooserDialog = useSalmoLocaleChooserDialog(
    songs,
    localeSongs,
    getLocaleReal
  );

  const initializeLocale = (locale: string) => {
    if (locale === 'default') {
      locale = getDefaultLocale();
    }
    I18n.locale = locale;
    // Construir menu de búsqueda
    initSearch(keys.developerMode);
    // Cargar parche del indice si existe
    return readLocalePatch()
      .then(patchObj => {
        // Construir metadatos de cantos
        var metaData = NativeSongs.getSongsMeta(locale, patchObj);
        return Promise.all(NativeSongs.loadSongs(metaData)).then(() => {
          setSongs(metaData);
        });
      })
      .then(() => {
        return NativeSongs.readLocaleSongs(locale).then(items => {
          setLocaleSongs(items);
        });
      });
  };

  const sharePDF = (canto: Song, pdfPath: string) => {
    Share.share(
      {
        title: `iResucitó - ${canto.titulo}`,
        url: pdfPath
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };

  const shareIndexPatch = () => {
    Share.share(
      {
        title: 'iResucitó - Index patch',
        url: SongsIndexPatchPath
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };

  return (
    <DataContext.Provider
      value={{
        initializeLocale,
        songsMeta,
        searchItems,
        settings,
        community,
        lists,
        aboutDialog,
        contactImportDialog,
        contactChooserDialog,
        salmoChooserDialog,
        salmoLocaleChooserDialog,
        listAddDialog,
        sharePDF,
        generatePDF,
        shareIndexPatch,
        transportNote,
        setTransportNode
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
