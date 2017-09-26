import React from 'react';
import { Badge, Text } from 'native-base';
import { INITIALIZE_DONE, SET_SALMOS_FILTER } from '../actions';
import { NavigationActions } from 'react-navigation';
import { Map } from 'immutable';

const createBadge = (backgroundColor, color, text) => {
  return (
    <Badge style={{ backgroundColor: backgroundColor }}>
      <Text style={{ color: color }}>{text}</Text>
    </Badge>
  );
};

const badges = {
  Alfabético: createBadge('blue', 'white', 'A'),
  Precatecumenado: createBadge('#ecf0f1', 'black', 'P'),
  Catecumenado: createBadge('#3498db', 'white', 'C'),
  Eleccion: createBadge('#2ecc71', 'white', 'E'),
  Liturgia: createBadge('#f1c40f', 'white', 'L')
};

const menu = [
  {
    title: 'Alfabético',
    note: 'Todos los salmos en orden alfabético',
    route: 'List',
    badge: badges.Alfabético
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
    title: 'Eleccion',
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

const initialState = Map({
  salmos: null,
  salmos_filter: null,
  salmos_categoria: null,
  salmo_detail: null,
  menu: menu,
  badges: badges
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      return state.set('salmos', action.salmos);
    case SET_SALMOS_FILTER:
      return state.set('salmos_filter', action.filter);
    case NavigationActions.NAVIGATE:
      switch (action.routeName) {
        case 'List':
          return state.set(
            'salmos_categoria',
            action.params ? action.params.categoria : null
          );
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
