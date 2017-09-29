import React from 'react';
import { Badge, Text } from 'native-base';
import {
  INITIALIZE_DONE,
  SET_SALMOS_FILTER,
  SET_SALMO_CONTENT
} from '../actions';
import { NavigationActions } from 'react-navigation';
import { Map } from 'immutable';
import { esLineaDeNotas } from '../screens/SalmoDetail';

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
    params: { categoria: null },
    badge: badges.Alfabético
  },
  {
    title: 'Por Etapa',
    divider: true
  },
  {
    title: 'Precatecumenado',
    note: 'Los salmos para la etapa del Precatecumenado',
    route: 'List',
    params: { categoria: 'Precatecumenado' },
    badge: badges.Precatecumenado
  },
  {
    title: 'Catecumenado',
    note: 'Los salmos para la etapa del Catecumenado',
    route: 'List',
    params: { categoria: 'Catecumenado' },
    badge: badges.Catecumenado
  },
  {
    title: 'Elección',
    note: 'Los salmos para la etapa de la Elección',
    route: 'List',
    params: { categoria: 'Eleccion' },
    badge: badges.Eleccion
  },
  {
    title: 'Liturgia',
    note: 'Los salmos para las celebraciones litúrgicas',
    route: 'List',
    params: { categoria: 'Liturgia' },
    badge: badges.Liturgia
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
  salmos_filter: null,
  salmos_categoria: null,
  salmo_detail: null,
  salmo_lines: null,
  menu: menu,
  badges: badges,
  colors: colors,
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      return state.set('salmos', action.salmos);
    case SET_SALMOS_FILTER:
      return state.set('salmos_filter', action.filter);
    case SET_SALMO_CONTENT:
      // Quitar caracteres invisibles del comienzo
      var lineas = action.content.split('\n');
      while (!esLineaDeNotas(lineas[0])) {
        lineas.shift();
      }
      var lineas = lineas.filter(l => !l.includes('Page (0) Break'));
      return state.set('salmo_lines', lineas);
      break;
    case NavigationActions.NAVIGATE:
      switch (action.routeName) {
        case 'List':
          return state.set('salmos_categoria', action.params.categoria);
          break;
        case 'Detail':
          return state.set('salmo_detail', action.params.salmo);
          break;
      }
      return state;
    default:
      return state;
  }
}
