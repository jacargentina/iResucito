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

import { Alert, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import I18n from '../../i18n';
import { esLineaDeNotas } from '../util';
import search from '../search';
import Indice from '../../Indice.json';

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

export const shareList = (listName, listMap) => {
  return { type: LIST_SHARE, list: listName, listMap: listMap };
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

export const saveSetting = (key, value) => {
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
  var songs = Object.keys(Indice);
  songs = songs.map(key => {
    var localeOk = Indice[key].files.hasOwnProperty(locale);
    var nombre = localeOk ? Indice[key].files[locale] : Indice[key].files['es'];
    var path = localeOk
      ? `${basePath}Salmos/${locale}/${nombre}.txt`
      : `${basePath}Salmos/es/${nombre}.txt`;
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
    return Object.assign(Indice[key], info);
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
        var lineas = content.split('\n');
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

export const initializeLocale = () => {
  return (dispatch, getState) => {
    var locale = getState().ui.getIn(['settings','locale']);
    if (locale === 'default') {
      locale = require('react-native').NativeModules.RNI18n.languages[0];
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
