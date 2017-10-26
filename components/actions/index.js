export const INITIALIZE_DONE = 'INITIALIZE_DONE';

export const SET_SALMOS_FILTER = 'SET_SALMOS_FILTER';
export const SET_SALMO_CONTENT = 'SET_SALMO_CONTENT';
export const SET_ABOUT_VISIBLE = 'SET_ABOUT_VISIBLE';
export const SET_SETTINGS_VALUE = 'SET_SETTINGS_VALUE';
export const SET_CHOOSER_TARGETLIST = 'SET_CHOOSER_TARGETLIST';
export const SET_LIST_ADD_VISIBLE = 'SET_LIST_ADD_VISIBLE';
export const SET_LIST_ADD_TYPE = 'SET_LIST_ADD_TYPE';
export const SET_LIST_ADD_NAME = 'SET_LIST_ADD_NAME';
export const SET_CONTACT_IMPORT_VISIBLE = 'SET_CONTACT_IMPORT_VISIBLE';
export const SET_CONTACT_IMPORT_LOADING = 'SET_CONTACT_IMPORT_LOADING';
export const SET_CONTACT_IMPORT_ITEMS = 'SET_CONTACT_IMPORT_ITEMS';

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

export const filterSalmoList = text => {
  return { type: SET_SALMOS_FILTER, filter: text };
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

export const setSalmoContent = content => {
  return { type: SET_SALMO_CONTENT, content };
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

export const syncContact = (contact, isImported) => {
  return { type: CONTACT_SYNC, contact: contact, imported: isImported };
};

export const setContactAttribute = (contact, attribute) => {
  return {
    type: CONTACT_TOGGLE_ATTRIBUTE,
    contact: contact,
    attribute: attribute
  };
};
