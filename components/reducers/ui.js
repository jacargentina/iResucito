// @flow
import {
  INITIALIZE_SETUP,
  INITIALIZE_SEARCH,
  INITIALIZE_SONGS,
  SET_SALMOS_FILTER,
  SET_CONTACTS_FILTER,
  SET_ABOUT_VISIBLE,
  SET_SETTINGS_VALUE,
  SET_CHOOSER_TARGETLIST,
  SET_LIST_ADD_VISIBLE,
  SET_LIST_ADD_TYPE,
  SET_LIST_ADD_NAME,
  SET_CONTACT_IMPORT_VISIBLE,
  SET_CONTACT_IMPORT_LOADING,
  SET_CONTACT_IMPORT_ITEMS,
  SALMO_TRANSPORT,
  LIST_CREATE,
  LIST_ADD_SONG,
  LIST_ADD_TEXT,
  LIST_ADD_CONTACT,
  LIST_REMOVE_SONG,
  LIST_DELETE,
  CONTACT_SYNC,
  CONTACT_UPDATE,
  CONTACT_TOGGLE_ATTRIBUTE
} from '../actions';
import { Map, List, fromJS } from 'immutable';

const initialState = Map({
  search: [],
  salmos: null,
  salmos_text_filter: Map(),
  salmos_transport_note: null,
  contacts_text_filter: Map(),
  about_visible: false,
  list_create_name: '',
  list_create_enabled: false,
  list_chooser_salmo: null,
  list_add_visible: false,
  list_create_type: null,
  chooser: null,
  chooser_target_list: null,
  chooser_target_key: null,
  contact_import_visible: false,
  contact_import_loading: false,
  contact_import_items: [],
  lists: Map(),
  contacts: List(),
  settings: Map({
    keepAwake: true,
    locale: 'default'
  })
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_SEARCH:
      return state.set('search', action.items);
    case INITIALIZE_SONGS:
      return state.set('salmos', action.items);
    case INITIALIZE_SETUP:
      if (action.settings) {
        state = state.set('settings', Map(action.settings));
      }
      if (action.lists) {
        state = state.set('lists', fromJS(action.lists));
      }
      if (action.contacts) {
        state = state.set('contacts', fromJS(action.contacts));
      }
      return state;
    case SET_SALMOS_FILTER:
      return state.setIn(['salmos_text_filter', action.inputId], action.filter);
    case SET_CONTACTS_FILTER:
      return state.setIn(
        ['contacts_text_filter', action.inputId],
        action.filter
      );
    case SET_ABOUT_VISIBLE:
      return state.set('about_visible', action.visible);
    case SET_SETTINGS_VALUE:
      return state.setIn(['settings', action.key], action.value);
    case SET_CHOOSER_TARGETLIST:
      state = state.set('chooser', action.chooser);
      state = state.set('chooser_target_list', action.list);
      state = state.set('chooser_target_key', action.key);
      return state;
    case SET_LIST_ADD_VISIBLE:
      state = state.set('list_add_visible', action.visible);
      if (!action.visible) {
        state = state.set('list_create_name', null);
        state = state.set('list_create_enabled', false);
      }
      return state;
    case SET_CONTACT_IMPORT_VISIBLE:
      return state.set('contact_import_visible', action.visible);
    case SET_CONTACT_IMPORT_LOADING:
      return state.set('contact_import_loading', action.loading);
    case SET_CONTACT_IMPORT_ITEMS:
      var filtered = action.contacts.filter(
        c => c.givenName.length > 0 || c.familyName.length > 0
      );
      return state.set('contact_import_items', filtered);
    case SET_LIST_ADD_TYPE:
      return state.set('list_create_type', action.value);
    case SET_LIST_ADD_NAME:
      state = state.set('list_create_name', action.name);
      var candidateName = action.name.trim();
      var lists = state
        .get('lists')
        .keySeq()
        .toArray();
      var result = candidateName !== '' && !lists.includes(candidateName);
      return state.set('list_create_enabled', result);
    case LIST_CREATE:
      if (!state.getIn(['lists', action.name])) {
        let schema = Map({ type: action.list_type });
        switch (action.list_type) {
          case 'libre':
            schema = schema.set('items', List());
            break;
          case 'palabra':
            schema = schema.set('ambiental', null);
            schema = schema.set('entrada', null);
            schema = schema.set('1-monicion', null);
            schema = schema.set('1', null);
            schema = schema.set('1-salmo', null);
            schema = schema.set('2-monicion', null);
            schema = schema.set('2', null);
            schema = schema.set('2-salmo', null);
            schema = schema.set('3-monicion', null);
            schema = schema.set('3', null);
            schema = schema.set('3-salmo', null);
            schema = schema.set('evangelio-monicion', null);
            schema = schema.set('evangelio', null);
            schema = schema.set('salida', null);
            schema = schema.set('nota', null);
            break;
          case 'eucaristia':
            schema = schema.set('ambiental', null);
            schema = schema.set('entrada', null);
            schema = schema.set('1-monicion', null);
            schema = schema.set('1', null);
            schema = schema.set('2-monicion', null);
            schema = schema.set('2', null);
            schema = schema.set('evangelio-monicion', null);
            schema = schema.set('evangelio', null);
            schema = schema.set('paz', null);
            schema = schema.set('comunion-pan', null);
            schema = schema.set('comunion-caliz', null);
            schema = schema.set('salida', null);
            schema = schema.set('nota', null);
            break;
        }
        state = state.setIn(['lists', action.name], schema);
      }
      return state;
    case LIST_ADD_SONG:
      // Las listas de tipo 'libre' tienen claves numericas
      // y se colocan los salmos en la propiedad 'items'
      if (typeof action.key == 'number') {
        state = state.setIn(
          ['lists', action.list, 'items', action.key],
          action.salmo.nombre
        );
      } else {
        state = state.setIn(
          ['lists', action.list, action.key],
          action.salmo.nombre
        );
      }
      return state;
    case LIST_ADD_TEXT:
      state = state.setIn(['lists', action.list, action.key], action.text);
      return state;
    case LIST_ADD_CONTACT:
      var text = action.contact.givenName;
      state = state.setIn(['lists', action.list, action.key], text);
      return state;
    case LIST_REMOVE_SONG:
      state = state.deleteIn(['lists', action.list, 'items', action.key]);
      return state;
    case LIST_DELETE:
      state = state.deleteIn(['lists', action.list]);
      return state;
    case CONTACT_SYNC:
      var sContactsList = state.get('contacts');
      var sIndex = sContactsList.findIndex(
        c => c.get('recordID') == action.contact.recordID
      );
      // Ya esta importado
      if (sIndex !== -1) {
        state = state.deleteIn(['contacts', sIndex]);
      } else {
        // Importarlo
        state = state.setIn(
          ['contacts', sContactsList.size],
          Map(action.contact)
        );
      }
      return state;
    case CONTACT_UPDATE:
      var uContactsList = state.get('contacts');
      var uIndex = uContactsList.findIndex(
        c => c.get('recordID') == action.contact.recordID
      );
      return state.setIn(['contacts', uIndex], Map(action.contact));
    case CONTACT_TOGGLE_ATTRIBUTE:
      var tContacts = state.get('contacts');
      var tIndex = tContacts.findIndex(
        c => c.get('recordID') == action.contact.recordID
      );
      if (state.getIn(['contacts', tIndex, action.attribute]) == true) {
        state = state.setIn(['contacts', tIndex, action.attribute], false);
      } else {
        state = state.setIn(['contacts', tIndex, action.attribute], true);
      }
      return state;
    case SALMO_TRANSPORT:
      return state.set('salmos_transport_note', action.transportTo);
    default:
      return state;
  }
}
