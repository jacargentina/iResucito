// @flow
export const INITIALIZE_SETUP = 'INITIALIZE_SETUP';
export const INITIALIZE_SONGS = 'INITIALIZE_SONGS';
export const INITIALIZE_SINGLE_SONG = 'INITIALIZE_SINGLE_SONG';
export const INITIALIZE_LOCALE_SONGS = 'INITIALIZE_LOCALE_SONGS';
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
export const SET_CHOOSE_LOCALE_VISIBLE = 'SET_CHOOSE_LOCALE_VISIBLE';
export const SET_INDEX_PATCH_EXISTS = 'SET_INDEX_PATCH_EXISTS';

export const SALMO_TRANSPORT = 'SALMO_TRANSPORT';

export const LIST_CREATE = 'LIST_CREATE';
export const LIST_ADD_SONG = 'LIST_ADD_SONG';
export const LIST_ADD_TEXT = 'LIST_ADD_TEXT';
export const LIST_ADD_CONTACT = 'LIST_ADD_CONTACT';
export const LIST_REMOVE_SONG = 'LIST_REMOVE_SONG';
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
  getEsSalmo,
  stylesObj
} from '../util';
import search from '../search';
import SongsIndex from '../../songs';
import { localdata, clouddata } from '../data';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

const BaseSongsPath =
  Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/songs` : 'songs';

const SongsIndexPatchPath =
  RNFS.DocumentDirectoryPath + '/SongsIndexPatch.json';

export function initializeSetup(settings: any, lists: any, contacts: any) {
  return {
    type: INITIALIZE_SETUP,
    settings: settings,
    lists: lists,
    contacts: contacts || []
  };
}

export function initializeSongs(songs: Array<Song>) {
  return {
    type: INITIALIZE_SONGS,
    items: songs
  };
}

export function initializeSingleSong(song: Song) {
  return {
    type: INITIALIZE_SINGLE_SONG,
    song: song
  };
}

export function initializeLocaleSongs(songs: Array<string>) {
  return {
    type: INITIALIZE_LOCALE_SONGS,
    items: songs
  };
}

export function openChooserDialog(chooser: string, list: string, key: string) {
  return {
    type: SET_CHOOSER_TARGETLIST,
    chooser: chooser,
    list: list,
    key: key
  };
}

export function closeChooserDialog() {
  return {
    type: SET_CHOOSER_TARGETLIST,
    chooser: null,
    list: null,
    key: null
  };
}

export function addSalmoToList(salmo: Song, listName: string, listKey: string) {
  return {
    type: LIST_ADD_SONG,
    list: listName,
    key: listKey,
    salmo: salmo
  };
}

export function addContactToList(ct: any, listName: string, listKey: string) {
  return {
    type: LIST_ADD_CONTACT,
    list: listName,
    key: listKey,
    contact: ct
  };
}

function getItemForShare(listMap: any, key: string) {
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
}

export function shareList(listName: string, listMap: any) {
  /* eslint-disable no-unused-vars */
  return (dispatch: Function) => {
    var items = [];
    if (listMap.get('type') === 'libre') {
      var cantos = listMap.get('items').toArray();
      cantos.forEach((canto, i) => {
        items.push(`${i}: ${canto.titulo}`);
      });
    } else {
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
}

export function sharePDF(canto: Song, pdfPath: string) {
  /* eslint-disable no-unused-vars */
  return (dispatch: Function) => {
    Share.share(
      {
        title: `iResucitó - ${canto.titulo}`,
        url: pdfPath
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };
}

export function shareIndexPatch() {
  /* eslint-disable no-unused-vars */
  return (dispatch: Function) => {
    Share.share(
      {
        title: 'iResucitó - Index patch',
        url: SongsIndexPatchPath
      },
      { dialogTitle: I18n.t('ui.share') }
    );
  };
}

export function updateListMapText(listName: string, key: string, text: string) {
  return { type: LIST_ADD_TEXT, list: listName, key: key, text: text };
}

export function deleteList(listName: string) {
  return { type: LIST_DELETE, list: listName };
}

export function deleteListSong(listName: string, key: string) {
  return { type: LIST_REMOVE_SONG, list: listName, key: key };
}

export function showListAddDialog() {
  return { type: SET_LIST_ADD_VISIBLE, visible: true };
}

export function hideListAddDialog() {
  return { type: SET_LIST_ADD_VISIBLE, visible: false };
}

export function setSalmosFilterText(inputId: string, text: string) {
  return { type: SET_SALMOS_FILTER, inputId: inputId, filter: text };
}

export function salmoTransport(transportTo: string) {
  return { type: SALMO_TRANSPORT, transportTo: transportTo };
}

export function showChooseLocaleDialog(salmo: any) {
  return { type: SET_CHOOSE_LOCALE_VISIBLE, visible: true, salmo: salmo };
}

export function hideChooseLocaleDialog() {
  return { type: SET_CHOOSE_LOCALE_VISIBLE, visible: false };
}

export function setIndexPatchExists(value: boolean) {
  return { type: SET_INDEX_PATCH_EXISTS, exists: value };
}

export function setContactsFilterText(inputId: string, text: string) {
  return { type: SET_CONTACTS_FILTER, inputId: inputId, filter: text };
}

export function showAbout() {
  return { type: SET_ABOUT_VISIBLE, visible: true };
}

export function hideAbout() {
  return { type: SET_ABOUT_VISIBLE, visible: false };
}

export function updateListAddName(text: string) {
  return { type: SET_LIST_ADD_NAME, name: text };
}

export function updateListAddType(type: string) {
  return { type: SET_LIST_ADD_TYPE, value: type };
}

export function createList(name: string, type: ListType) {
  return { type: LIST_CREATE, name: name, list_type: type };
}

export function applySetting(key: string, value: any) {
  return { type: SET_SETTINGS_VALUE, key: key, value: value };
}

export function showContactImportDialog() {
  return (dispatch: Function) => {
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
}

export function hideContactImportDialog() {
  return { type: SET_CONTACT_IMPORT_VISIBLE, visible: false };
}

export function syncContact(contact: any) {
  return { type: CONTACT_SYNC, contact: contact };
}

export function updateContact(contact: any) {
  return { type: CONTACT_UPDATE, contact: contact };
}

export function setContactAttribute(contact: any, attribute: any) {
  return {
    type: CONTACT_TOGGLE_ATTRIBUTE,
    contact: contact,
    attribute: attribute
  };
}

function ordenAlfabetico(a: Song | SongFile, b: Song | SongFile) {
  if (a.titulo < b.titulo) {
    return -1;
  }
  if (a.titulo > b.titulo) {
    return 1;
  }
  return 0;
}

function getSongFileFromFilename(nombre: string) {
  var titulo = nombre.includes('-')
    ? nombre.substring(0, nombre.indexOf('-')).trim()
    : nombre;
  var fuente =
    titulo !== nombre ? nombre.substring(nombre.indexOf('-') + 1).trim() : '';
  return (SongFile = {
    nombre: nombre,
    titulo: titulo,
    fuente: fuente
  });
}

function assignInfoFromFile(info: Song, files: any, locale: string) {
  var parsed = getSongFileFromFilename(files[locale]);
  info.nombre = parsed.nombre;
  info.titulo = parsed.titulo;
  info.fuente = parsed.fuente;
  info.path = `${BaseSongsPath}/${locale}/${files[locale]}.txt`;
}

export function getSingleSongMeta(
  key: string,
  locale: string,
  patch: any
): Song {
  var info: Song = Object.assign({}, SongsIndex[key]);
  info.key = key;
  if (!info.files.hasOwnProperty(locale)) {
    assignInfoFromFile(info, info.files, 'es');
    info.patchable = true;
    if (patch && patch.hasOwnProperty(key)) {
      if (patch[key].hasOwnProperty(locale)) {
        info.patched = true;
        info.patchedTitle = info.titulo;
        assignInfoFromFile(info, patch[key], locale);
        info.files = Object.assign({}, info.files, patch[key]);
      }
    }
  } else {
    assignInfoFromFile(info, info.files, locale);
  }
  return info;
}

export function getSongsMeta(rawLoc: string, patch: any): Array<Song> {
  var locale = rawLoc.split('-')[0];
  var songs = Object.keys(SongsIndex).map(key => {
    return getSingleSongMeta(key, locale, patch);
  });
  songs.sort(ordenAlfabetico);
  return songs;
}

export function initializeSearch() {
  return {
    type: INITIALIZE_SEARCH,
    items: search()
  };
}

export function loadSingleSong(song: Song): Promise<any> {
  var loadSong =
    Platform.OS == 'ios'
      ? RNFS.readFile(song.path)
      : RNFS.readFileAssets(song.path);
  return loadSong
    .then(content => {
      // Separar en lineas, y quitar todas hasta llegar a las notas
      var lineas = content.replace('\r\n', '\n').split('\n');
      while (lineas.length && !esLineaDeNotas(lineas[0])) {
        lineas.shift();
      }
      song.lines = lineas;
      song.fullText = lineas.join(' ');
    })
    .catch(err => {
      song.error = err.message;
    });
}

export function loadSongs(songs: Array<Song>): Array<Promise<any>> {
  return songs.map(song => {
    return loadSingleSong(song);
  });
}

export function readLocaleSongs(rawLoc: string) {
  var locale = rawLoc.split('-')[0];
  var loadSongs =
    Platform.OS == 'ios'
      ? RNFS.readDir(`${BaseSongsPath}/${locale}`)
      : RNFS.readDirAssets(`${BaseSongsPath}/${locale}`);
  return loadSongs.then(items => {
    // Very important to call "normalize"
    // See editing.txt for details
    items = items
      .map(i => i.name)
      .filter(i => i.endsWith('.txt'))
      .map(i => i.replace('.txt', '').normalize())
      .map(i => getSongFileFromFilename(i));
    items.sort(ordenAlfabetico);
    return items;
  });
}

export function readLocalePatch() {
  return (dispatch: Function) => {
    return RNFS.exists(SongsIndexPatchPath).then(exists => {
      dispatch(setIndexPatchExists(exists));
      if (exists)
        return RNFS.readFile(SongsIndexPatchPath).then(patchJSON => {
          return JSON.parse(patchJSON);
        });
    });
  };
}

export function saveLocalePatch(patchObj: any) {
  return (dispatch: Function) => {
    var json = JSON.stringify(patchObj, null, ' ');
    return RNFS.writeFile(SongsIndexPatchPath, json, 'utf8').then(() => {
      return dispatch(setIndexPatchExists(true));
    });
  };
}

export function initializeLocale(locale: string) {
  return (dispatch: Function) => {
    if (locale === 'default') {
      locale = getDefaultLocale();
    }
    I18n.defaultLocale = locale;
    I18n.locale = locale;
    // Construir menu de búsqueda
    dispatch(initializeSearch());
    // Cargar parche del indice si existe
    return dispatch(readLocalePatch())
      .then(patchObj => {
        // Construir metadatos de cantos
        var songs = getSongsMeta(locale, patchObj);
        return Promise.all(loadSongs(songs)).then(() => {
          dispatch(initializeSongs(songs));
        });
      })
      .then(() => {
        return readLocaleSongs(locale).then(items => {
          dispatch(initializeLocaleSongs(items));
        });
      });
  };
}

export function saveLists() {
  return (dispatch: Function, getState: Function) => {
    var listsJS = getState()
      .ui.get('lists')
      .toJS();
    var item = { key: 'lists', data: listsJS };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };
}

export function saveContacts() {
  return (dispatch: Function, getState: Function) => {
    var contactsJS = getState()
      .ui.get('contacts')
      .toJS();
    var item = { key: 'contacts', data: contactsJS };
    localdata.save(item);
    if (Platform.OS == 'ios') {
      clouddata.save(item);
    }
  };
}

export function saveSettings() {
  return (dispatch: Function, getState: Function) => {
    return localdata.save({
      key: 'settings',
      data: getState()
        .ui.get('settings')
        .toJS()
    });
  };
}

function getContacts() {
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

export function refreshContactsThumbs(cacheDir: string, newCacheDir: string) {
  return (dispatch: Function, getState: Function) => {
    // sólo actualizar si cambió el directorio de caches
    if (cacheDir !== newCacheDir) {
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
}

var titleFontSize = 19;
var titleSpacing = 11;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 11;
var fontName = 'Franklin Gothic Medium';
var indicadorSpacing = 18;
var parrafoSpacing = 6;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var primerColumnaX = 30;
var segundaColumnaX = 330;

/* eslint-disable */
export function generatePDF(canto: Song, lines: Array<SongLine>) {
  return (dispatch: Function) => {
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
                color: stylesObj.lineaNotas.color,
                fontSize: notesFontSize,
                fontName: fontName
              });
              y -= cantoSpacing;
            } else if (it.canto === true) {
              page1.drawText(it.texto, {
                x: x + indicadorSpacing,
                y: y,
                color: stylesObj.lineaNormal.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
              y -= cantoSpacing;
            } else if (it.cantoConIndicador === true) {
              page1.drawText(it.prefijo, {
                x: x,
                y: y,
                color: stylesObj.prefijo.color,
                fontSize: cantoFontSize,
                fontName: fontName
              });
              if (it.tituloEspecial === true) {
                page1.drawText(it.texto, {
                  x: x + indicadorSpacing,
                  y: y,
                  color: stylesObj.lineaTituloNotaEspecial.color,
                  fontSize: cantoFontSize,
                  fontName: fontName
                });
              } else if (it.textoEspecial === true) {
                page1.drawText(it.texto, {
                  x: x + indicadorSpacing,
                  y: y,
                  color: stylesObj.lineaNotaEspecial.color,
                  fontSize: cantoFontSize - 3,
                  fontName: fontName
                });
              } else {
                page1.drawText(it.texto, {
                  x: x + indicadorSpacing,
                  y: y,
                  color: stylesObj.lineaNormal.color,
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
}

export function setSongLocalePatch(song: Song, locale: string, file?: string) {
  return (dispatch: Function) => {
    return dispatch(readLocalePatch()).then(patchObj => {
      if (!patchObj) patchObj = {};
      if (!patchObj[song.key]) patchObj[song.key] = {};
      if (file) {
        patchObj[song.key][locale] = file;
      } else {
        delete patchObj[song.key];
      }
      var updatedSong = getSingleSongMeta(song.key, locale, patchObj);
      return loadSingleSong(updatedSong)
        .then(() => {
          return dispatch(initializeSingleSong(updatedSong));
        })
        .then(() => {
          return dispatch(saveLocalePatch(patchObj));
        });
    });
  };
}

export function clearIndexPatch(locale: string) {
  return (dispatch: Function) => {
    return RNFS.exists(SongsIndexPatchPath).then(exists => {
      if (exists) {
        return RNFS.unlink(SongsIndexPatchPath).then(() => {
          dispatch(setIndexPatchExists(false));
          return dispatch(initializeLocale(locale));
        });
      }
    });
  };
}
