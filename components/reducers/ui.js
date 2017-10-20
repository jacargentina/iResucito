import { Platform, Share } from 'react-native';
import {
  INITIALIZE_DONE,
  SET_SALMOS_FILTER,
  SET_SALMO_CONTENT,
  SET_ABOUT_VISIBLE,
  SET_SETTINGS_VALUE,
  SET_LIST_CHOOSER_SALMO,
  SET_LIST_ADD_VISIBLE,
  SET_LIST_CREATE_NEW,
  LIST_CREATE,
  LIST_CREATE_NAME,
  LIST_ADD_SALMO,
  LIST_REMOVE_SALMO,
  LIST_DELETE,
  LIST_SHARE
} from '../actions';
import { NavigationActions } from 'react-navigation';
import { Map, fromJS } from 'immutable';
import { esLineaDeNotas } from '../screens/SalmoDetail';
import { localdata, clouddata } from '../data';

const initialState = Map({
  salmos: null,
  salmos_text_filter: null,
  salmos_filter: null,
  salmo_lines: null,
  about_visible: false,
  list_create_name: '',
  list_create_enabled: false,
  list_chooser_salmo: null,
  list_add_visible: false,
  list_add_salmo: null,
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
    case SET_LIST_CHOOSER_SALMO:
      return state.set('list_chooser_salmo', action.salmo);
    case SET_LIST_ADD_VISIBLE:
      state = state.set('list_add_visible', action.visible);
      state = state.set('list_add_salmo', action.salmo);
      if (!action.visible) {
        state = state.set('list_create_name', null);
        state = state.set('list_create_enabled', false);
      }
      return state;
    case SET_LIST_CREATE_NEW:
      return state.set('list_create_new', action.value);
    case LIST_CREATE_NAME:
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
            break;
          case 'palabra':
            schema = schema.set('entrada', null);
            schema = schema.set('1', null);
            schema = schema.set('2', null);
            schema = schema.set('3', null);
            schema = schema.set('4', null);
            schema = schema.set('salida', null);
            break;
          case 'eucaristia':
            schema = schema.set('entrada', null);
            schema = schema.set('1', null);
            schema = schema.set('2', null);
            schema = schema.set('3', null);
            schema = schema.set('paz', null);
            schema = schema.set('comunion', null);
            schema = schema.set('salida', null);
            break;
        }
        state = state.setIn(['lists', action.name], schema);
      }
      saveLists(state);
      return state;
    case LIST_ADD_SALMO:
      var list = state.getIn(['lists', action.list]);
      state = state.setIn(
        ['lists', action.list, list.size],
        action.salmo.nombre
      );
      saveLists(state);
      return state;
    case LIST_REMOVE_SALMO:
      var rList = state.getIn(['lists', action.list]);
      var index = rList.indexOf(action.salmo.nombre);
      state = state.deleteIn(['lists', action.list, index]);
      saveLists(state);
      return state;
    case LIST_DELETE:
      state = state.deleteIn(['lists', action.list]);
      saveLists(state);
      return state;
    case LIST_SHARE:
      var textItems = action.items.map((item, i) => {
        return `${i + 1}. ${item.titulo}`;
      });
      Share.share(
        {
          message: textItems.join('\n'),
          title: `Lista iResucitó ${action.list}`,
          url: undefined
        },
        { dialogTitle: 'Compartir lista iResucitó' }
      );
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
      }
      return state;
    default:
      return state;
  }
}
