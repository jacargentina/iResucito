import React from 'react';
import { Badge, Text } from 'native-base';
import {
  INITIALIZE_DONE,
  SET_SALMOS_FILTER,
  SET_SALMO_CONTENT,
  SET_ABOUT_VISIBLE,
  SET_SETTINGS_VALUE
} from '../actions';
import { NavigationActions } from 'react-navigation';
import { Map } from 'immutable';
import { esLineaDeNotas } from '../screens/SalmoDetail';
import data from '../data';

const createBadge = (backgroundColor, color, text) => {
  return (
    <Badge style={{ backgroundColor: backgroundColor }}>
      <Text style={{ color: color }}>{text}</Text>
    </Badge>
  );
};

const colors = {
  Precatecumenado: '#EEEEEE',
  Catecumenado: '#81D4FA',
  Eleccion: '#C5E1A5',
  Liturgia: '#FFF59D'
};

const badges = {
  Alfabético: createBadge('#e67e22', 'white', 'A'),
  Precatecumenado: createBadge(colors.Precatecumenado, 'black', 'P'),
  Catecumenado: createBadge(colors.Catecumenado, 'black', 'C'),
  Eleccion: createBadge(colors.Eleccion, 'black', 'E'),
  Liturgia: createBadge(colors.Liturgia, 'black', 'L')
};

var menu = [
  {
    title: 'Alfabético',
    note: 'Todos los salmos en orden alfabético',
    route: 'List',
    params: {},
    badge: badges.Alfabético
  },
  {
    title: 'Etapa del Camino',
    divider: true
  },
  {
    title: 'Precatecumenado',
    note: 'Los salmos para la etapa del Precatecumenado',
    route: 'List',
    params: { filter: { etapa: 'Precatecumenado' } },
    badge: badges.Precatecumenado
  },
  {
    title: 'Catecumenado',
    note: 'Los salmos para la etapa del Catecumenado',
    route: 'List',
    params: { filter: { etapa: 'Catecumenado' } },
    badge: badges.Catecumenado
  },
  {
    title: 'Elección',
    note: 'Los salmos para la etapa de la Elección',
    route: 'List',
    params: { filter: { etapa: 'Eleccion' } },
    badge: badges.Eleccion
  },
  {
    title: 'Liturgia',
    note: 'Los salmos para las celebraciones litúrgicas',
    route: 'List',
    params: { filter: { etapa: 'Liturgia' } },
    badge: badges.Liturgia
  },
  {
    title: 'Tiempo litúrgico',
    divider: true
  },
  {
    title: 'Adviento',
    note: 'Los salmos para tiempo de Adviento',
    route: 'List',
    params: { filter: { adviento: true } },
    badge: null
  },
  {
    title: 'Navidad',
    note: 'Los salmos para tiempo de Navidad',
    route: 'List',
    params: { filter: { navidad: true } },
    badge: null
  },
  {
    title: 'Cuaresma',
    note: 'Los salmos para tiempo de Cuaresma',
    route: 'List',
    params: { filter: { cuaresma: true } },
    badge: null
  },
  {
    title: 'Pascua',
    note: 'Los salmos para tiempo de Pascua',
    route: 'List',
    params: { filter: { pascua: true } },
    badge: null
  },
  {
    title: 'Pentecostés',
    note: 'Los salmos para tiempo de Pentecostés',
    route: 'List',
    params: { filter: { pentecostes: true } },
    badge: null
  },
  {
    title: 'Orden litúrgico',
    divider: true
  },
  {
    title: 'Entrada',
    note: 'Los salmos para inicio de las liturgias',
    route: 'List',
    params: { filter: { entrada: true } },
    badge: null
  },
  {
    title: 'Paz y Ofrendas',
    note: 'Los salmos para el saludo de la paz y las ofrendas',
    route: 'List',
    params: { filter: { paz: true } },
    badge: null
  },
  {
    title: 'Fracción del Pan',
    note: 'Los salmos para la fracción del pan',
    route: 'List',
    params: { filter: { fraccion: true } },
    badge: null
  },
  {
    title: 'Comunión',
    note: 'Los salmos para la comunión',
    route: 'List',
    params: { filter: { comunion: true } },
    badge: null
  },
  {
    title: 'Final',
    note: 'Los salmos para la salida de las liturgias',
    route: 'List',
    params: { filter: { final: true } },
    badge: null
  },
  {
    title: 'Cantos a la Virgen',
    note: 'Los salmos dedicados a la Virgen María',
    route: 'List',
    params: { filter: { virgen: true } },
    badge: null
  },
  {
    title: 'Cantos de los Niños',
    note: 'Los salmos para los niños',
    route: 'List',
    params: { filter: { niños: true } },
    badge: null
  },
  {
    title: 'Laúdes y Vísperas',
    note: 'Los salmos de Laúdes y Vísperas',
    route: 'List',
    params: { filter: { laudes: true } },
    badge: null
  }
];

menu = menu.map(item => {
  if (item.params) {
    item.params.title = item.title;
  }
  return item;
});

const initialState = Map({
  salmos: null,
  salmos_text_filter: null,
  salmos_filter: null,
  salmo_detail: null,
  salmo_lines: null,
  menu: menu,
  badges: badges,
  colors: colors,
  about_visible: false,
  settings: Map({
    keepAwake: true
  })
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      state = state.set('salmos', action.salmos);
      if (action.settings) {
        state = state.set('settings', Map(action.settings));
      }
      return state;
    case SET_SALMOS_FILTER:
      return state.set('salmos_text_filter', action.filter);
    case SET_ABOUT_VISIBLE:
      return state.set('about_visible', action.visible);
    case SET_SETTINGS_VALUE:
      state = state.setIn(['settings', action.key], action.value);
      data.save({ key: 'settings', data: state.get('settings').toJS() });
      return state;
    case SET_SALMO_CONTENT:
      // Quitar caracteres invisibles del comienzo
      var lineas = action.content.split('\n');
      while (!esLineaDeNotas(lineas[0])) {
        lineas.shift();
      }
      var lineas = lineas.filter(l => !l.includes('Page (0) Break'));
      return state.set('salmo_lines', lineas);
    case NavigationActions.NAVIGATE:
      switch (action.routeName) {
        case 'List':
          state = state.set('salmos_text_filter', null);
          return state.set('salmos_filter', action.params.filter);
        case 'Detail':
          return state.set('salmo_detail', action.params.salmo);
      }
      return state;
    default:
      return state;
  }
}
