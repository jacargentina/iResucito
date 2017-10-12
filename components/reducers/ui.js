import { Platform } from 'react-native';
import {
  INITIALIZE_DONE,
  SET_SALMOS_FILTER,
  SET_SALMO_CONTENT,
  SET_ABOUT_VISIBLE,
  SET_SETTINGS_VALUE,
  SET_LIST_CHOOSER_VISIBLE,
  SET_LIST_ADD_VISIBLE,
  SET_LIST_CREATE_NEW,
  SET_SALMOS_SELECTED,
  LIST_CREATE,
  LIST_CREATE_NAME,
  LIST_ADD_SALMO,
  LIST_REMOVE_SALMO,
  LIST_DELETE
} from '../actions';
import { NavigationActions } from 'react-navigation';
import { List, Map, fromJS } from 'immutable';
import { esLineaDeNotas } from '../screens/SalmoDetail';
import { localdata, clouddata } from '../data';

const initialState = Map({
  salmos: null,
  salmos_text_filter: null,
  salmos_filter: null,
  salmo_selected: null,
  salmo_lines: null,
  about_visible: false,
  list_create_name: '',
  list_create_enabled: false,
  list_chooser_visible: false,
  list_add_visible: false,
  list_create_new: false,
  lists: Map(),
  settings: Map({
    keepAwake: true
  })
});

const saveLists = state => {
  var listsJS = state.get('lists').toJS();
  var item = { key: 'lists', data: listsJS };
  localdata.save(item);
  if (Platform.OS == 'ios') {
    clouddata.save(item);
  }
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      state = state.set('salmos', action.salmos);
      if (action.settings) {
        state = state.set('settings', Map(action.settings));
      }
      if (action.lists) {
        state = state.set('lists', fromJS(action.lists));
      }
      return state;
    case SET_SALMOS_FILTER:
      return state.set('salmos_text_filter', action.filter);
    case SET_ABOUT_VISIBLE:
      return state.set('about_visible', action.visible);
    case SET_SETTINGS_VALUE:
      state = state.setIn(['settings', action.key], action.value);
      localdata.save({ key: 'settings', data: state.get('settings').toJS() });
      return state;
    case SET_SALMOS_SELECTED:
      return state.set('salmo_selected', action.salmo);
    case SET_LIST_CHOOSER_VISIBLE:
      return state.set('list_chooser_visible', action.visible);
    case SET_LIST_ADD_VISIBLE:
      return state.set('list_add_visible', action.visible);
    case SET_LIST_CREATE_NEW:
      return state.set('list_create_new', action.value);
    case LIST_CREATE_NAME:
      state = state.set('list_create_name', action.name);
      var lists = state
        .get('lists')
        .keySeq()
        .toArray();
      return state.set(
        'list_create_enabled',
        action.name && action.name.trim() !== '' && !lists.includes(action.name)
      );
    case LIST_CREATE:
      var listName = state.get('list_create_name');
      if (!state.getIn(['lists', listName])) {
        state = state.setIn(['lists', listName], List());
      }
      saveLists(state);
      state = state.set('list_create_name', null);
      state = state.set('list_create_enabled', false);
      return state;
    case LIST_ADD_SALMO:
      var salmo = state.get('salmo_selected');
      var list = state.getIn(['lists', action.list.name]);
      if (list.includes(salmo.nombre)) {
        return state;
      }
      state = state.setIn(['lists', action.list.name, list.size], salmo.nombre);
      saveLists(state);
      return state;
    case LIST_REMOVE_SALMO:
      var rList = state.getIn(['lists', action.list.name]);
      var index = rList.indexOf(action.salmo.nombre);
      state = state.deleteIn(['lists', action.list.name, index]);
      saveLists(state);
      return state;
    case LIST_DELETE:
      state = state.deleteIn(['lists', action.list.name]);
      saveLists(state);
      return state;
    case SET_SALMO_CONTENT:
      // Quitar caracteres invisibles del comienzo
      var lineas = action.content.split('\n');
      while (!esLineaDeNotas(lineas[0])) {
        lineas.shift();
      }
      lineas = lineas.filter(l => !l.includes('Page (0) Break'));
      return state.set('salmo_lines', lineas);
    case NavigationActions.NAVIGATE:
      switch (action.routeName) {
        case 'SalmoList':
          state = state.set('salmos_text_filter', null);
          return state.set('salmos_filter', action.params.filter);
        case 'SalmoDetail':
          return state.set('salmo_selected', action.params.salmo);
      }
      return state;
    default:
      return state;
  }
}
