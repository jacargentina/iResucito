// @flow
import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Alert, Platform, Share } from 'react-native';
import RNFS from 'react-native-fs';
import I18n from './translations';
import badges from './badges';
import { localdata, clouddata } from './data';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import {
  getEsSalmo,
  getDefaultLocale,
  getFriendlyText,
  getFriendlyTextForListType,
  getContacts,
  NativeSongs,
  NativeStyles
} from './util';

const SongsIndexPatchPath =
  RNFS.DocumentDirectoryPath + '/SongsIndexPatch.json';

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
              //var textoParrafo = '';
              var i = index; // loop de i
              while (i < lines.length) {
                //textoParrafo += `${lines[i].texto}\n`;
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

const useSettings = () => {
  const [initialized, setInitialized] = useState(false);
  const [keys, initKeys] = useState();

  const setKey = (key, value) => {
    const updatedKeys = Object.assign({}, keys, { [key]: value });
    I18n.locale = getLocaleReal(updatedKeys.locale);
    initKeys(updatedKeys);
  };

  const getLocaleReal = (rawLoc: string) => {
    var locale = rawLoc === 'default' ? getDefaultLocale() : rawLoc;
    return locale;
  };

  useEffect(() => {
    if (keys && initialized) {
      localdata.save({
        key: 'settings',
        data: keys
      });
    }
  }, [keys, initialized]);

  useEffect(() => {
    localdata
      .load({
        key: 'settings'
      })
      .then(data => {
        if (!data) {
          data = {
            developerMode: false,
            keepAwake: true,
            locale: 'default'
          };
        }
        I18n.locale = getLocaleReal(data.locale);
        initKeys(data);
        setInitialized(true);
      });
  }, []);

  return { keys, initKeys, setKey, getLocaleReal };
};

const useSongsMeta = (locale: any) => {
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
          .catch(() => {
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

  useEffect(() => {
    if (locale) {
      // Cargar parche del indice si existe
      readLocalePatch()
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
    }
  }, [locale, indexPatchExists]);

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

export const useSearchSongs = (
  songs: any,
  filterParam: any,
  filterProp: any
): any => {
  const [navFilter, setNavFilter] = useState();
  const [showSalmosBadge, setShowSalmosBadge] = useState();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState();

  useEffect(() => {
    if (filterParam) {
      setNavFilter(filterParam);
    }
    if (filterProp) {
      setNavFilter(filterProp);
    }
  }, [filterParam, filterProp]);

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
    setShowSalmosBadge(navFilter == null || !navFilter.hasOwnProperty('etapa'));
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
  const [initialized, setInitialized] = useState(false);
  const [lists, initLists] = useState({});

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

  useEffect(() => {
    if (lists && initialized) {
      var item = { key: 'lists', data: lists };
      localdata.save(item);
      if (Platform.OS == 'ios') {
        clouddata.save(item);
      }
    }
  }, [lists, initialized]);

  useEffect(() => {
    localdata
      .load({
        key: 'lists'
      })
      .then(data => {
        initLists(data);
        setInitialized(true);
      });
    // TODO
    // IDEA: al abrir la pantalla de listas, cargar las
    // listas desde iCloud, y si hay cambios, consultar
    // al usuario si desea tomar los cambios y aplicarlos
    // clouddata.load({ key: 'lists' }).then(res => {
    //   console.log('loaded from iCloud', res);
    // });
  }, []);

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
    shareList
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
    setInitialized(true);
  }, [locale, developerMode]);

  return { initialized, searchItems };
};

const useCommunity = () => {
  const [initialized, setInitialized] = useState(false);
  const [brothers, initBrothers] = useState([]);
  const [lastThumbsCacheDir, setLastThumbsCacheDir] = useState();

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

  useEffect(() => {
    if (brothers && initialized && lastThumbsCacheDir) {
      // sólo actualizar si cambió el directorio de caches
      if (lastThumbsCacheDir !== RNFS.CachesDirectoryPath) {
        getContacts().then(currentContacts => {
          brothers.forEach(c => {
            // tomar los datos actualizados
            var currContact = currentContacts.find(
              x => x.recordID === c.recordID
            );
            update(c.recordID, currContact);
          });
          // guardar directorio nuevo
          localdata.save({
            key: 'lastCachesDirectoryPath',
            data: RNFS.CachesDirectoryPath
          });
        });
      }
    }
  }, [brothers, initialized, lastThumbsCacheDir]);

  useEffect(() => {
    if (brothers && initialized) {
      var item = { key: 'contacts', data: brothers };
      localdata.save(item);
      if (Platform.OS == 'ios') {
        clouddata.save(item);
      }
    }
  }, [brothers, initialized]);

  useEffect(() => {
    localdata
      .getBatchData([{ key: 'contacts' }, { key: 'lastCachesDirectoryPath' }])
      .then(result => {
        const [contacts, lastCachesDirectoryPath] = result;
        initBrothers(contacts);
        setLastThumbsCacheDir(
          DeviceInfo.isEmulator() ? null : lastCachesDirectoryPath
        );
        setInitialized(true);
      });
  }, []);

  return { brothers, initBrothers, add, update, remove, addOrRemove };
};

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [transportNote, setTransportNote] = useState();
  const community = useCommunity();
  const settings = useSettings();

  const locale = settings.keys ? settings.keys.locale : 'default';
  const developerMode = settings.keys ? settings.keys.developerMode : false;

  const songsMeta = useSongsMeta(locale);
  const search = useSearch(locale, developerMode);
  const lists = useLists(songsMeta.songs);

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
        settings,
        songsMeta,
        search,
        lists,
        community,
        sharePDF,
        generatePDF,
        shareIndexPatch,
        transportNote,
        setTransportNote
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
