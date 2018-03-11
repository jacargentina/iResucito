export const INITIALIZE_SETUP = 'INITIALIZE_SETUP';
export const INITIALIZE_SONGS = 'INITIALIZE_SONGS';
export const INITIALIZE_SEARCH = 'INITIALIZE_SEARCH';

export const SET_SALMOS_FILTER = 'SET_SALMOS_FILTER';
export const SET_CONTACTS_FILTER = 'SET_CONTACTS_FILTER';
export const SET_ABOUT_VISIBLE = 'SET_ABOUT_VISIBLE';
export const SET_SETTINGS_VALUE = 'SET_SETTINGS_VALUE';
export const SET_CHOOSER_TARGETLIST = 'SET_CHOOSER_TARGETLIST';
export const SET_LIST_ADD_VISIBLE = 'SET_LIST_ADD_VISIBLE';
export const SET_LIST_ADD_TYPE = 'SET_LIST_ADD_TYPE';
export const SET_LIST_ADD_NAME = 'SET_LIST_ADD_NAME';
export const SET_CONTACT_IMPORT_VISIBLE = 'SET_CONTACT_IMPORT_VISIBLE';
export const SET_CONTACT_IMPORT_LOADING = 'SET_CONTACT_IMPORT_LOADING';
export const SET_CONTACT_IMPORT_ITEMS = 'SET_CONTACT_IMPORT_ITEMS';

export const SALMO_TRANSPORT = 'SALMO_TRANSPORT';

export const LIST_CREATE = 'LIST_CREATE';
export const LIST_ADD_SALMO = 'LIST_ADD_SALMO';
export const LIST_ADD_TEXT = 'LIST_ADD_TEXT';
export const LIST_ADD_CONTACT = 'LIST_ADD_CONTACT';
export const LIST_REMOVE_SALMO = 'LIST_REMOVE_SALMO';
export const LIST_DELETE = 'LIST_DELETE';
export const LIST_SHARE = 'LIST_SHARE';

export const CONTACT_SYNC = 'CONTACT_SYNC';
export const CONTACT_TOGGLE_ATTRIBUTE = 'CONTACT_TOGGLE_ATTRIBUTE';
export const CONTACT_UPDATE = 'CONTACT_UPDATE';

import { Alert, Platform, Share } from 'react-native';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import I18n from '../translations';
import {
  esLineaDeNotas,
  getDefaultLocale,
  getFriendlyText,
  getEsSalmo
} from '../util';
import search from '../search';
import SongsIndex from '../../songs';
import { localdata, clouddata } from '../data';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

export const initializeSetup = (settings, lists, contacts) => {
  return {
    type: INITIALIZE_SETUP,
    settings: settings,
    lists: lists,
    contacts: contacts || []
  };
};

export const initializeSongs = songs => {
  return {
    type: INITIALIZE_SONGS,
    items: songs
  };
};

export const openChooserDialog = (chooser, listName, listKey) => {
  return {
    type: SET_CHOOSER_TARGETLIST,
    chooser: chooser,
    list: listName,
    key: listKey
  };
};

export const closeChooserDialog = () => {
  return {
    type: SET_CHOOSER_TARGETLIST,
    chooser: null,
    list: null,
    key: null
  };
};

export const addSalmoToList = (salmo, listName, listKey) => {
  return {
    type: LIST_ADD_SALMO,
    list: listName,
    key: listKey,
    salmo: salmo
  };
};

export const addContactToList = (contact, listName, listKey) => {
  return {
    type: LIST_ADD_CONTACT,
    list: listName,
    key: listKey,
    contact: contact
  };
};

const getItemForShare = (listMap, key) => {
  if (listMap.has(key)) {
    var valor = listMap.get(key);
    if (valor !== null && getEsSalmo(key)) {
      valor = valor.titulo;
    }
    if (valor) {
      return getFriendlyText(key) + ': ' + valor;
    }
  }
  return null;
};

export const shareList = (listName, listMap) => {
  /* eslint-disable no-unused-vars */
  return dispatch => {
    var items = [];
    items.push(getItemForShare(listMap, 'ambiental'));
    items.push(getItemForShare(listMap, 'entrada'));
    items.push(getItemForShare(listMap, '1-monicion'));
    items.push(getItemForShare(listMap, '1'));
    items.push(getItemForShare(listMap, '1-salmo'));
    items.push(getItemForShare(listMap, '2-monicion'));
    items.push(getItemForShare(listMap, '2'));
    items.push(getItemForShare(listMap, '2-salmo'));
    items.push(getItemForShare(listMap, '3-monicion'));
    items.push(getItemForShare(listMap, '3'));
    items.push(getItemForShare(listMap, '3-salmo'));
    items.push(getItemForShare(listMap, 'evangelio-monicion'));
    items.push(getItemForShare(listMap, 'evangelio'));
    items.push(getItemForShare(listMap, 'paz'));
    items.push(getItemForShare(listMap, 'comunion-pan'));
    items.push(getItemForShare(listMap, 'comunion-caliz'));
    items.push(getItemForShare(listMap, 'salida'));
    items.push(getItemForShare(listMap, 'nota'));
    var message = items.filter(n => n).join('\n');
    /* eslint-disable no-console */
    console.log('Texto para compartir', message);
    Share.share(
      {
        message: message,
        title: `Lista iResucitó ${listName}`,
        url: undefined
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };
};

export const sharePDF = (canto, pdfPath) => {
  /* eslint-disable no-unused-vars */
  return dispatch => {
    Share.share(
      {
        title: `iResucitó - ${canto.titulo}`,
        url: pdfPath
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };
};

export const updateListMapText = (listName, key, text) => {
  return { type: LIST_ADD_TEXT, list: listName, key: key, text: text };
};

export const deleteList = listName => {
  return { type: LIST_DELETE, list: listName };
};

export const showListAddDialog = () => {
  return { type: SET_LIST_ADD_VISIBLE, visible: true };
};

export const hideListAddDialog = () => {
  return { type: SET_LIST_ADD_VISIBLE, visible: false };
};

export const setSalmosFilterText = (inputId, text) => {
  return { type: SET_SALMOS_FILTER, inputId: inputId, filter: text };
};

export const salmoTransport = transportTo => {
  return { type: SALMO_TRANSPORT, transportTo: transportTo };
};

export const setContactsFilterText = (inputId, text) => {
  return { type: SET_CONTACTS_FILTER, inputId: inputId, filter: text };
};

export const showAbout = () => {
  return { type: SET_ABOUT_VISIBLE, visible: true };
};

export const hideAbout = () => {
  return { type: SET_ABOUT_VISIBLE, visible: false };
};

export const updateListAddName = text => {
  return { type: SET_LIST_ADD_NAME, name: text };
};

export const updateListAddType = type => {
  return { type: SET_LIST_ADD_TYPE, value: type };
};

export const createList = (name, type) => {
  return { type: LIST_CREATE, name: name, list_type: type };
};

export const applySetting = (key, value) => {
  return { type: SET_SETTINGS_VALUE, key: key, value: value };
};

export const showContactImportDialog = () => {
  return dispatch => {
    dispatch({ type: SET_CONTACT_IMPORT_LOADING, loading: true });
    Contacts.getAll((err, contacts) => {
      dispatch({ type: SET_CONTACT_IMPORT_LOADING, loading: false });
      if (err) {
        let message = 'No se pueden cargar los contactos. ';
        if (Platform.OS == 'ios') {
          message +=
            'Otorga el permiso en la pantalla de Configuración -> iResucito -> Contactos';
        }
        Alert.alert('Contactos - Acceso denegado', message);
      } else {
        dispatch({ type: SET_CONTACT_IMPORT_ITEMS, contacts: contacts });
        dispatch({ type: SET_CONTACT_IMPORT_VISIBLE, visible: true });
      }
    });
  };
};

export const hideContactImportDialog = () => {
  return { type: SET_CONTACT_IMPORT_VISIBLE, visible: false };
};

export const syncContact = contact => {
  return { type: CONTACT_SYNC, contact: contact };
};

export const updateContact = contact => {
  return { type: CONTACT_UPDATE, contact: contact };
};

export const setContactAttribute = (contact, attribute) => {
  return {
    type: CONTACT_TOGGLE_ATTRIBUTE,
    contact: contact,
    attribute: attribute
  };
};

const ordenAlfabetico = (a, b) => {
  if (a.titulo < b.titulo) {
    return -1;
  }
  if (a.titulo > b.titulo) {
    return 1;
  }
  return 0;
};

export const processSongsMetadata = rawLocale => {
  var locale = rawLocale.split('-')[0];
  var basePath = Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/` : '';
  var songs = Object.keys(SongsIndex);
  songs = songs.map(key => {
    var localeOk = SongsIndex[key].files.hasOwnProperty(locale);
    var nombre = localeOk
      ? SongsIndex[key].files[locale]
      : SongsIndex[key].files['es'];
    var path = localeOk
      ? `${basePath}songs/${locale}/${nombre}.txt`
      : `${basePath}songs/es/${nombre}.txt`;
    var titulo = nombre.includes('-')
      ? nombre.substring(0, nombre.indexOf('-')).trim()
      : nombre;
    var fuente =
      titulo !== nombre ? nombre.substring(nombre.indexOf('-') + 1).trim() : '';
    var info = {
      titulo: titulo,
      fuente: fuente,
      nombre: nombre,
      path: path,
      fullText: null,
      lines: null,
      locale: localeOk
    };
    return Object.assign(SongsIndex[key], info);
  });
  songs.sort(ordenAlfabetico);
  return songs;
};

export const initializeSearch = () => {
  return {
    type: INITIALIZE_SEARCH,
    items: search()
  };
};

export const loadSongs = songs => {
  return songs.map(canto => {
    var loadSalmo =
      Platform.OS == 'ios'
        ? RNFS.readFile(canto.path)
        : RNFS.readFileAssets(canto.path);
    return loadSalmo
      .then(content => {
        // Separar en lineas, y quitar todas hasta llegar a las notas
        var lineas = content.replace('\r\n', '\n').split('\n');
        while (!esLineaDeNotas(lineas[0])) {
          lineas.shift();
        }
        canto.lines = lineas;
        canto.fullText = lineas.join(' ');
      })
      .catch(err => {
        canto.error = err.message;
      });
  });
};

export const initializeLocale = locale => {
  return dispatch => {
    if (locale === 'default') {
      locale = getDefaultLocale();
    }
    I18n.defaultLocale = locale;
    I18n.locale = locale;
    // Construir menu de búsqueda
    dispatch(initializeSearch());
    // Construir metadatos de cantos
    var songs = processSongsMetadata(locale);
    return Promise.all(loadSongs(songs)).then(() => {
      dispatch(initializeSongs(songs));
    });
  };
};

export const saveLists = () => {
  return (dispatch, getState) => {
    var listsJS = getState()
      .ui.get('lists')
      .toJS();
    var item = { key: 'lists', data: listsJS };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };
};

export const saveContacts = () => {
  return (dispatch, getState) => {
    var contactsJS = getState()
      .ui.get('contacts')
      .toJS();
    var item = { key: 'contacts', data: contactsJS };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };
};

export const saveSettings = () => {
  return (dispatch, getState) => {
    return localdata.save({
      key: 'settings',
      data: getState()
        .ui.get('settings')
        .toJS()
    });
  };
};

const getContacts = () => {
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        reject(err);
      } else {
        resolve(contacts);
      }
    });
  });
};

export const refreshContactsThumbs = (lastCacheDir, newCacheDir) => {
  return (dispatch, getState) => {
    // sólo actualizar si cambió el directorio de caches
    if (lastCacheDir !== newCacheDir) {
      var contactsJS = getState()
        .ui.get('contacts')
        .toJS();
      return getContacts()
        .then(currentContacts => {
          contactsJS.forEach(c => {
            // tomar los datos actualizados
            var currContact = currentContacts.find(
              x => x.recordID === c.recordID
            );
            dispatch(updateContact(currContact));
          });
          // guardar directorio nuevo
          var item = { key: 'lastCachesDirectoryPath', data: newCacheDir };
          return localdata.save(item);
        })
        .then(() => {
          // guardar contactos refrescados
          dispatch(saveContacts());
        });
    }
  };
};

import { stylesObj } from '../util';

var titleFontSize = 19;
var titleSpacing = 11;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 12;
var fontName = 'Franklin Gothic Medium';
var indicadorSpacing = 18;
var bloqueSpacing = 5;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var primerColumnaX = 30;
var segundaColumnaX = 330;
/* eslint-disable */
export const generatePDF = (canto, lines) => {
  return dispatch => {
    // Para centrar titulo
    return PDFLib.measureText(
      canto.titulo.toUpperCase(),
      fontName,
      titleFontSize
    ).then(sizeTitle => {
      // Para centrar fuente
      return PDFLib.measureText(canto.fuente, fontName, fuenteFontSize)
        .then(sizeFuente => {
          const page1 = PDFPage.create().setMediaBox(
            widthHeightPixels,
            widthHeightPixels
          );
          var y = 560;
          var x = primerColumnaX;
          var titleX = parseInt((widthHeightPixels - sizeTitle.width) / 2);
          page1.drawText(canto.titulo.toUpperCase(), {
            x: titleX,
            y: y,
            color: stylesObj.titulo.color,
            fontSize: titleFontSize,
            fontName: fontName
          });
          y -= titleSpacing;
          var fuenteX = parseInt((widthHeightPixels - sizeFuente.width) / 2);
          page1.drawText(canto.fuente, {
            x: fuenteX,
            y: y,
            color: stylesObj.lineaNormal.color,
            fontSize: fuenteFontSize,
            fontName: fontName
          });
          y -= fuenteSpacing;
          var yStart = y;
          lines.forEach((it, index) => {
            // Mantener los bloques siempre juntos
            // Los bloques comienzan donde hay notas del 'canto con indicador' (A. S. etc)
            // Solo si estamos en la primer columna, calculamos si puede
            // pintarse por completo el bloque sin cortes; caso contrario
            // generamos la 2da columna
            if (it.notasCantoConIndicador && x === primerColumnaX) {
              var altoBloque = cantoSpacing * 2; // la linea de notas y del canto con indicador
              var i = index + 2; // Comenzar en la linea siguiente al canto con indicador
              while (i < lines.length && !lines[i].cantoConIndicador) {
                altoBloque += cantoSpacing;
                i += 1;
              }
              if (y - altoBloque <= 35) {
                x = segundaColumnaX;
                y = yStart;
              }
            }
            if (it.notas === true) {
              if (it.notasCantoConIndicador) {
                y -= bloqueSpacing;
              }
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: stylesObj.lineaNotas.color,
                fontSize: notesFontSize,
                fontName: fontName
              });
            } else if (it.canto === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: stylesObj.lineaNormal.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
            } else if (it.cantoConIndicador === true) {
              page1
                .drawText(it.prefijo, {
                  x: x,
                  y: y,
                  color: stylesObj.prefijo.color,
                  fontSize: cantoFontSize,
                  fontName: fontName
                })
                .drawText(it.texto, {
                  x: x + indicadorSpacing,
                  y: y,
                  color: stylesObj.lineaNormal.color,
                  fontSize: cantoFontSize,
                  fontName: fontName
                });
            }
            y -= cantoSpacing;
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
};
